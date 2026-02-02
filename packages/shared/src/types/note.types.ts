// Notes & Knowledge Base Types

export interface Note {
  id: string;
  title: string;
  content?: string;
  folderId?: string;
  linkedTaskId?: string;
  isPinned: boolean;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  position: number;
  children?: Folder[];
  createdAt: number;
}

export interface NoteSearchResult {
  note: Note;
  snippet: string;
  highlights: { start: number; end: number }[];
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  folderId?: string;
  linkedTaskId?: string;
  isPinned?: boolean;
  tags?: string[];
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  folderId?: string;
  linkedTaskId?: string;
  isPinned?: boolean;
  tags?: string[];
}

export interface NoteFilters {
  folderId?: string | null;
  tags?: string[];
  isPinned?: boolean;
  search?: string;
  linkedTaskId?: string;
}

export interface CreateFolderInput {
  name: string;
  parentId?: string;
}

export interface UpdateFolderInput {
  name?: string;
  parentId?: string;
  position?: number;
}
