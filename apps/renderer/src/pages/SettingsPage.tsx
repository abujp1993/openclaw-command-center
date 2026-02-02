import { useState } from 'react';
import {
  Settings,
  Palette,
  Keyboard,
  Bell,
  Bot,
  Database,
  Monitor,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import styles from './SettingsPage.module.css';
import clsx from 'clsx';

type SettingsTab =
  | 'appearance'
  | 'shortcuts'
  | 'notifications'
  | 'ai'
  | 'data'
  | 'window';

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
  { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'ai', label: 'AI Providers', icon: <Bot size={18} /> },
  { id: 'data', label: 'Data', icon: <Database size={18} /> },
  { id: 'window', label: 'Window', icon: <Monitor size={18} /> },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Settings size={28} className={styles.icon} />
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Customize your OpenClaw experience</p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Tabs */}
        <nav className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={clsx(styles.tab, activeTab === tab.id && styles.active)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <main className={styles.main}>
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'shortcuts' && <ShortcutsSettings />}
          {activeTab === 'notifications' && <NotificationsSettings />}
          {activeTab === 'ai' && <AISettings />}
          {activeTab === 'data' && <DataSettings />}
          {activeTab === 'window' && <WindowSettings />}
        </main>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <GlassCard>
      <h2 className={styles.sectionTitle}>Appearance</h2>
      <p className={styles.sectionDescription}>
        Customize the look and feel of OpenClaw
      </p>

      <div className={styles.settingGroup}>
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <label>Theme</label>
            <span>Choose your preferred color scheme</span>
          </div>
          <div className={styles.themeOptions}>
            <button className={clsx(styles.themeOption, styles.active)}>
              Dark
            </button>
            <button className={styles.themeOption}>Light</button>
            <button className={styles.themeOption}>System</button>
          </div>
        </div>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <label>Accent Color</label>
            <span>Primary color for buttons and highlights</span>
          </div>
          <div className={styles.colorOptions}>
            {['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#22c55e'].map(
              (color) => (
                <button
                  key={color}
                  className={clsx(
                    styles.colorOption,
                    color === '#6366f1' && styles.active
                  )}
                  style={{ background: color }}
                />
              )
            )}
          </div>
        </div>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <label>Reduce Motion</label>
            <span>Minimize animations for accessibility</span>
          </div>
          <ToggleSwitch />
        </div>
      </div>
    </GlassCard>
  );
}

function ShortcutsSettings() {
  const shortcuts = [
    { action: 'Command Palette', shortcut: '⌘K' },
    { action: 'Quick Add Task', shortcut: '⌘⇧T' },
    { action: 'Quick Add Note', shortcut: '⌘⇧N' },
    { action: 'Toggle Sidebar', shortcut: '⌘B' },
    { action: 'Focus Search', shortcut: '⌘F' },
    { action: 'Go to Tasks', shortcut: '⌘1' },
    { action: 'Go to Notes', shortcut: '⌘2' },
    { action: 'Open Settings', shortcut: '⌘,' },
  ];

  return (
    <GlassCard>
      <h2 className={styles.sectionTitle}>Keyboard Shortcuts</h2>
      <p className={styles.sectionDescription}>
        Customize keyboard shortcuts for quick actions
      </p>

      <div className={styles.shortcutList}>
        {shortcuts.map((item) => (
          <div key={item.action} className={styles.shortcutItem}>
            <span>{item.action}</span>
            <kbd>{item.shortcut}</kbd>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function NotificationsSettings() {
  return (
    <GlassCard>
      <h2 className={styles.sectionTitle}>Notifications</h2>
      <p className={styles.sectionDescription}>
        Configure notification preferences
      </p>

      <div className={styles.settingGroup}>
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <label>Enable Notifications</label>
            <span>Show desktop notifications</span>
          </div>
          <ToggleSwitch defaultChecked />
        </div>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <label>Task Reminders</label>
            <span>Get notified about upcoming tasks</span>
          </div>
          <ToggleSwitch defaultChecked />
        </div>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <label>Sound Effects</label>
            <span>Play sounds for notifications</span>
          </div>
          <ToggleSwitch />
        </div>
      </div>
    </GlassCard>
  );
}

function AISettings() {
  return (
    <GlassCard>
      <h2 className={styles.sectionTitle}>AI Providers</h2>
      <p className={styles.sectionDescription}>
        Configure your AI service providers
      </p>

      <div className={styles.providerList}>
        <GlassCard variant="subtle" className={styles.providerCard}>
          <div className={styles.providerHeader}>
            <Bot size={24} />
            <div>
              <h3>Claude (Anthropic)</h3>
              <span>Not configured</span>
            </div>
          </div>
          <GlassInput
            label="API Key"
            type="password"
            placeholder="sk-ant-..."
          />
          <GlassButton variant="primary" fullWidth>
            Save & Test Connection
          </GlassButton>
        </GlassCard>

        <GlassCard variant="subtle" className={styles.providerCard}>
          <div className={styles.providerHeader}>
            <Bot size={24} />
            <div>
              <h3>OpenAI</h3>
              <span>Not configured</span>
            </div>
          </div>
          <GlassInput
            label="API Key"
            type="password"
            placeholder="sk-..."
          />
          <GlassButton variant="primary" fullWidth>
            Save & Test Connection
          </GlassButton>
        </GlassCard>

        <GlassCard variant="subtle" className={styles.providerCard}>
          <div className={styles.providerHeader}>
            <Bot size={24} />
            <div>
              <h3>Ollama (Local)</h3>
              <span>Run AI models locally</span>
            </div>
          </div>
          <GlassInput
            label="Base URL"
            placeholder="http://localhost:11434"
            defaultValue="http://localhost:11434"
          />
          <GlassButton variant="primary" fullWidth>
            Test Connection
          </GlassButton>
        </GlassCard>
      </div>
    </GlassCard>
  );
}

function DataSettings() {
  return (
    <GlassCard>
      <h2 className={styles.sectionTitle}>Data Management</h2>
      <p className={styles.sectionDescription}>
        Backup, export, and manage your data
      </p>

      <div className={styles.settingGroup}>
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <label>Auto Backup</label>
            <span>Automatically backup data periodically</span>
          </div>
          <ToggleSwitch />
        </div>

        <div className={styles.dataActions}>
          <GlassButton variant="default">Export All Data</GlassButton>
          <GlassButton variant="default">Import Data</GlassButton>
          <GlassButton variant="default">Create Backup</GlassButton>
        </div>
      </div>
    </GlassCard>
  );
}

function WindowSettings() {
  return (
    <GlassCard>
      <h2 className={styles.sectionTitle}>Window Settings</h2>
      <p className={styles.sectionDescription}>
        Configure window behavior
      </p>

      <div className={styles.settingGroup}>
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <label>Minimize to Tray</label>
            <span>Keep OpenClaw running in system tray</span>
          </div>
          <ToggleSwitch />
        </div>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <label>Start Minimized</label>
            <span>Start app minimized to tray</span>
          </div>
          <ToggleSwitch />
        </div>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <label>Launch at Startup</label>
            <span>Start OpenClaw when you log in</span>
          </div>
          <ToggleSwitch />
        </div>
      </div>
    </GlassCard>
  );
}

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      className={clsx(styles.toggle, checked && styles.checked)}
      onClick={() => setChecked(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}
