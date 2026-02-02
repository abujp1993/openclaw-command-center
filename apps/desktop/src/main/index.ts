import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { join } from 'path';
import { createWindow, getMainWindow } from './window';
import { createTray, destroyTray } from './tray';
import { registerGlobalShortcuts, unregisterAllShortcuts } from './shortcuts';
import { registerAllIPCHandlers } from './ipc';

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Focus the main window if a second instance is opened
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // App lifecycle
  app.whenReady().then(async () => {
    // Register IPC handlers
    registerAllIPCHandlers();

    // Create the main window
    await createWindow();

    // Create system tray
    createTray();

    // Register global shortcuts
    registerGlobalShortcuts();

    // macOS: Re-create window if dock icon clicked
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    // On macOS, keep app running in tray
    if (process.platform !== 'darwin') {
      // On Windows/Linux, optionally minimize to tray instead of quitting
      // For now, quit the app
      app.quit();
    }
  });

  app.on('will-quit', () => {
    // Cleanup
    unregisterAllShortcuts();
    destroyTray();
  });

  // Security: Prevent navigation to external URLs
  app.on('web-contents-created', (_, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      if (parsedUrl.origin !== 'http://localhost:5173') {
        event.preventDefault();
        shell.openExternal(navigationUrl);
      }
    });

    // Prevent new windows from being created
    contents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });
  });
}
