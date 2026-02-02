import type Database from 'better-sqlite3';
import { now } from '@openclaw/shared';
import type { AppSettings } from '@openclaw/shared';

const DEFAULT_SETTINGS: AppSettings = {
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

export class SettingsRepository {
  constructor(private db: Database.Database) {}

  /**
   * Get all settings
   */
  get(): AppSettings {
    const stmt = this.db.prepare('SELECT key, value FROM settings');
    const rows = stmt.all() as { key: string; value: string }[];

    // Start with default settings
    const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as AppSettings;

    // Merge with stored settings
    for (const row of rows) {
      try {
        const value = JSON.parse(row.value);
        const keys = row.key.split('.');

        // Navigate to the nested property
        let current: Record<string, unknown> = settings;
        for (let i = 0; i < keys.length - 1; i++) {
          if (current[keys[i]] === undefined) {
            current[keys[i]] = {};
          }
          current = current[keys[i]] as Record<string, unknown>;
        }
        current[keys[keys.length - 1]] = value;
      } catch {
        console.warn(`Invalid setting value for key: ${row.key}`);
      }
    }

    return settings;
  }

  /**
   * Update settings
   */
  update(settings: Partial<AppSettings>): AppSettings {
    const timestamp = now();
    const upsert = this.db.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `);

    // Flatten settings to key-value pairs
    const flatSettings = this.flattenSettings(settings);

    this.db.transaction(() => {
      for (const [key, value] of Object.entries(flatSettings)) {
        upsert.run(key, JSON.stringify(value), timestamp);
      }
    })();

    return this.get();
  }

  /**
   * Reset settings to defaults
   */
  reset(): AppSettings {
    this.db.prepare('DELETE FROM settings').run();
    return this.get();
  }

  /**
   * Flatten nested settings object to dot-notation keys
   */
  private flattenSettings(
    obj: Record<string, unknown>,
    prefix = ''
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(
          result,
          this.flattenSettings(value as Record<string, unknown>, fullKey)
        );
      } else {
        result[fullKey] = value;
      }
    }

    return result;
  }
}
