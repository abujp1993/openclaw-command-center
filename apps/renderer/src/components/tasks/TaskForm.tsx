import { useState } from 'react';
import type { Priority, CreateTaskInput } from '@openclaw/shared';
import { useTaskStore } from '../../stores/taskStore';
import { GlassCard, GlassButton, GlassInput } from '../ui';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  parentId?: string;
  onClose: () => void;
  onSubmit: () => void;
}

export function TaskForm({ parentId, onClose, onSubmit }: TaskFormProps) {
  const { createTask } = useTaskStore();
  const categories: { id: string; name: string; color: string }[] = [];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsSubmitting(true);

    const input: CreateTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      parentId,
      categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    };

    try {
      await createTask(input);
      onSubmit();
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <GlassCard className={styles.form}>
      <form onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h3>{parentId ? 'Add Subtask' : 'Create Task'}</h3>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {/* Title */}
          <div className={styles.field}>
            <label htmlFor="title">Title</label>
            <GlassInput
              id="title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={styles.textarea}
            />
          </div>

          {/* Priority */}
          <div className={styles.field}>
            <label>Priority</label>
            <div className={styles.priorityOptions}>
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.priorityOption} ${styles[p]} ${priority === p ? styles.selected : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className={styles.field}>
            <label htmlFor="dueDate">Due Date (optional)</label>
            <GlassInput
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className={styles.field}>
              <label>Categories</label>
              <div className={styles.categories}>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`${styles.categoryChip} ${selectedCategories.includes(category.id) ? styles.selected : ''}`}
                    style={{
                      '--category-color': category.color,
                    } as React.CSSProperties}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <GlassButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton
            type="submit"
            variant="accent"
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </GlassButton>
        </div>
      </form>
    </GlassCard>
  );
}
