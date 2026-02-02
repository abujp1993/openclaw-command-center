import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from '../base-provider.js';
import type { ProviderConfig, ChatOptions, ChatResponse, StreamCallback } from '../types.js';
import { DEFAULT_MODELS } from '@openclaw/shared';

export class ClaudeProvider extends BaseProvider {
  private client: Anthropic | null = null;
  private abortController: AbortController | null = null;

  constructor(config: ProviderConfig) {
    super(config);
  }

  private getClient(): Anthropic {
    if (!this.client) {
      this.validateConfig();
      this.client = new Anthropic({
        apiKey: this.config.apiKey,
      });
    }
    return this.client;
  }

  async testConnection(): Promise<boolean> {
    try {
      const client = this.getClient();
      // Send a minimal message to test the connection
      await client.messages.create({
        model: this.config.model ?? DEFAULT_MODELS.claude,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      });
      return true;
    } catch (error) {
      console.error('Claude connection test failed:', error);
      return false;
    }
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const client = this.getClient();

    const messages = options.messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const response = await client.messages.create({
      model: this.config.model ?? DEFAULT_MODELS.claude,
      max_tokens: options.maxTokens ?? 4096,
      system: options.systemPrompt,
      messages,
    });

    const textContent = response.content.find((c) => c.type === 'text');
    const content = textContent?.type === 'text' ? textContent.text : '';

    return {
      content,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      finishReason: response.stop_reason ?? undefined,
    };
  }

  async chatStream(
    options: ChatOptions,
    onChunk: StreamCallback
  ): Promise<void> {
    const client = this.getClient();
    this.abortController = new AbortController();

    const messages = options.messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    try {
      const stream = await client.messages.stream({
        model: this.config.model ?? DEFAULT_MODELS.claude,
        max_tokens: options.maxTokens ?? 4096,
        system: options.systemPrompt,
        messages,
      });

      for await (const event of stream) {
        if (this.abortController.signal.aborted) {
          break;
        }

        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          onChunk({
            type: 'text',
            content: event.delta.text,
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
