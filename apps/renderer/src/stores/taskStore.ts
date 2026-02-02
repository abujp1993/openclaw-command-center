import { create } from 'zustand';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from '@openclaw/shared';

interface TaskState {
  // Data
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Filters
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;

  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task | null>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // Data
  tasks: [],
  isLoading: false,
  error: null,

  // Filters
  filters: {},
  setFilters: (filters) => set({ filters }),

  // Actions
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const filters = get().filters;
      const tasks = await window.openclaw?.tasks.list(filters) ?? [];
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createTask: async (input) => {
    try {
      const task = await window.openclaw?.tasks.create(input);
      if (task) {
        set((state) => ({ tasks: [task, ...state.tasks] }));
        return task;
      }
      return null;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },

  updateTask: async (id, data) => {
    try {
      const task = await window.openclaw?.tasks.update(id, data);
      if (task) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        }));
        return task;
      }
      return null;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },

  deleteTask: async (id) => {
    try {
      await window.openclaw?.tasks.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  completeTask: async (id) => {
    await get().updateTask(id, { status: 'completed' });
  },
}));
