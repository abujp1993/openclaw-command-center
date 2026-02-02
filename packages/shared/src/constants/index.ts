export * from './priorities.js';
export * from './shortcuts.js';

// Application constants
export const APP_NAME = 'OpenClaw';
export const APP_VERSION = '0.1.0';

// Database constants
export const DB_NAME = 'openclaw.db';

// Default colors for categories
export const CATEGORY_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#a855f7', // Purple
] as const;

// AI Provider defaults
export const DEFAULT_MODELS = {
  claude: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
  ollama: 'llama3.2',
} as const;

// Default personas
export const DEFAULT_PERSONAS = [
  {
    id: 'default-assistant',
    name: 'Assistant',
    systemPrompt: 'You are a helpful personal assistant. Be concise, friendly, and efficient.',
    isDefault: true,
  },
  {
    id: 'coder',
    name: 'Coder',
    systemPrompt: 'You are an expert programmer. Help with coding questions, debugging, and best practices. Provide code examples when helpful.',
    isDefault: false,
  },
  {
    id: 'writer',
    name: 'Writer',
    systemPrompt: 'You are a skilled writer. Help with writing, editing, and improving text. Focus on clarity and engagement.',
    isDefault: false,
  },
] as const;
