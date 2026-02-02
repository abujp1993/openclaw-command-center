import type { Conversation } from '@openclaw/shared';
import { formatRelativeDate } from '@openclaw/shared';
import styles from './ConversationList.module.css';

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (conversation: Conversation) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
}: ConversationListProps) {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
  };

  if (conversations.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          className={`${styles.item} ${conversation.id === activeId ? styles.active : ''}`}
          onClick={() => onSelect(conversation)}
        >
          <div className={styles.content}>
            <span className={styles.title}>
              {conversation.title ?? 'New Conversation'}
            </span>
            <span className={styles.date}>
              {formatRelativeDate(conversation.updatedAt)}
            </span>
          </div>

          <button
            className={styles.deleteButton}
            onClick={(e) => handleDelete(e, conversation.id)}
            title="Delete conversation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </button>
      ))}
    </div>
  );
}
