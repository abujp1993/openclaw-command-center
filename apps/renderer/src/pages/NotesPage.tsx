import { useState } from 'react';
import { Plus, Search, Folder, FileText, Pin } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { useUIStore } from '@/stores/uiStore';
import styles from './NotesPage.module.css';

export function NotesPage() {
  const { openQuickAdd } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data - will be replaced with real data
  const notes: any[] = [];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Notes</h1>
          <span className={styles.count}>{notes.length} notes</span>
        </div>
        <div className={styles.headerRight}>
          <GlassButton
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => openQuickAdd('note')}
          >
            New Note
          </GlassButton>
        </div>
      </header>

      {/* Search */}
      <GlassCard className={styles.searchBar}>
        <GlassInput
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search size={18} />}
        />
      </GlassCard>

      {/* Content */}
      <div className={styles.content}>
        {/* Sidebar with folders */}
        <aside className={styles.sidebar}>
          <GlassCard variant="subtle" padding="sm" className={styles.folderList}>
            <div className={styles.folderHeader}>
              <Folder size={16} />
              <span>Folders</span>
            </div>
            <div className={styles.folderItem}>
              <FileText size={14} />
              <span>All Notes</span>
              <span className={styles.folderCount}>0</span>
            </div>
          </GlassCard>
        </aside>

        {/* Notes grid */}
        <main className={styles.main}>
          {notes.length === 0 ? (
            <GlassCard variant="subtle" className={styles.emptyState}>
              <FileText size={48} className={styles.emptyIcon} />
              <h3>No notes yet</h3>
              <p>Create your first note to start organizing your thoughts</p>
            </GlassCard>
          ) : (
            <div className={styles.notesGrid}>
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

interface NoteCardProps {
  note: any;
}

function NoteCard({ note }: NoteCardProps) {
  return (
    <GlassCard hover className={styles.noteCard}>
      <div className={styles.noteHeader}>
        <h3 className={styles.noteTitle}>{note.title}</h3>
        {note.isPinned && <Pin size={14} className={styles.pinIcon} />}
      </div>
      <p className={styles.notePreview}>{note.content?.slice(0, 150)}...</p>
      <div className={styles.noteMeta}>
        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        {note.tags?.length > 0 && (
          <div className={styles.tags}>
            {note.tags.slice(0, 2).map((tag: string) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
