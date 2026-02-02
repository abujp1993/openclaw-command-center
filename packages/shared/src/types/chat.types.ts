// AI Chat Types

export type MessageRole = 'user' | 'assistant' | 'system';
export type ProviderType = 'claude' | 'openai' | 'ollama' | 'custom';

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  tokensUsed?: number;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title?: string;
  provider: ProviderType;
  personaId?: string;
  messages?: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface AIProvider {
  id: string;
  name: string;
  type: ProviderType;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  isActive: boolean;
  createdAt: number;
}

export interface Persona {
  id: string;
  name: string;
  systemPrompt: string;
  isDefault: boolean;
  createdAt: number;
}

export interface StreamChunk {
  type: 'text' | 'done' | 'error';
  content?: string;
  error?: string;
}

export interface ChatInput {
  conversationId: string;
  message: string;
  providerId?: string;
  personaId?: string;
}

export interface CreateConversationInput {
  title?: string;
  provider: ProviderType;
  personaId?: string;
}

export interface CreateProviderInput {
  name: string;
  type: ProviderType;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface UpdateProviderInput {
  name?: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  isActive?: boolean;
}

export interface CreatePersonaInput {
  name: string;
  systemPrompt: string;
  isDefault?: boolean;
}

export interface UpdatePersonaInput {
  name?: string;
  systemPrompt?: string;
  isDefault?: boolean;
}
