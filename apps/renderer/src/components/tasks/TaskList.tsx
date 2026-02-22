import { useState } from 'react';
import type { Task, Priority, TaskStatus } from '@openclaw/shared';
import { useTaskStore } from '../../stores/taskStore';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { GlassCard, GlassButton, GlassInput } from '../ui';
import styles from './TaskList.module.css';

interface TaskListProps {
  showCompleted?: boolean;
}

export function TaskList({ showCompleted = false }: TaskListProps) {
  const { tasks, isLoading, filters, setFilters } = useTaskStore();
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !task.title.toLowerCase().includes(query) &&
        !task.description?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Status filter
    if (!showCompleted && task.status === 'completed') {
      return false;
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Category filter
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      if (!task.categories?.some((c) => filters.categoryIds!.includes(c.id))) {
        return false;
      }
    }

    return true;
  });

  // Group tasks by status
  const pendingTasks = filteredTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  const handlePriorityFilter = (priority: Priority | undefined) => {
    setFilters({ priority });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <GlassInput
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${!filters.priority ? styles.active : ''}`}
            onClick={() => handlePriorityFilter(undefined)}
          >
            All
          </button>
          <button
            className={`${styles.filterButton} ${styles.high} ${filters.priority === 'high' ? styles.active : ''}`}
            onClick={() => handlePriorityFilter('high')}
          >
            High
          </button>
          <button
            className={`${styles.filterButton} ${styles.medium} ${filters.priority === 'medium' ? styles.active : ''}`}
            onClick={() => handlePriorityFilter('medium')}
          >
            Medium
          </button>
          <button
            className={`${styles.filterButton} ${styles.low} ${filters.priority === 'low' ? styles.active : ''}`}
            onClick={() => handlePriorityFilter('low')}
          >
            Low
          </button>
        </div>

        <GlassButton
          variant="accent"
          onClick={() => setIsCreating(true)}
          className={styles.addButton}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Task
        </GlassButton>
      </div>

      {/* Task creation form */}
      {isCreating && (
        <TaskForm
          onClose={() => setIsCreating(false)}
          onSubmit={() => setIsCreating(false)}
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading tasks...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredTasks.length === 0 && (
        <GlassCard className={styles.empty}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 12h6M9 16h6" />
          </svg>
          <h3>No tasks yet</h3>
          <p>Create your first task to get started</p>
          <GlassButton variant="accent" onClick={() => setIsCreating(true)}>
            Create Task
          </GlassButton>
        </GlassCard>
      )}

      {/* Task groups */}
      {!isLoading && filteredTasks.length > 0 && (
        <div className={styles.groups}>
          {/* In Progress */}
          {inProgressTasks.length > 0 && (
            <div className={styles.group}>
              <h3 className={styles.groupTitle}>
                <span className={`${styles.statusDot} ${styles.inProgress}`} />
                In Progress
                <span className={styles.count}>{inProgressTasks.length}</span>
              </h3>
              <div className={styles.taskList}>
                {inProgressTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Pending */}
          {pendingTasks.length > 0 && (
            <div className={styles.group}>
              <h3 className={styles.groupTitle}>
                <span className={`${styles.statusDot} ${styles.pending}`} />
                Pending
                <span className={styles.count}>{pendingTasks.length}</span>
              </h3>
              <div className={styles.taskList}>
                {pendingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {showCompleted && completedTasks.length > 0 && (
            <div className={styles.group}>
              <h3 className={styles.groupTitle}>
                <span className={`${styles.statusDot} ${styles.completed}`} />
                Completed
                <span className={styles.count}>{completedTasks.length}</span>
              </h3>
              <div className={styles.taskList}>
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
