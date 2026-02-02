// IPC Channel Types - Contract between Electron main and renderer

import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from './task.types.js';

import type {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  NoteFilters,
  NoteSearchResult,
  Folder,
  CreateFolderInput,
  UpdateFolderInput,
} from './note.types.js';

import type {
  Conversation,
  Message,
  ChatInput,
  CreateConversationInput,
  AIProvider,
  CreateProviderInput,
  UpdateProviderInput,
  Persona,
  CreatePersonaInput,
  UpdatePersonaInput,
  StreamChunk,
} from './chat.types.js';

import type {
  Command,
  CreateCommandInput,
  UpdateCommandInput,
} from './command.types.js';

import type { AppSettings } from './settings.types.js';

// Export options for data management
export interface ExportOptions {
  format: 'json' | 'markdown' | 'csv';
  includeNotes: boolean;
  includeTasks: boolean;
  includeConversations: boolean;
  includeSettings: boolean;
}

// Notification input
export interface NotificationInput {
  title: string;
  body: string;
  icon?: string;
  silent?: boolean;
}

// IPC Channel definitions - all channels with their input/output types
export interface IPCChannels {
  // Tasks
  'tasks:list': { input: TaskFilters | undefined; output: Task[] };
  'tasks:get': { input: string; output: Task | null };
  'tasks:create': { input: CreateTaskInput; output: Task };
  'tasks:update': { input: { id: string; data: UpdateTaskInput }; output: Task };
  'tasks:delete': { input: string; output: void };
  'tasks:reorder': { input: { id: string; position: number; parentId?: string }; output: void };
  'tasks:bulkComplete': { input: string[]; output: void };

  // Categories
  'categories:list': { input: undefined; output: Category[] };
  'categories:create': { input: CreateCategoryInput; output: Category };
  'categories:update': { input: { id: string; data: UpdateCategoryInput }; output: Category };
  'categories:delete': { input: string; output: void };

  // Notes
  'notes:list': { input: NoteFilters | undefined; output: Note[] };
  'notes:get': { input: string; output: Note | null };
  'notes:create': { input: CreateNoteInput; output: Note };
  'notes:update': { input: { id: string; data: UpdateNoteInput }; output: Note };
  'notes:delete': { input: string; output: void };
  'notes:search': { input: string; output: NoteSearchResult[] };

  // Folders
  'folders:list': { input: undefined; output: Folder[] };
  'folders:create': { input: CreateFolderInput; output: Folder };
  'folders:update': { input: { id: string; data: UpdateFolderInput }; output: Folder };
  'folders:delete': { input: string; output: void };

  // AI Chat
  'ai:chat': { input: ChatInput; output: void }; // Streams via event
  'ai:cancel': { input: string; output: void }; // convId

  // AI Providers
  'ai:providers:list': { input: undefined; output: AIProvider[] };
  'ai:providers:create': { input: CreateProviderInput; output: AIProvider };
  'ai:providers:update': { input: { id: string; data: UpdateProviderInput }; output: AIProvider };
  'ai:providers:delete': { input: string; output: void };
  'ai:providers:test': { input: string; output: boolean };

  // Personas
  'ai:personas:list': { input: undefined; output: Persona[] };
  'ai:personas:create': { input: CreatePersonaInput; output: Persona };
  'ai:personas:update': { input: { id: string; data: UpdatePersonaInput }; output: Persona };
  'ai:personas:delete': { input: string; output: void };

  // Conversations
  'conversations:list': { input: undefined; output: Conversation[] };
  'conversations:get': { input: string; output: Conversation | null };
  'conversations:create': { input: CreateConversationInput; output: Conversation };
  'conversations:delete': { input: string; output: void };

  // Commands
  'commands:list': { input: undefined; output: Command[] };
  'commands:execute': { input: string; output: void };
  'commands:create': { input: CreateCommandInput; output: Command };
  'commands:update': { input: { id: string; data: UpdateCommandInput }; output: Command };
  'commands:delete': { input: string; output: void };

  // Shortcuts
  'shortcuts:register': { input: { commandId: string; shortcut: string }; output: boolean };
  'shortcuts:unregister': { input: string; output: void };

  // Settings
  'settings:get': { input: undefined; output: AppSettings };
  'settings:update': { input: Partial<AppSettings>; output: AppSettings };

  // Data Management
  'data:export': { input: ExportOptions; output: string }; // Returns file path
  'data:import': { input: string; output: void }; // Takes file path
  'data:backup': { input: undefined; output: string };

  // Window
  'window:minimize': { input: undefined; output: void };
  'window:maximize': { input: undefined; output: void };
  'window:close': { input: undefined; output: void };
  'window:hide': { input: undefined; output: void };

  // System
  'tray:show': { input: undefined; output: void };
  'notification:show': { input: NotificationInput; output: void };
}

// Event channels (from main to renderer)
export interface IPCEvents {
  'ai:stream': StreamChunk;
  'notification:reminder': Task;
  'shortcut:triggered': string; // command id
}

// Helper types for type-safe IPC
export type IPCChannelName = keyof IPCChannels;
export type IPCEventName = keyof IPCEvents;

export type IPCInput<T extends IPCChannelName> = IPCChannels[T]['input'];
export type IPCOutput<T extends IPCChannelName> = IPCChannels[T]['output'];
