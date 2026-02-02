import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  FileText,
  MessageSquare,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.greeting}>
          <h1 className={styles.title}>
            Welcome to <span className="gradient-text">OpenClaw</span>
          </h1>
          <p className={styles.subtitle}>
            Your personal command center is ready. What would you like to do?
          </p>
        </div>
      </header>

      {/* Quick Actions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.quickActions}>
          <GlassCard
            hover
            className={styles.actionCard}
            onClick={() => navigate('/tasks')}
          >
            <div className={styles.actionIcon} style={{ background: 'var(--color-accent-muted)' }}>
              <CheckSquare size={24} color="var(--color-accent)" />
            </div>
            <div className={styles.actionContent}>
              <h3>Tasks</h3>
              <p>Manage your todos</p>
            </div>
          </GlassCard>

          <GlassCard
            hover
            className={styles.actionCard}
            onClick={() => navigate('/notes')}
          >
            <div className={styles.actionIcon} style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
              <FileText size={24} color="var(--color-success)" />
            </div>
            <div className={styles.actionContent}>
              <h3>Notes</h3>
              <p>Write and organize</p>
            </div>
          </GlassCard>

          <GlassCard
            hover
            className={styles.actionCard}
            onClick={() => navigate('/chat')}
          >
            <div className={styles.actionIcon} style={{ background: 'rgba(236, 72, 153, 0.15)' }}>
              <MessageSquare size={24} color="#ec4899" />
            </div>
            <div className={styles.actionContent}>
              <h3>AI Chat</h3>
              <p>Talk to your assistant</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Stats Overview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.stats}>
          <GlassCard variant="subtle" className={styles.statCard}>
            <div className={styles.statIcon}>
              <Clock size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Tasks Due Today</span>
            </div>
          </GlassCard>

          <GlassCard variant="subtle" className={styles.statCard}>
            <div className={styles.statIcon}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Tasks Completed</span>
            </div>
          </GlassCard>

          <GlassCard variant="subtle" className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileText size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Notes Created</span>
            </div>
          </GlassCard>

          <GlassCard variant="subtle" className={styles.statCard}>
            <div className={styles.statIcon}>
              <Zap size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>AI Conversations</span>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Getting Started */}
      <section className={styles.section}>
        <GlassCard variant="elevated" className={styles.gettingStarted}>
          <h2 className={styles.sectionTitle}>Getting Started</h2>
          <p className={styles.gettingStartedText}>
            OpenClaw is your all-in-one personal assistant. Use keyboard shortcuts
            for quick access:
          </p>
          <div className={styles.shortcuts}>
            <div className={styles.shortcutItem}>
              <kbd>⌘K</kbd>
              <span>Command Palette</span>
            </div>
            <div className={styles.shortcutItem}>
              <kbd>⌘⇧T</kbd>
              <span>Quick Add Task</span>
            </div>
            <div className={styles.shortcutItem}>
              <kbd>⌘⇧N</kbd>
              <span>Quick Add Note</span>
            </div>
            <div className={styles.shortcutItem}>
              <kbd>⌘B</kbd>
              <span>Toggle Sidebar</span>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
