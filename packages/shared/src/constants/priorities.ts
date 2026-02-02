// Priority constants and colors
import type { Priority } from '../types/task.types.js';

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bgColor: string }> = {
  high: {
    label: 'High',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
  },
  medium: {
    label: 'Medium',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
  },
  low: {
    label: 'Low',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.15)',
  },
};

export const PRIORITY_ORDER: Priority[] = ['high', 'medium', 'low'];

export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: '#94a3b8',
    icon: 'circle',
  },
  in_progress: {
    label: 'In Progress',
    color: '#3b82f6',
    icon: 'loader',
  },
  completed: {
    label: 'Completed',
    color: '#22c55e',
    icon: 'check-circle',
  },
} as const;
