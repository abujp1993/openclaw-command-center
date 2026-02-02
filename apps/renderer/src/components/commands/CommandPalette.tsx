import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  MessageSquare,
  Settings,
  Plus,
  Search,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import styles from './CommandPalette.module.css';

interface CommandItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortcut?: string;
  group: string;
  action: () => void;
}

export function CommandPalette() {
  const navigate = useNavigate();
  const { commandPaletteOpen, closeCommandPalette, openQuickAdd } = useUIStore();
  const [search, setSearch] = useState('');

  // Commands definition
  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'go-dashboard',
      name: 'Go to Dashboard',
      icon: <LayoutDashboard size={18} />,
      shortcut: '⌘1',
      group: 'Navigation',
      action: () => navigate('/'),
    },
    {
      id: 'go-tasks',
      name: 'Go to Tasks',
      icon: <CheckSquare size={18} />,
      shortcut: '⌘2',
      group: 'Navigation',
      action: () => navigate('/tasks'),
    },
    {
      id: 'go-notes',
      name: 'Go to Notes',
      icon: <FileText size={18} />,
      group: 'Navigation',
      action: () => navigate('/notes'),
    },
    {
      id: 'go-chat',
      name: 'Go to AI Chat',
      icon: <MessageSquare size={18} />,
      group: 'Navigation',
      action: () => navigate('/chat'),
    },
    {
      id: 'go-settings',
      name: 'Open Settings',
      icon: <Settings size={18} />,
      shortcut: '⌘,',
      group: 'Navigation',
      action: () => navigate('/settings'),
    },
    // Create
    {
      id: 'new-task',
      name: 'New Task',
      icon: <Plus size={18} />,
      shortcut: '⌘⇧T',
      group: 'Create',
      action: () => openQuickAdd('task'),
    },
    {
      id: 'new-note',
      name: 'New Note',
      icon: <Plus size={18} />,
      shortcut: '⌘⇧N',
      group: 'Create',
      action: () => openQuickAdd('note'),
    },
  ];

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useUIStore.getState().toggleCommandPalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset search when closing
  useEffect(() => {
    if (!commandPaletteOpen) {
      setSearch('');
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const handleSelect = (command: CommandItem) => {
    command.action();
    closeCommandPalette();
  };

  // Group commands
  const groups = commands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.group]) acc[cmd.group] = [];
      acc[cmd.group].push(cmd);
      return acc;
    },
    {} as Record<string, CommandItem[]>
  );

  return (
    <div className={styles.overlay} onClick={closeCommandPalette}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <Command className={styles.command} loop>
          <div className={styles.inputWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <Command.Input
              className={styles.input}
              placeholder="Type a command or search..."
              value={search}
              onValueChange={setSearch}
              autoFocus
            />
            <kbd className={styles.escHint}>ESC</kbd>
          </div>

          <Command.List className={styles.list}>
            <Command.Empty className={styles.empty}>
              No results found.
            </Command.Empty>

            {Object.entries(groups).map(([group, items]) => (
              <Command.Group key={group} heading={group} className={styles.group}>
                {items.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.name} ${item.group}`}
                    onSelect={() => handleSelect(item)}
                    className={styles.item}
                  >
                    <span className={styles.itemIcon}>{item.icon}</span>
                    <span className={styles.itemName}>{item.name}</span>
                    {item.shortcut && (
                      <kbd className={styles.shortcut}>{item.shortcut}</kbd>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
