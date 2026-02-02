import { contextBridge, ipcRenderer } from 'electron';
import type {
  IPCChannelName,
  IPCInput,
  IPCOutput,
  IPCEventName,
  IPCEvents,
  StreamChunk,
  Task,
} from '@openclaw/shared';

// Type-safe invoke function
async function invoke<T extends IPCChannelName>(
  channel: T,
  ...args: IPCInput<T> extends undefined ? [] : [IPCInput<T>]
): Promise<IPCOutput<T>> {
  return ipcRenderer.invoke(channel, ...args);
}

// Type-safe event listener
function on<T extends IPCEventName>(
  channel: T,
  callback: (data: IPCEvents[T]) => void
): () => void {
  const handler = (_event: Electron.IpcRendererEvent, data: IPCEvents[T]) => {
    callback(data);
  };
  ipcRenderer.on(channel, handler);

  // Return cleanup function
  return () => {
    ipcRenderer.removeListener(channel, handler);
  };
}

// API exposed to renderer
const api = {
  // Tasks
  tasks: {
    list: (filters?: IPCInput<'tasks:list'>) => invoke('tasks:list', filters),
    get: (id: string) => invoke('tasks:get', id),
    create: (input: IPCInput<'tasks:create'>) => invoke('tasks:create', input),
    update: (id: string, data: IPCInput<'tasks:update'>['data']) =>
      invoke('tasks:update', { id, data }),
    delete: (id: string) => invoke('tasks:delete', id),
    reorder: (id: string, position: number, parentId?: string) =>
      invoke('tasks:reorder', { id, position, parentId }),
    bulkComplete: (ids: string[]) => invoke('tasks:bulkComplete', ids),
  },

  // Categories
  categories: {
    list: () => invoke('categories:list'),
    create: (input: IPCInput<'categories:create'>) => invoke('categories:create', input),
    update: (id: string, data: IPCInput<'categories:update'>['data']) =>
      invoke('categories:update', { id, data }),
    delete: (id: string) => invoke('categories:delete', id),
  },

  // Notes
  notes: {
    list: (filters?: IPCInput<'notes:list'>) => invoke('notes:list', filters),
    get: (id: string) => invoke('notes:get', id),
    create: (input: IPCInput<'notes:create'>) => invoke('notes:create', input),
    update: (id: string, data: IPCInput<'notes:update'>['data']) =>
      invoke('notes:update', { id, data }),
    delete: (id: string) => invoke('notes:delete', id),
    search: (query: string) => invoke('notes:search', query),
  },

  // Folders
  folders: {
    list: () => invoke('folders:list'),
    create: (input: IPCInput<'folders:create'>) => invoke('folders:create', input),
    update: (id: string, data: IPCInput<'folders:update'>['data']) =>
      invoke('folders:update', { id, data }),
    delete: (id: string) => invoke('folders:delete', id),
  },

  // AI Chat
  ai: {
    chat: (input: IPCInput<'ai:chat'>) => invoke('ai:chat', input),
    cancel: (conversationId: string) => invoke('ai:cancel', conversationId),
    onStream: (callback: (chunk: StreamChunk) => void) => on('ai:stream', callback),
  },

  // AI Providers
  providers: {
    list: () => invoke('ai:providers:list'),
    create: (input: IPCInput<'ai:providers:create'>) => invoke('ai:providers:create', input),
    update: (id: string, data: IPCInput<'ai:providers:update'>['data']) =>
      invoke('ai:providers:update', { id, data }),
    delete: (id: string) => invoke('ai:providers:delete', id),
    test: (id: string) => invoke('ai:providers:test', id),
  },

  // Personas
  personas: {
    list: () => invoke('ai:personas:list'),
    create: (input: IPCInput<'ai:personas:create'>) => invoke('ai:personas:create', input),
    update: (id: string, data: IPCInput<'ai:personas:update'>['data']) =>
      invoke('ai:personas:update', { id, data }),
    delete: (id: string) => invoke('ai:personas:delete', id),
  },

  // Conversations
  conversations: {
    list: () => invoke('conversations:list'),
    get: (id: string) => invoke('conversations:get', id),
    create: (input: IPCInput<'conversations:create'>) => invoke('conversations:create', input),
    delete: (id: string) => invoke('conversations:delete', id),
  },

  // Commands
  commands: {
    list: () => invoke('commands:list'),
    execute: (id: string) => invoke('commands:execute', id),
    create: (input: IPCInput<'commands:create'>) => invoke('commands:create', input),
    update: (id: string, data: IPCInput<'commands:update'>['data']) =>
      invoke('commands:update', { id, data }),
    delete: (id: string) => invoke('commands:delete', id),
  },

  // Shortcuts
  shortcuts: {
    register: (commandId: string, shortcut: string) =>
      invoke('shortcuts:register', { commandId, shortcut }),
    unregister: (commandId: string) => invoke('shortcuts:unregister', commandId),
    onTriggered: (callback: (commandId: string) => void) => on('shortcut:triggered', callback),
  },

  // Settings
  settings: {
    get: () => invoke('settings:get'),
    update: (settings: IPCInput<'settings:update'>) => invoke('settings:update', settings),
  },

  // Data Management
  data: {
    export: (options: IPCInput<'data:export'>) => invoke('data:export', options),
    import: (filePath: string) => invoke('data:import', filePath),
    backup: () => invoke('data:backup'),
  },

  // Window controls
  window: {
    minimize: () => invoke('window:minimize'),
    maximize: () => invoke('window:maximize'),
    close: () => invoke('window:close'),
    hide: () => invoke('window:hide'),
  },

  // System
  tray: {
    show: () => invoke('tray:show'),
  },

  notification: {
    show: (input: IPCInput<'notification:show'>) => invoke('notification:show', input),
    onReminder: (callback: (task: Task) => void) => on('notification:reminder', callback),
  },

  // Platform info
  platform: process.platform,
};

// Expose the API to the renderer
contextBridge.exposeInMainWorld('openclaw', api);

// TypeScript declaration for the exposed API
export type OpenClawAPI = typeof api;
