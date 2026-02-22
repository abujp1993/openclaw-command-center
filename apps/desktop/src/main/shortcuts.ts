import { globalShortcut, BrowserWindow } from 'electron';
import { getMainWindow, showMainWindow } from './window';
import { DEFAULT_SHORTCUTS, GLOBAL_SHORTCUTS } from '@openclaw/shared';

// Track registered shortcuts
const registeredShortcuts: Set<string> = new Set();

/**
 * Register global keyboard shortcuts
 */
export function registerGlobalShortcuts(): void {
  // Command palette (Ctrl+K / Cmd+K)
  registerShortcut(DEFAULT_SHORTCUTS.openCommandPalette, () => {
    showMainWindow();
    sendToRenderer('shortcut:triggered', 'cmd-palette');
  });

  // Quick add task (Ctrl+Shift+T / Cmd+Shift+T)
  registerShortcut(DEFAULT_SHORTCUTS.quickAddTask, () => {
    showMainWindow();
    sendToRenderer('shortcut:triggered', 'cmd-new-task');
  });

  // Quick add note (Ctrl+Shift+N / Cmd+Shift+N)
  registerShortcut(DEFAULT_SHORTCUTS.quickAddNote, () => {
    showMainWindow();
    sendToRenderer('shortcut:triggered', 'cmd-new-note');
  });
}

/**
 * Register a single global shortcut
 */
export function registerShortcut(accelerator: string, callback: () => void): boolean {
  try {
    // Convert our format to Electron accelerator format
    const electronAccelerator = convertToElectronAccelerator(accelerator);

    if (registeredShortcuts.has(electronAccelerator)) {
      // Already registered, unregister first
      globalShortcut.unregister(electronAccelerator);
    }

    const success = globalShortcut.register(electronAccelerator, callback);

    if (success) {
      registeredShortcuts.add(electronAccelerator);
    } else if (process.env['NODE_ENV'] === 'development') {
      console.warn(`Failed to register shortcut: ${accelerator}`);
    }

    return success;
  } catch (error) {
    if (process.env['NODE_ENV'] === 'development') {
      console.error(`Error registering shortcut ${accelerator}:`, error);
    }
    return false;
  }
}

/**
 * Unregister a global shortcut
 */
export function unregisterShortcut(accelerator: string): void {
  const electronAccelerator = convertToElectronAccelerator(accelerator);

  if (registeredShortcuts.has(electronAccelerator)) {
    globalShortcut.unregister(electronAccelerator);
    registeredShortcuts.delete(electronAccelerator);
  }
}

/**
 * Unregister all global shortcuts
 */
export function unregisterAllShortcuts(): void {
  globalShortcut.unregisterAll();
  registeredShortcuts.clear();
}

/**
 * Check if a shortcut is registered
 */
export function isShortcutRegistered(accelerator: string): boolean {
  const electronAccelerator = convertToElectronAccelerator(accelerator);
  return globalShortcut.isRegistered(electronAccelerator);
}

/**
 * Convert our shortcut format to Electron accelerator format
 * Our format: "Meta+K" or "Ctrl+K"
 * Electron format: "CommandOrControl+K"
 */
function convertToElectronAccelerator(shortcut: string): string {
  return shortcut
    .replace(/Meta/g, 'CommandOrControl')
    .replace(/Ctrl/g, 'CommandOrControl');
}

/**
 * Send event to renderer process
 */
function sendToRenderer(channel: string, data: unknown): void {
  const mainWindow = getMainWindow();
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send(channel, data);
  }
}
