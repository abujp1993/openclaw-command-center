import { useState, useRef, useEffect } from 'react';
import { GlassButton } from '../ui';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSend: (content: string) => void;
  onCancel: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onCancel, isStreaming, disabled }: ChatInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !disabled && !isStreaming) {
      onSend(content);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Select an AI provider to start chatting...' : 'Type a message...'}
          disabled={disabled || isStreaming}
          rows={1}
          className={styles.textarea}
        />

        <div className={styles.actions}>
          {isStreaming ? (
            <GlassButton
              type="button"
              variant="ghost"
              onClick={onCancel}
              className={styles.cancelButton}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop
            </GlassButton>
          ) : (
            <GlassButton
              type="submit"
              variant="accent"
              disabled={!content.trim() || disabled}
              className={styles.sendButton}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </GlassButton>
          )}
        </div>
      </div>

      <div className={styles.hint}>
        <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
      </div>
    </form>
  );
}
