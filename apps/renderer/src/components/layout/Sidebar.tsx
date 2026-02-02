import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import styles from './Sidebar.module.css';
import clsx from 'clsx';

interface SidebarProps {
  collapsed: boolean;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/notes', icon: FileText, label: 'Notes' },
  { path: '/chat', icon: MessageSquare, label: 'AI Chat' },
];

export function Sidebar({ collapsed }: SidebarProps) {
  const { toggleSidebar } = useUIStore();
  const location = useLocation();

  return (
    <aside
      className={clsx(styles.sidebar, collapsed && styles.collapsed)}
      style={{
        width: collapsed
          ? 'var(--sidebar-collapsed-width)'
          : 'var(--sidebar-width)',
      }}
    >
      {/* Search button */}
      <button
        className={clsx(styles.searchButton, 'glass-interactive')}
        onClick={() => {
          // Open command palette
          const event = new KeyboardEvent('keydown', {
            key: 'k',
            ctrlKey: true,
            bubbles: true,
          });
          document.dispatchEvent(event);
        }}
      >
        <Search size={18} />
        {!collapsed && (
          <>
            <span className={styles.searchText}>Search...</span>
            <kbd className={styles.searchKbd}>⌘K</kbd>
          </>
        )}
      </button>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(styles.navItem, isActive && styles.active)
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className={styles.bottom}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(styles.navItem, isActive && styles.active)
          }
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {/* Collapse toggle */}
        <button
          className={styles.collapseButton}
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
