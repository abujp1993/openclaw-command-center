import type { ProviderType, Message, StreamChunk } from '@openclaw/shared';

export interface ProviderConfig {
  id: string;
  type: ProviderType;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface ChatOptions {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  tokensUsed?: number;
  finishReason?: string;
}

export type StreamCallback = (chunk: StreamChunk) => void;
