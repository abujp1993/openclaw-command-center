// Application Settings Types

export type Theme = 'dark' | 'light' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface AppearanceSettings {
  theme: Theme;
  accentColor: string;
  fontSize: FontSize;
  reduceMotion: boolean;
}

export interface ShortcutSettings {
  openCommandPalette: string;
  quickAddTask: string;
  quickAddNote: string;
  toggleSidebar: string;
  focusSearch: string;
  toggleChat: string;
  navigateTasks: string;
  navigateNotes: string;
  navigateSettings: string;
}

export interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  soundEnabled: boolean;
}

export interface AISettings {
  defaultProviderId: string;
  defaultPersonaId: string;
  streamResponses: boolean;
}

export interface DataSettings {
  autoBackup: boolean;
  backupPath: string;
  backupInterval: number; // hours
}

export interface WindowSettings {
  minimizeToTray: boolean;
  startMinimized: boolean;
  launchAtStartup: boolean;
}

export interface AppSettings {
  appearance: AppearanceSettings;
  shortcuts: ShortcutSettings;
  notifications: NotificationSettings;
  ai: AISettings;
  data: DataSettings;
  window: WindowSettings;
}

export type SettingsKey = keyof AppSettings;
