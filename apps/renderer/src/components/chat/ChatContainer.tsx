import { useEffect, useRef, useState } from 'react';
import type { Message, Conversation, StreamChunk } from '@openclaw/shared';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ConversationList } from './ConversationList';
import { ProviderSelector } from './ProviderSelector';
import { GlassCard } from '../ui';
import styles from './ChatContainer.module.css';

export function ChatContainer() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();

    // Subscribe to streaming events
    const cleanup = window.openclaw.ai.onStream(handleStreamChunk);
    return cleanup;
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    } else {
      setMessages([]);
    }
  }, [activeConversation?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const loadConversations = async () => {
    try {
      const data = await window.openclaw.conversations.list();
      setConversations(data);
      if (data.length > 0 && !activeConversation) {
        setActiveConversation(data[0]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const conversation = await window.openclaw.conversations.get(conversationId);
      if (conversation?.messages) {
        setMessages(conversation.messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleStreamChunk = (chunk: StreamChunk) => {
    if (chunk.type === 'text' && chunk.content) {
      setStreamingContent((prev) => prev + chunk.content);
    } else if (chunk.type === 'done') {
      // Add streamed message to the list
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          conversationId: activeConversation?.id ?? '',
          role: 'assistant',
          content: streamingContent,
          createdAt: Date.now(),
        },
      ]);
      setStreamingContent('');
      setIsStreaming(false);
    } else if (chunk.type === 'error') {
      console.error('Stream error:', chunk.error);
      setStreamingContent('');
      setIsStreaming(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const conversation = await window.openclaw.conversations.create({
        providerId: selectedProvider,
      });
      setConversations((prev) => [conversation, ...prev]);
      setActiveConversation(conversation);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await window.openclaw.conversations.delete(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversation?.id === id) {
        setActiveConversation(null);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    // Create new conversation if none exists
    if (!activeConversation) {
      await handleNewConversation();
    }

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation?.id ?? '',
      role: 'user',
      content: content.trim(),
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Start streaming
    setIsStreaming(true);
    setStreamingContent('');

    try {
      await window.openclaw.ai.chat({
        conversationId: activeConversation?.id ?? '',
        providerId: selectedProvider,
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsStreaming(false);
    }
  };

  const handleCancelStream = () => {
    if (activeConversation) {
      window.openclaw.ai.cancel(activeConversation.id);
    }
    setIsStreaming(false);
    setStreamingContent('');
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      {showSidebar && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Conversations</h3>
            <button className={styles.newButton} onClick={handleNewConversation}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          <ConversationList
            conversations={conversations}
            activeId={activeConversation?.id}
            onSelect={setActiveConversation}
            onDelete={handleDeleteConversation}
          />
        </div>
      )}

      {/* Main chat area */}
      <div className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <button
            className={styles.toggleSidebar}
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>

          <div className={styles.conversationTitle}>
            {activeConversation?.title ?? 'New Conversation'}
          </div>

          <ProviderSelector
            value={selectedProvider}
            onChange={setSelectedProvider}
          />
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.length === 0 && !streamingContent && (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <h3>Start a conversation</h3>
              <p>Ask me anything. I'm here to help.</p>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Streaming message */}
          {streamingContent && (
            <ChatMessage
              message={{
                id: 'streaming',
                conversationId: activeConversation?.id ?? '',
                role: 'assistant',
                content: streamingContent,
                createdAt: Date.now(),
              }}
              isStreaming
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          onCancel={handleCancelStream}
          isStreaming={isStreaming}
          disabled={!selectedProvider}
        />
      </div>
    </div>
  );
}
