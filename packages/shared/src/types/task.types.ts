// Task Management Types

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: number;
  reminderDate?: number;
  parentId?: string;
  position: number;
  categories: Category[];
  subtasks?: Task[];
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: number;
  reminderDate?: number;
  parentId?: string;
  categoryIds?: string[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: TaskStatus;
  position?: number;
}

export interface TaskFilters {
  status?: TaskStatus | TaskStatus[];
  priority?: Priority | Priority[];
  categoryIds?: string[];
  parentId?: string | null;
  search?: string;
  dueBefore?: number;
  dueAfter?: number;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
}
