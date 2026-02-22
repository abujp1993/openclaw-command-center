import { Tray, Menu, nativeImage, app } from 'electron';
import { join } from 'path';
import { showMainWindow, hideMainWindow } from './window';

let tray: Tray | null = null;

export function createTray(): void {
  // Create tray icon (use a placeholder for now)
  const iconPath = join(__dirname, '../../resources/icon.png');

  // Create a simple icon if the file doesn't exist
  let icon: Electron.NativeImage;
  try {
    icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) {
      // Create a simple colored icon as fallback
      icon = nativeImage.createEmpty();
    }
  } catch {
    icon = nativeImage.createEmpty();
  }

  // Resize for tray (16x16 on most platforms)
  if (!icon.isEmpty()) {
    icon = icon.resize({ width: 16, height: 16 });
  }

  tray = new Tray(icon);
  tray.setToolTip('OpenClaw - Personal Assistant');

  // Context menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show OpenClaw',
      click: () => showMainWindow(),
    },
    { type: 'separator' },
    {
      label: 'Quick Add Task',
      accelerator: 'CmdOrCtrl+Shift+T',
      click: () => {
        showMainWindow();
        // TODO: Emit event to open quick add task modal
      },
    },
    {
      label: 'Quick Add Note',
      accelerator: 'CmdOrCtrl+Shift+N',
      click: () => {
        showMainWindow();
        // TODO: Emit event to open quick add note modal
      },
    },
    { type: 'separator' },
    {
      label: 'Tasks',
      click: () => {
        showMainWindow();
        // TODO: Navigate to tasks
      },
    },
    {
      label: 'Notes',
      click: () => {
        showMainWindow();
        // TODO: Navigate to notes
      },
    },
    {
      label: 'AI Chat',
      click: () => {
        showMainWindow();
        // TODO: Navigate to chat
      },
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        showMainWindow();
        // TODO: Navigate to settings
      },
    },
    { type: 'separator' },
    {
      label: 'Quit OpenClaw',
      accelerator: 'CmdOrCtrl+Q',
      click: () => app.quit(),
    },
  ]);

  tray.setContextMenu(contextMenu);

  // Click on tray icon shows/hides the window
  tray.on('click', () => {
    showMainWindow();
  });

  // Double-click shows the window
  tray.on('double-click', () => {
    showMainWindow();
  });
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

export function updateTrayTooltip(tooltip: string): void {
  if (tray) {
    tray.setToolTip(tooltip);
  }
}
