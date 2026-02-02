import type { ProviderConfig, ChatOptions, ChatResponse, StreamCallback } from './types.js';

/**
 * Abstract base class for AI providers
 */
export abstract class BaseProvider {
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Get the provider ID
   */
  get id(): string {
    return this.config.id;
  }

  /**
   * Get the provider type
   */
  get type(): string {
    return this.config.type;
  }

  /**
   * Test the connection to the provider
   */
  abstract testConnection(): Promise<boolean>;

  /**
   * Send a chat message and get a response
   */
  abstract chat(options: ChatOptions): Promise<ChatResponse>;

  /**
   * Send a chat message and stream the response
   */
  abstract chatStream(
    options: ChatOptions,
    onChunk: StreamCallback
  ): Promise<void>;

  /**
   * Cancel an ongoing stream
   */
  abstract cancelStream(): void;

  /**
   * Validate the configuration
   */
  protected validateConfig(): void {
    if (!this.config.apiKey && this.config.type !== 'ollama') {
      throw new Error(`API key is required for ${this.config.type} provider`);
    }
  }
}
