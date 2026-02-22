import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TitleBar } from './TitleBar';
import { useUIStore } from '@/stores/uiStore';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className={styles.layout}>
      {/* Custom title bar for frameless window */}
      <TitleBar />

      <div className={styles.content}>
        {/* Sidebar navigation */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* Main content area */}
        <main
          className={styles.main}
          style={{
            marginLeft: sidebarCollapsed
              ? 'var(--sidebar-collapsed-width)'
              : 'var(--sidebar-width)',
          }}
        >
          <div className={styles.mainContent}>{children}</div>
        </main>
      </div>
    </div>
  );
}
