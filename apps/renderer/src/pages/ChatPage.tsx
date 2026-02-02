import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, Trash2, Plus } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import styles from './ChatPage.module.css';
import clsx from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (will be replaced with real API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `This is a placeholder response. To enable real AI chat, configure your API providers in Settings.\n\nYou said: "${userMessage.content}"`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <GlassButton
          variant="primary"
          icon={<Plus size={18} />}
          fullWidth
          onClick={handleClear}
        >
          New Chat
        </GlassButton>

        <div className={styles.conversationList}>
          {/* Placeholder for conversation history */}
          <GlassCard variant="subtle" padding="sm" className={styles.emptyConversations}>
            <p>No previous conversations</p>
          </GlassCard>
        </div>

        <div className={styles.sidebarFooter}>
          <GlassCard variant="subtle" padding="sm" className={styles.providerInfo}>
            <Bot size={16} />
            <span>No provider configured</span>
          </GlassCard>
        </div>
      </aside>

      {/* Chat Area */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Bot size={24} className={styles.botIcon} />
            <div>
              <h1 className={styles.title}>AI Chat</h1>
              <span className={styles.subtitle}>Ask me anything</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <GlassButton
              variant="ghost"
              icon={<Trash2 size={18} />}
              onClick={handleClear}
            >
              Clear
            </GlassButton>
          </div>
        </header>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <div className={styles.welcomeMessage}>
              <div className={styles.welcomeIcon}>
                <Bot size={48} />
              </div>
              <h2>Welcome to OpenClaw AI</h2>
              <p>
                Start a conversation with your AI assistant. Configure API
                providers in Settings to enable real AI responses.
              </p>
              <div className={styles.suggestions}>
                <GlassButton
                  variant="default"
                  onClick={() => setInput('What can you help me with?')}
                >
                  What can you help me with?
                </GlassButton>
                <GlassButton
                  variant="default"
                  onClick={() => setInput('How do I configure API providers?')}
                >
                  How to configure providers?
                </GlassButton>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={clsx(styles.message, styles[message.role])}
                >
                  <div className={styles.messageAvatar}>
                    {message.role === 'user' ? (
                      <User size={20} />
                    ) : (
                      <Bot size={20} />
                    )}
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageText}>{message.content}</div>
                    <div className={styles.messageTime}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={clsx(styles.message, styles.assistant)}>
                  <div className={styles.messageAvatar}>
                    <Bot size={20} />
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.typing}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <GlassCard className={styles.inputWrapper}>
            <textarea
              className={styles.input}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <GlassButton
              variant="primary"
              icon={<Send size={18} />}
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              Send
            </GlassButton>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
