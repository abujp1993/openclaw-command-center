import { useState, useEffect } from 'react';
import { Plus, Filter, CheckCircle2, Circle, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { useTaskStore } from '@/stores/taskStore';
import { useUIStore } from '@/stores/uiStore';
import styles from './TasksPage.module.css';
import type { Task, Priority } from '@openclaw/shared';
import clsx from 'clsx';

const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'var(--color-error)',
  medium: 'var(--color-warning)',
  low: 'var(--color-success)',
};

export function TasksPage() {
  const { tasks, isLoading, fetchTasks, createTask, completeTask, deleteTask } = useTaskStore();
  const { openQuickAdd } = useUIStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleQuickCreate = async () => {
    if (!newTaskTitle.trim()) return;
    await createTask({ title: newTaskTitle.trim() });
    setNewTaskTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickCreate();
    }
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Tasks</h1>
          <span className={styles.count}>{pendingTasks.length} pending</span>
        </div>
        <div className={styles.headerRight}>
          <GlassButton
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => openQuickAdd('task')}
          >
            New Task
          </GlassButton>
        </div>
      </header>

      {/* Quick Add */}
      <GlassCard className={styles.quickAdd}>
        <GlassInput
          placeholder="Quick add a task... Press Enter to create"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          icon={<Plus size={18} />}
        />
      </GlassCard>

      {/* Task List */}
      <section className={styles.section}>
        {isLoading ? (
          <div className={styles.loading}>Loading tasks...</div>
        ) : pendingTasks.length === 0 ? (
          <GlassCard variant="subtle" className={styles.emptyState}>
            <CheckCircle2 size={48} className={styles.emptyIcon} />
            <h3>No tasks yet</h3>
            <p>Create your first task to get started</p>
          </GlassCard>
        ) : (
          <div className={styles.taskList}>
            {pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={() => completeTask(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Completed ({completedTasks.length})
          </h2>
          <div className={styles.taskList}>
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={() => {}}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  onComplete: () => void;
  onDelete: () => void;
}

function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'completed';

  return (
    <GlassCard
      variant="subtle"
      padding="sm"
      className={clsx(styles.taskItem, isCompleted && styles.completed)}
    >
      <button
        className={styles.checkbox}
        onClick={onComplete}
        disabled={isCompleted}
      >
        {isCompleted ? (
          <CheckCircle2 size={20} color="var(--color-success)" />
        ) : (
          <Circle size={20} />
        )}
      </button>

      <div className={styles.taskContent}>
        <span className={styles.taskTitle}>{task.title}</span>
        {task.description && (
          <span className={styles.taskDescription}>{task.description}</span>
        )}
        <div className={styles.taskMeta}>
          {task.dueDate && (
            <span className={styles.dueDate}>
              <Clock size={12} />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          <span
            className={styles.priority}
            style={{ color: PRIORITY_COLORS[task.priority] }}
          >
            {task.priority}
          </span>
        </div>
      </div>

      <button className={styles.deleteButton} onClick={onDelete}>
        ×
      </button>
    </GlassCard>
  );
}
