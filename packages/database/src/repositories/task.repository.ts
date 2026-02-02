import type Database from 'better-sqlite3';
import { generateId, now } from '@openclaw/shared';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  Category,
} from '@openclaw/shared';

export class TaskRepository {
  constructor(private db: Database.Database) {}

  /**
   * List all tasks with optional filters
   */
  list(filters?: TaskFilters): Task[] {
    let sql = `
      SELECT
        t.*,
        GROUP_CONCAT(c.id || ':' || c.name || ':' || c.color, '|') as categories_data
      FROM tasks t
      LEFT JOIN task_categories tc ON t.id = tc.task_id
      LEFT JOIN categories c ON tc.category_id = c.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (filters?.status) {
      const statuses = Array.isArray(filters.status)
        ? filters.status
        : [filters.status];
      sql += ` AND t.status IN (${statuses.map(() => '?').join(',')})`;
      params.push(...statuses);
    }

    if (filters?.priority) {
      const priorities = Array.isArray(filters.priority)
        ? filters.priority
        : [filters.priority];
      sql += ` AND t.priority IN (${priorities.map(() => '?').join(',')})`;
      params.push(...priorities);
    }

    if (filters?.parentId !== undefined) {
      if (filters.parentId === null) {
        sql += ` AND t.parent_id IS NULL`;
      } else {
        sql += ` AND t.parent_id = ?`;
        params.push(filters.parentId);
      }
    }

    if (filters?.search) {
      sql += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern);
    }

    if (filters?.dueBefore) {
      sql += ` AND t.due_date <= ?`;
      params.push(filters.dueBefore);
    }

    if (filters?.dueAfter) {
      sql += ` AND t.due_date >= ?`;
      params.push(filters.dueAfter);
    }

    sql += ` GROUP BY t.id ORDER BY t.position ASC, t.created_at DESC`;

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as (TaskRow & { categories_data: string | null })[];

    return rows.map((row) => this.mapRowToTask(row));
  }

  /**
   * Get a single task by ID
   */
  get(id: string): Task | null {
    const stmt = this.db.prepare(`
      SELECT
        t.*,
        GROUP_CONCAT(c.id || ':' || c.name || ':' || c.color, '|') as categories_data
      FROM tasks t
      LEFT JOIN task_categories tc ON t.id = tc.task_id
      LEFT JOIN categories c ON tc.category_id = c.id
      WHERE t.id = ?
      GROUP BY t.id
    `);

    const row = stmt.get(id) as (TaskRow & { categories_data: string | null }) | undefined;
    if (!row) return null;

    const task = this.mapRowToTask(row);

    // Get subtasks
    task.subtasks = this.list({ parentId: id });

    return task;
  }

  /**
   * Create a new task
   */
  create(input: CreateTaskInput): Task {
    const id = generateId();
    const timestamp = now();

    const stmt = this.db.prepare(`
      INSERT INTO tasks (id, title, description, priority, due_date, reminder_date, parent_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.title,
      input.description ?? null,
      input.priority ?? 'medium',
      input.dueDate ?? null,
      input.reminderDate ?? null,
      input.parentId ?? null,
      timestamp,
      timestamp
    );

    // Add categories
    if (input.categoryIds?.length) {
      const insertCategory = this.db.prepare(
        'INSERT INTO task_categories (task_id, category_id) VALUES (?, ?)'
      );
      for (const categoryId of input.categoryIds) {
        insertCategory.run(id, categoryId);
      }
    }

    return this.get(id)!;
  }

  /**
   * Update a task
   */
  update(id: string, data: UpdateTaskInput): Task | null {
    const existing = this.get(id);
    if (!existing) return null;

    const updates: string[] = ['updated_at = ?'];
    const params: unknown[] = [now()];

    if (data.title !== undefined) {
      updates.push('title = ?');
      params.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description);
    }
    if (data.priority !== undefined) {
      updates.push('priority = ?');
      params.push(data.priority);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);
      if (data.status === 'completed') {
        updates.push('completed_at = ?');
        params.push(now());
      }
    }
    if (data.dueDate !== undefined) {
      updates.push('due_date = ?');
      params.push(data.dueDate);
    }
    if (data.reminderDate !== undefined) {
      updates.push('reminder_date = ?');
      params.push(data.reminderDate);
    }
    if (data.position !== undefined) {
      updates.push('position = ?');
      params.push(data.position);
    }

    params.push(id);

    const stmt = this.db.prepare(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`
    );
    stmt.run(...params);

    // Update categories if provided
    if (data.categoryIds !== undefined) {
      this.db.prepare('DELETE FROM task_categories WHERE task_id = ?').run(id);
      const insertCategory = this.db.prepare(
        'INSERT INTO task_categories (task_id, category_id) VALUES (?, ?)'
      );
      for (const categoryId of data.categoryIds) {
        insertCategory.run(id, categoryId);
      }
    }

    return this.get(id);
  }

  /**
   * Delete a task
   */
  delete(id: string): void {
    const stmt = this.db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(id);
  }

  /**
   * Map database row to Task object
   */
  private mapRowToTask(row: TaskRow & { categories_data: string | null }): Task {
    const categories: Category[] = row.categories_data
      ? row.categories_data.split('|').map((cat) => {
          const [id, name, color] = cat.split(':');
          return { id, name, color, createdAt: 0 };
        })
      : [];

    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      priority: row.priority as Task['priority'],
      status: row.status as Task['status'],
      dueDate: row.due_date ?? undefined,
      reminderDate: row.reminder_date ?? undefined,
      parentId: row.parent_id ?? undefined,
      position: row.position,
      categories,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at ?? undefined,
    };
  }
}

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: number | null;
  reminder_date: number | null;
  parent_id: string | null;
  position: number;
  created_at: number;
  updated_at: number;
  completed_at: number | null;
}
