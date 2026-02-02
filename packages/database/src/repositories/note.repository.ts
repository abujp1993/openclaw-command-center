import type Database from 'better-sqlite3';
import { generateId, now } from '@openclaw/shared';
import type {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  NoteFilters,
  NoteSearchResult,
} from '@openclaw/shared';

export class NoteRepository {
  constructor(private db: Database.Database) {}

  /**
   * List all notes with optional filters
   */
  list(filters?: NoteFilters): Note[] {
    let sql = `
      SELECT
        n.*,
        GROUP_CONCAT(nt.tag, '|') as tags_data
      FROM notes n
      LEFT JOIN note_tags nt ON n.id = nt.note_id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (filters?.folderId !== undefined) {
      if (filters.folderId === null) {
        sql += ` AND n.folder_id IS NULL`;
      } else {
        sql += ` AND n.folder_id = ?`;
        params.push(filters.folderId);
      }
    }

    if (filters?.isPinned !== undefined) {
      sql += ` AND n.is_pinned = ?`;
      params.push(filters.isPinned ? 1 : 0);
    }

    if (filters?.linkedTaskId) {
      sql += ` AND n.linked_task_id = ?`;
      params.push(filters.linkedTaskId);
    }

    if (filters?.tags?.length) {
      sql += ` AND n.id IN (
        SELECT note_id FROM note_tags WHERE tag IN (${filters.tags.map(() => '?').join(',')})
      )`;
      params.push(...filters.tags);
    }

    sql += ` GROUP BY n.id ORDER BY n.is_pinned DESC, n.updated_at DESC`;

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as (NoteRow & { tags_data: string | null })[];

    return rows.map((row) => this.mapRowToNote(row));
  }

  /**
   * Get a single note by ID
   */
  get(id: string): Note | null {
    const stmt = this.db.prepare(`
      SELECT
        n.*,
        GROUP_CONCAT(nt.tag, '|') as tags_data
      FROM notes n
      LEFT JOIN note_tags nt ON n.id = nt.note_id
      WHERE n.id = ?
      GROUP BY n.id
    `);

    const row = stmt.get(id) as (NoteRow & { tags_data: string | null }) | undefined;
    if (!row) return null;

    return this.mapRowToNote(row);
  }

  /**
   * Create a new note
   */
  create(input: CreateNoteInput): Note {
    const id = generateId();
    const timestamp = now();

    const stmt = this.db.prepare(`
      INSERT INTO notes (id, title, content, folder_id, linked_task_id, is_pinned, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.title,
      input.content ?? null,
      input.folderId ?? null,
      input.linkedTaskId ?? null,
      input.isPinned ? 1 : 0,
      timestamp,
      timestamp
    );

    // Add tags
    if (input.tags?.length) {
      const insertTag = this.db.prepare(
        'INSERT INTO note_tags (note_id, tag) VALUES (?, ?)'
      );
      for (const tag of input.tags) {
        insertTag.run(id, tag);
      }
    }

    return this.get(id)!;
  }

  /**
   * Update a note
   */
  update(id: string, data: UpdateNoteInput): Note | null {
    const existing = this.get(id);
    if (!existing) return null;

    const updates: string[] = ['updated_at = ?'];
    const params: unknown[] = [now()];

    if (data.title !== undefined) {
      updates.push('title = ?');
      params.push(data.title);
    }
    if (data.content !== undefined) {
      updates.push('content = ?');
      params.push(data.content);
    }
    if (data.folderId !== undefined) {
      updates.push('folder_id = ?');
      params.push(data.folderId);
    }
    if (data.linkedTaskId !== undefined) {
      updates.push('linked_task_id = ?');
      params.push(data.linkedTaskId);
    }
    if (data.isPinned !== undefined) {
      updates.push('is_pinned = ?');
      params.push(data.isPinned ? 1 : 0);
    }

    params.push(id);

    const stmt = this.db.prepare(
      `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`
    );
    stmt.run(...params);

    // Update tags if provided
    if (data.tags !== undefined) {
      this.db.prepare('DELETE FROM note_tags WHERE note_id = ?').run(id);
      const insertTag = this.db.prepare(
        'INSERT INTO note_tags (note_id, tag) VALUES (?, ?)'
      );
      for (const tag of data.tags) {
        insertTag.run(id, tag);
      }
    }

    return this.get(id);
  }

  /**
   * Delete a note
   */
  delete(id: string): void {
    const stmt = this.db.prepare('DELETE FROM notes WHERE id = ?');
    stmt.run(id);
  }

  /**
   * Full-text search for notes
   */
  search(query: string): NoteSearchResult[] {
    const stmt = this.db.prepare(`
      SELECT
        n.*,
        GROUP_CONCAT(nt.tag, '|') as tags_data,
        snippet(notes_fts, 0, '<mark>', '</mark>', '...', 32) as snippet
      FROM notes_fts
      JOIN notes n ON notes_fts.rowid = n.rowid
      LEFT JOIN note_tags nt ON n.id = nt.note_id
      WHERE notes_fts MATCH ?
      GROUP BY n.id
      ORDER BY rank
      LIMIT 50
    `);

    const rows = stmt.all(query) as (NoteRow & { tags_data: string | null; snippet: string })[];

    return rows.map((row) => ({
      note: this.mapRowToNote(row),
      snippet: row.snippet,
      highlights: [], // TODO: Parse highlights from snippet
    }));
  }

  /**
   * Map database row to Note object
   */
  private mapRowToNote(row: NoteRow & { tags_data: string | null }): Note {
    return {
      id: row.id,
      title: row.title,
      content: row.content ?? undefined,
      folderId: row.folder_id ?? undefined,
      linkedTaskId: row.linked_task_id ?? undefined,
      isPinned: row.is_pinned === 1,
      tags: row.tags_data ? row.tags_data.split('|') : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

interface NoteRow {
  id: string;
  title: string;
  content: string | null;
  folder_id: string | null;
  linked_task_id: string | null;
  is_pinned: number;
  created_at: number;
  updated_at: number;
}
