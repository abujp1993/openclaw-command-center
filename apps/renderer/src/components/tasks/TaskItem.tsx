import { useState, useRef } from 'react';
import type { Task } from '@openclaw/shared';
import { formatRelativeTime as formatRelativeDate } from '@openclaw/shared';
import { useTaskStore } from '../../stores/taskStore';
import { GlassCard } from '../ui';
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Task;
  isSubtask?: boolean;
}

export function TaskItem({ task, isSubtask = false }: TaskItemProps) {
  const { updateTask, deleteTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggleComplete = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(task.id, { status: newStatus });
  };

  const handleToggleProgress = () => {
    const newStatus = task.status === 'in_progress' ? 'pending' : 'in_progress';
    updateTask(task.id, { status: newStatus });
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      updateTask(task.id, { title: editTitle.trim() });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.status === 'completed').length ?? 0;
  const totalSubtasks = task.subtasks?.length ?? 0;

  return (
    <div className={`${styles.wrapper} ${isSubtask ? styles.subtask : ''}`}>
      <GlassCard className={`${styles.item} ${task.status === 'completed' ? styles.completed : ''}`}>
        {/* Checkbox */}
        <button
          className={`${styles.checkbox} ${task.status === 'completed' ? styles.checked : ''}`}
          onClick={handleToggleComplete}
          aria-label={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.status === 'completed' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className={styles.content}>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className={styles.editInput}
            />
          ) : (
            <span
              className={styles.title}
              onDoubleClick={handleStartEdit}
            >
              {task.title}
            </span>
          )}

          {/* Meta info */}
          <div className={styles.meta}>
            {/* Priority badge */}
            <span className={`${styles.priority} ${styles[task.priority]}`}>
              {task.priority}
            </span>

            {/* Categories */}
            {task.categories?.map((category) => (
              <span
                key={category.id}
                className={styles.category}
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {category.name}
              </span>
            ))}

            {/* Due date */}
            {task.dueDate && (
              <span className={`${styles.dueDate} ${task.dueDate < Date.now() ? styles.overdue : ''}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {formatRelativeDate(task.dueDate)}
              </span>
            )}

            {/* Subtasks count */}
            {hasSubtasks && (
              <span className={styles.subtaskCount}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                {completedSubtasks}/{totalSubtasks}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Toggle in progress */}
          <button
            className={`${styles.actionButton} ${task.status === 'in_progress' ? styles.active : ''}`}
            onClick={handleToggleProgress}
            title={task.status === 'in_progress' ? 'Pause' : 'Start'}
          >
            {task.status === 'in_progress' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          {/* Expand subtasks */}
          {hasSubtasks && (
            <button
              className={styles.actionButton}
              onClick={() => setShowSubtasks(!showSubtasks)}
              title={showSubtasks ? 'Collapse' : 'Expand'}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ transform: showSubtasks ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}

          {/* More menu */}
          <div className={styles.menuWrapper}>
            <button
              className={styles.actionButton}
              onClick={() => setShowMenu(!showMenu)}
              title="More options"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {showMenu && (
              <div className={styles.menu}>
                <button onClick={handleStartEdit}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button className={styles.danger} onClick={handleDelete}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Subtasks */}
      {hasSubtasks && showSubtasks && (
        <div className={styles.subtasks}>
          {task.subtasks!.map((subtask) => (
            <TaskItem key={subtask.id} task={subtask} isSubtask />
          ))}
        </div>
      )}
    </div>
  );
}
