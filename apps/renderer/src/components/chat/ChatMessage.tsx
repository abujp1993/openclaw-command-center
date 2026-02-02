import { useMemo } from 'react';
import type { Message } from '@openclaw/shared';
import { formatTime } from '@openclaw/shared';
import { CodeBlock } from './CodeBlock';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Parse content for code blocks
  const parsedContent = useMemo(() => {
    const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(message.content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: message.content.slice(lastIndex, match.index),
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < message.content.length) {
      parts.push({
        type: 'text',
        content: message.content.slice(lastIndex),
      });
    }

    return parts;
  }, [message.content]);

  // Format inline code and bold text
  const formatText = (text: string) => {
    // Handle inline code
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className={styles.inlineCode}>
            {part.slice(1, -1)}
          </code>
        );
      }
      // Handle bold text
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((boldPart, j) => {
        if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
          return <strong key={`${i}-${j}`}>{boldPart.slice(2, -2)}</strong>;
        }
        return boldPart;
      });
    });
  };

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      {/* Avatar */}
      <div className={styles.avatar}>
        {isUser ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.role}>{isUser ? 'You' : 'OpenClaw'}</span>
          <span className={styles.time}>{formatTime(message.createdAt)}</span>
        </div>

        <div className={styles.body}>
          {parsedContent.map((part, i) =>
            part.type === 'code' ? (
              <CodeBlock key={i} code={part.content} language={part.language} />
            ) : (
              <p key={i} className={styles.text}>
                {formatText(part.content)}
              </p>
            )
          )}

          {/* Streaming cursor */}
          {isStreaming && <span className={styles.cursor} />}
        </div>
      </div>
    </div>
  );
}
