// Date utility functions

/**
 * Get current timestamp in milliseconds
 */
export function now(): number {
  return Date.now();
}

/**
 * Format a timestamp for display
 */
export function formatDate(timestamp: number, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(timestamp).toLocaleDateString(undefined, options ?? defaultOptions);
}

/**
 * Format a timestamp as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const diff = now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(timestamp);
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

/**
 * Format a due date with contextual text
 */
export function formatDueDate(timestamp: number): { text: string; isOverdue: boolean; isToday: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(timestamp);
  dueDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: diffDays === -1 ? 'Yesterday' : `${Math.abs(diffDays)} days overdue`,
      isOverdue: true,
      isToday: false,
    };
  } else if (diffDays === 0) {
    return { text: 'Today', isOverdue: false, isToday: true };
  } else if (diffDays === 1) {
    return { text: 'Tomorrow', isOverdue: false, isToday: false };
  } else if (diffDays < 7) {
    return { text: `In ${diffDays} days`, isOverdue: false, isToday: false };
  } else {
    return { text: formatDate(timestamp), isOverdue: false, isToday: false };
  }
}

/**
 * Get start and end of day for a timestamp
 */
export function getDayBounds(timestamp: number): { start: number; end: number } {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  const start = date.getTime();
  date.setHours(23, 59, 59, 999);
  const end = date.getTime();
  return { start, end };
}

/**
 * Check if a timestamp is today
 */
export function isToday(timestamp: number): boolean {
  const today = new Date();
  const date = new Date(timestamp);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
