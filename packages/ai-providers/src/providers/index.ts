import type { ProviderType } from '@openclaw/shared';
import type { ProviderConfig } from '../types.js';
import { BaseProvider } from '../base-provider.js';
import { ClaudeProvider } from './claude.provider.js';
import { OpenAIProvider } from './openai.provider.js';
import { OllamaProvider } from './ollama.provider.js';

export { ClaudeProvider } from './claude.provider.js';
export { OpenAIProvider } from './openai.provider.js';
export { OllamaProvider } from './ollama.provider.js';

/**
 * Create a provider instance based on configuration
 */
export function createProvider(config: ProviderConfig): BaseProvider {
  switch (config.type) {
    case 'claude':
      return new ClaudeProvider(config);
    case 'openai':
      return new OpenAIProvider(config);
    case 'ollama':
      return new OllamaProvider(config);
    default:
      throw new Error(`Unknown provider type: ${config.type}`);
  }
}

/**
 * Get provider class for a given type
 */
export function getProviderForType(
  type: ProviderType
): typeof BaseProvider {
  switch (type) {
    case 'claude':
      return ClaudeProvider;
    case 'openai':
      return OpenAIProvider;
    case 'ollama':
      return OllamaProvider;
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}
