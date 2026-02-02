import { Menu, app, shell, BrowserWindow } from 'electron';

const isMac = process.platform === 'darwin';

export function createApplicationMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    // App menu (macOS only)
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' as const },
              { type: 'separator' as const },
              {
                label: 'Preferences...',
                accelerator: 'Cmd+,',
                click: () => {
                  // TODO: Open settings
                },
              },
              { type: 'separator' as const },
              { role: 'services' as const },
              { type: 'separator' as const },
              { role: 'hide' as const },
              { role: 'hideOthers' as const },
              { role: 'unhide' as const },
              { type: 'separator' as const },
              { role: 'quit' as const },
            ],
          },
        ]
      : []),
    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'New Task',
          accelerator: 'CmdOrCtrl+Shift+T',
          click: () => {
            // TODO: Open new task modal
          },
        },
        {
          label: 'New Note',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => {
            // TODO: Open new note modal
          },
        },
        { type: 'separator' },
        {
          label: 'Import...',
          click: () => {
            // TODO: Open import dialog
          },
        },
        {
          label: 'Export...',
          click: () => {
            // TODO: Open export dialog
          },
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' as const },
              { role: 'delete' as const },
              { role: 'selectAll' as const },
            ]
          : [{ role: 'delete' as const }, { type: 'separator' as const }, { role: 'selectAll' as const }]),
      ],
    },
    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: 'Toggle Sidebar',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            // TODO: Toggle sidebar
          },
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    // Go menu
    {
      label: 'Go',
      submenu: [
        {
          label: 'Tasks',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            // TODO: Navigate to tasks
          },
        },
        {
          label: 'Notes',
          accelerator: 'CmdOrCtrl+2',
          click: () => {
            // TODO: Navigate to notes
          },
        },
        {
          label: 'AI Chat',
          accelerator: 'CmdOrCtrl+3',
          click: () => {
            // TODO: Navigate to chat
          },
        },
        { type: 'separator' },
        {
          label: 'Command Palette',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            // TODO: Open command palette
          },
        },
      ],
    },
    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' as const }, { role: 'front' as const }, { type: 'separator' as const }, { role: 'window' as const }]
          : [{ role: 'close' as const }]),
      ],
    },
    // Help menu
    {
      role: 'help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://github.com/openclaw/openclaw');
          },
        },
        {
          label: 'Report Issue',
          click: async () => {
            await shell.openExternal('https://github.com/openclaw/openclaw/issues');
          },
        },
        { type: 'separator' },
        {
          label: 'About OpenClaw',
          click: () => {
            // TODO: Show about dialog
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
