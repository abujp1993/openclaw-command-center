import { BaseProvider } from '../base-provider.js';
import type { ProviderConfig, ChatOptions, ChatResponse, StreamCallback } from '../types.js';
import { DEFAULT_MODELS } from '@openclaw/shared';

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';

export class OllamaProvider extends BaseProvider {
  private abortController: AbortController | null = null;

  constructor(config: ProviderConfig) {
    super(config);
  }

  private get baseUrl(): string {
    const url = this.config.baseUrl ?? DEFAULT_OLLAMA_URL;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return DEFAULT_OLLAMA_URL;
      }
      // Return origin only to prevent path traversal via baseUrl
      return parsed.origin;
    } catch {
      return DEFAULT_OLLAMA_URL;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      if (process.env['NODE_ENV'] === 'development') {
        console.error('Ollama connection test failed:', error);
      }
      return false;
    }
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const messages = options.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    if (options.systemPrompt) {
      messages.unshift({ role: 'system', content: options.systemPrompt });
    }

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model ?? DEFAULT_MODELS.ollama,
        messages,
        stream: false,
        options: {
          temperature: options.temperature ?? 0.7,
          num_predict: options.maxTokens ?? 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = (await response.json()) as { message?: { content?: string }; eval_count?: number };

    return {
      content: data.message?.content ?? '',
      tokensUsed: data.eval_count,
    };
  }

  async chatStream(
    options: ChatOptions,
    onChunk: StreamCallback
  ): Promise<void> {
    this.abortController = new AbortController();

    const messages = options.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    if (options.systemPrompt) {
      messages.unshift({ role: 'system', content: options.systemPrompt });
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model ?? DEFAULT_MODELS.ollama,
          messages,
          stream: true,
          options: {
            temperature: options.temperature ?? 0.7,
            num_predict: options.maxTokens ?? 4096,
          },
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              onChunk({
                type: 'text',
                content: data.message.content,
              });
            }
            if (data.done) {
              onChunk({ type: 'done' });
              return;
            }
          } catch {
            // Ignore JSON parse errors for partial lines
          }
        }
      }

      onChunk({ type: 'done' });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        onChunk({
          type: 'error',
          error: (error as Error).message,
        });
      }
    }
  }

  cancelStream(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
