import { ipcMain, BrowserWindow, Notification } from 'electron';
import {
  minimizeMainWindow,
  maximizeMainWindow,
  closeMainWindow,
  hideMainWindow,
  showMainWindow,
} from '../window';
import type { IPCChannelName, IPCInput, NotificationInput } from '@openclaw/shared';

// Import individual IPC handlers
// These will be implemented as the database and AI packages are completed
// import { registerTaskHandlers } from './tasks.ipc';
// import { registerNoteHandlers } from './notes.ipc';
// import { registerAIHandlers } from './ai.ipc';
// import { registerSettingsHandlers } from './settings.ipc';
// import { registerCommandHandlers } from './commands.ipc';

/**
 * Type-safe IPC handler registration
 */
function handle<T extends IPCChannelName>(
  channel: T,
  handler: (event: Electron.IpcMainInvokeEvent, input: IPCInput<T>) => Promise<unknown> | unknown
): void {
  ipcMain.handle(channel, handler);
}

/**
 * Register all IPC handlers
 */
export function registerAllIPCHandlers(): void {
  // Window controls
  handle('window:minimize', () => {
    minimizeMainWindow();
  });

  handle('window:maximize', () => {
    maximizeMainWindow();
  });

  handle('window:close', () => {
    closeMainWindow();
  });

  handle('window:hide', () => {
    hideMainWindow();
  });

  // Tray
  handle('tray:show', () => {
    showMainWindow();
  });

  // Notifications
  handle('notification:show', (_, input: NotificationInput) => {
    const notification = new Notification({
      title: input.title,
      body: input.body,
      silent: input.silent ?? false,
    });
    notification.show();
  });

  // Placeholder handlers for features to be implemented
  // These will be replaced when the database package is ready

  // Tasks
  handle('tasks:list', async () => {
    // TODO: Implement with database
    return [];
  });

  handle('tasks:get', async (_, id) => {
    // TODO: Implement with database
    return null;
  });

  handle('tasks:create', async (_, input) => {
    // TODO: Implement with database
    const now = Date.now();
    return {
      id: `task-${now}`,
      title: input.title,
      description: input.description,
      priority: input.priority ?? 'medium',
      status: 'pending',
      dueDate: input.dueDate,
      reminderDate: input.reminderDate,
      parentId: input.parentId,
      position: 0,
      categories: [],
      createdAt: now,
      updatedAt: now,
    };
  });

  handle('tasks:update', async (_, { id, data }) => {
    // TODO: Implement with database
    return null;
  });

  handle('tasks:delete', async (_, id) => {
    // TODO: Implement with database
  });

  // Notes
  handle('notes:list', async () => {
    // TODO: Implement with database
    return [];
  });

  handle('notes:get', async (_, id) => {
    // TODO: Implement with database
    return null;
  });

  handle('notes:create', async (_, input) => {
    // TODO: Implement with database
    const now = Date.now();
    return {
      id: `note-${now}`,
      title: input.title,
      content: input.content,
      folderId: input.folderId,
      linkedTaskId: input.linkedTaskId,
      isPinned: input.isPinned ?? false,
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };
  });

  handle('notes:update', async (_, { id, data }) => {
    // TODO: Implement with database
    return null;
  });

  handle('notes:delete', async (_, id) => {
    // TODO: Implement with database
  });

  handle('notes:search', async (_, query) => {
    // TODO: Implement with database FTS
    return [];
  });

  // Folders
  handle('folders:list', async () => {
    // TODO: Implement with database
    return [];
  });

  handle('folders:create', async (_, input) => {
    // TODO: Implement with database
    const now = Date.now();
    return {
      id: `folder-${now}`,
      name: input.name,
      parentId: input.parentId,
      position: 0,
      createdAt: now,
    };
  });

  handle('folders:update', async (_, { id, data }) => {
    // TODO: Implement with database
    return null;
  });

  handle('folders:delete', async (_, id) => {
    // TODO: Implement with database
  });

  // Categories
  handle('categories:list', async () => {
    // TODO: Implement with database
    return [];
  });

  handle('categories:create', async (_, input) => {
    // TODO: Implement with database
    const now = Date.now();
    return {
      id: `cat-${now}`,
      name: input.name,
      color: input.color ?? '#6366f1',
      createdAt: now,
    };
  });

  handle('categories:update', async (_, { id, data }) => {
    // TODO: Implement with database
    return null;
  });

  handle('categories:delete', async (_, id) => {
    // TODO: Implement with database
  });

  // AI Chat (placeholders)
  handle('ai:chat', async (_, input) => {
    // TODO: Implement with AI providers
    // This will stream responses via events
  });

  handle('ai:cancel', async (_, conversationId) => {
    // TODO: Implement cancellation
  });

  handle('ai:providers:list', async () => {
    // TODO: Implement with database
    return [];
  });

  handle('ai:providers:create', async (_, input) => {
    // TODO: Implement with database
    const now = Date.now();
    return {
      id: `provider-${now}`,
      name: input.name,
      type: input.type,
      apiKey: input.apiKey,
      baseUrl: input.baseUrl,
      model: input.model,
      isActive: true,
      createdAt: now,
    };
  });

  handle('ai:providers:update', async (_, { id, data }) => {
    // TODO: Implement with database
    return null;
  });

  handle('ai:providers:delete', async (_, id) => {
    // TODO: Implement with database
  });

  handle('ai:providers:test', async (_, id) => {
    // TODO: Implement provider testing
    return false;
  });

  // Personas
  handle('ai:personas:list', async () => {
    // TODO: Implement with database
    return [];
  });

  handle('ai:personas:create', async (_, input) => {
    // TODO: Implement with database
    const now = Date.now();
    return {
      id: `persona-${now}`,
      name: input.name,
      systemPrompt: input.systemPrompt,
      isDefault: input.isDefault ?? false,
      createdAt: now,
    };
  });

  handle('ai:personas:update', async (_, { id, data }) => {
    // TODO: Implement with database
    return null;
  });

  handle('ai:personas:delete', async (_, id) => {
    // TODO: Implement with database
  });

  // Conversations
  handle('conversations:list', async () => {
    // TODO: Implement with database
    return [];
  });

  handle('conversations:get', async (_, id) => {
    // TODO: Implement with database
    return null;
  });

  handle('conversations:create', async (_, input) => {
    // TODO: Implement with database
    const now = Date.now();
    return {
      id: `conv-${now}`,
      title: input.title,
      provider: input.provider,
      personaId: input.personaId,
      createdAt: now,
      updatedAt: now,
    };
  });

  handle('conversations:delete', async (_, id) => {
    // TODO: Implement with database
  });

  // Commands
  handle('commands:list', async () => {
    // TODO: Implement with database + built-in commands
    return [];
  });

  handle('commands:execute', async (_, id) => {
    // TODO: Implement command execution
  });

  handle('commands:create', async (_, input) => {
    // TODO: Implement with database
    const now = Date.now();
    return {
      id: `cmd-${now}`,
      name: input.name,
      description: input.description,
      shortcut: input.shortcut,
      actionType: input.actionType,
      actionPayload: input.actionPayload,
      icon: input.icon,
      group: input.group,
      isActive: true,
      isBuiltIn: false,
      createdAt: now,
    };
  });

  handle('commands:update', async (_, { id, data }) => {
    // TODO: Implement with database
    return null;
  });

  handle('commands:delete', async (_, id) => {
    // TODO: Implement with database
  });

  // Shortcuts
  handle('shortcuts:register', async (_, { commandId, shortcut }) => {
    // TODO: Implement shortcut registration
    return false;
  });

  handle('shortcuts:unregister', async (_, commandId) => {
    // TODO: Implement shortcut unregistration
  });

  // Settings
  handle('settings:get', async () => {
    // TODO: Implement with database
    return {
      appearance: {
        theme: 'dark',
        accentColor: '#6366f1',
        fontSize: 'medium',
        reduceMotion: false,
      },
      shortcuts: {
        openCommandPalette: 'Ctrl+K',
        quickAddTask: 'Ctrl+Shift+T',
        quickAddNote: 'Ctrl+Shift+N',
        toggleSidebar: 'Ctrl+B',
        focusSearch: 'Ctrl+F',
        toggleChat: 'Ctrl+Shift+C',
        navigateTasks: 'Ctrl+1',
        navigateNotes: 'Ctrl+2',
        navigateSettings: 'Ctrl+,',
      },
      notifications: {
        enabled: true,
        taskReminders: true,
        soundEnabled: true,
      },
      ai: {
        defaultProviderId: '',
        defaultPersonaId: '',
        streamResponses: true,
      },
      data: {
        autoBackup: false,
        backupPath: '',
        backupInterval: 24,
      },
      window: {
        minimizeToTray: false,
        startMinimized: false,
        launchAtStartup: false,
      },
    };
  });

  handle('settings:update', async (_, settings) => {
    // TODO: Implement with database
    return settings as any;
  });

  // Data management
  handle('data:export', async (_, options) => {
    // TODO: Implement export
    return '';
  });

  handle('data:import', async (_, filePath) => {
    // TODO: Implement import
  });

  handle('data:backup', async () => {
    // TODO: Implement backup
    return '';
  });

  // Register feature-specific handlers
  // registerTaskHandlers();
  // registerNoteHandlers();
  // registerAIHandlers();
  // registerSettingsHandlers();
  // registerCommandHandlers();
}
