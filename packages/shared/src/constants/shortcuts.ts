// Default keyboard shortcuts
import type { ShortcutSettings } from '../types/settings.types.js';

// Modifier key based on platform
export const MOD_KEY = process.platform === 'darwin' ? 'Meta' : 'Ctrl';

export const DEFAULT_SHORTCUTS: ShortcutSettings = {
  openCommandPalette: `${MOD_KEY}+K`,
  quickAddTask: `${MOD_KEY}+Shift+T`,
  quickAddNote: `${MOD_KEY}+Shift+N`,
  toggleSidebar: `${MOD_KEY}+B`,
  focusSearch: `${MOD_KEY}+F`,
  toggleChat: `${MOD_KEY}+Shift+C`,
  navigateTasks: `${MOD_KEY}+1`,
  navigateNotes: `${MOD_KEY}+2`,
  navigateSettings: `${MOD_KEY}+,`,
};

// Global shortcuts that work even when app is not focused
export const GLOBAL_SHORTCUTS = [
  'openCommandPalette',
  'quickAddTask',
  'quickAddNote',
] as const;

// Built-in commands with their shortcuts
export const BUILTIN_COMMANDS = [
  {
    id: 'cmd-new-task',
    name: 'New Task',
    description: 'Create a new task',
    shortcut: DEFAULT_SHORTCUTS.quickAddTask,
    actionType: 'create' as const,
    actionPayload: { type: 'task' },
    icon: 'plus-square',
    group: 'Create',
  },
  {
    id: 'cmd-new-note',
    name: 'New Note',
    description: 'Create a new note',
    shortcut: DEFAULT_SHORTCUTS.quickAddNote,
    actionType: 'create' as const,
    actionPayload: { type: 'note' },
    icon: 'file-plus',
    group: 'Create',
  },
  {
    id: 'cmd-go-tasks',
    name: 'Go to Tasks',
    description: 'Navigate to tasks page',
    shortcut: DEFAULT_SHORTCUTS.navigateTasks,
    actionType: 'navigate' as const,
    actionPayload: { route: '/tasks' },
    icon: 'check-square',
    group: 'Navigation',
  },
  {
    id: 'cmd-go-notes',
    name: 'Go to Notes',
    description: 'Navigate to notes page',
    shortcut: DEFAULT_SHORTCUTS.navigateNotes,
    actionType: 'navigate' as const,
    actionPayload: { route: '/notes' },
    icon: 'file-text',
    group: 'Navigation',
  },
  {
    id: 'cmd-go-chat',
    name: 'Go to Chat',
    description: 'Navigate to AI chat',
    shortcut: DEFAULT_SHORTCUTS.toggleChat,
    actionType: 'navigate' as const,
    actionPayload: { route: '/chat' },
    icon: 'message-square',
    group: 'Navigation',
  },
  {
    id: 'cmd-go-settings',
    name: 'Open Settings',
    description: 'Open settings panel',
    shortcut: DEFAULT_SHORTCUTS.navigateSettings,
    actionType: 'navigate' as const,
    actionPayload: { route: '/settings' },
    icon: 'settings',
    group: 'Navigation',
  },
  {
    id: 'cmd-toggle-sidebar',
    name: 'Toggle Sidebar',
    description: 'Show or hide the sidebar',
    shortcut: DEFAULT_SHORTCUTS.toggleSidebar,
    actionType: 'toggle' as const,
    actionPayload: { target: 'sidebar' },
    icon: 'sidebar',
    group: 'View',
  },
  {
    id: 'cmd-search',
    name: 'Search',
    description: 'Search everything',
    shortcut: DEFAULT_SHORTCUTS.focusSearch,
    actionType: 'search' as const,
    actionPayload: {},
    icon: 'search',
    group: 'Search',
  },
] as const;
