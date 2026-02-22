import OpenAI from 'openai';
import { BaseProvider } from '../base-provider.js';
import type { ProviderConfig, ChatOptions, ChatResponse, StreamCallback } from '../types.js';
import { DEFAULT_MODELS } from '@openclaw/shared';

export class OpenAIProvider extends BaseProvider {
  private client: OpenAI | null = null;
  private abortController: AbortController | null = null;

  constructor(config: ProviderConfig) {
    super(config);
  }

  private getClient(): OpenAI {
    if (!this.client) {
      this.validateConfig();
      this.client = new OpenAI({
        apiKey: this.config.apiKey,
        baseURL: this.config.baseUrl,
      });
    }
    return this.client;
  }

  async testConnection(): Promise<boolean> {
    try {
      const client = this.getClient();
      await client.chat.completions.create({
        model: this.config.model ?? DEFAULT_MODELS.openai,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      });
      return true;
    } catch (error) {
      if (process.env['NODE_ENV'] === 'development') {
        console.error('OpenAI connection test failed:', error);
      }
      return false;
    }
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const client = this.getClient();

    const messages: OpenAI.ChatCompletionMessageParam[] = [];

    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }

    messages.push(
      ...options.messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      }))
    );

    const response = await client.chat.completions.create({
      model: this.config.model ?? DEFAULT_MODELS.openai,
      max_tokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 0.7,
      messages,
    });

    const choice = response.choices[0];

    return {
      content: choice.message.content ?? '',
      tokensUsed: response.usage?.total_tokens,
      finishReason: choice.finish_reason ?? undefined,
    };
  }

  async chatStream(
    options: ChatOptions,
    onChunk: StreamCallback
  ): Promise<void> {
    const client = this.getClient();
    this.abortController = new AbortController();

    const messages: OpenAI.ChatCompletionMessageParam[] = [];

    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }

    messages.push(
      ...options.messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      }))
    );

    try {
      const stream = await client.chat.completions.create({
        model: this.config.model ?? DEFAULT_MODELS.openai,
        max_tokens: options.maxTokens ?? 4096,
        temperature: options.temperature ?? 0.7,
        messages,
        stream: true,
      });

      for await (const chunk of stream) {
        if (this.abortController.signal.aborted) {
          break;
        }

        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          onChunk({
            type: 'text',
            content,
          });
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
