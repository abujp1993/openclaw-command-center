import type Database from 'better-sqlite3';
import { generateId, now } from '@openclaw/shared';
import type {
  Conversation,
  Message,
  CreateConversationInput,
} from '@openclaw/shared';

export class ConversationRepository {
  constructor(private db: Database.Database) {}

  /**
   * List all conversations
   */
  list(): Conversation[] {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations
      ORDER BY updated_at DESC
    `);

    const rows = stmt.all() as ConversationRow[];
    return rows.map((row) => this.mapRowToConversation(row));
  }

  /**
   * Get a conversation with its messages
   */
  get(id: string): Conversation | null {
    const stmt = this.db.prepare('SELECT * FROM conversations WHERE id = ?');
    const row = stmt.get(id) as ConversationRow | undefined;

    if (!row) return null;

    const conversation = this.mapRowToConversation(row);

    // Get messages
    const messagesStmt = this.db.prepare(`
      SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC
    `);
    const messageRows = messagesStmt.all(id) as MessageRow[];
    conversation.messages = messageRows.map((msg) => this.mapRowToMessage(msg));

    return conversation;
  }

  /**
   * Create a new conversation
   */
  create(input: CreateConversationInput): Conversation {
    const id = generateId();
    const timestamp = now();

    const stmt = this.db.prepare(`
      INSERT INTO conversations (id, title, provider, persona_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.title ?? null,
      input.provider,
      input.personaId ?? null,
      timestamp,
      timestamp
    );

    return this.get(id)!;
  }

  /**
   * Delete a conversation
   */
  delete(id: string): void {
    const stmt = this.db.prepare('DELETE FROM conversations WHERE id = ?');
    stmt.run(id);
  }

  /**
   * Add a message to a conversation
   */
  addMessage(
    conversationId: string,
    role: Message['role'],
    content: string,
    tokensUsed?: number
  ): Message {
    const id = generateId();
    const timestamp = now();

    const stmt = this.db.prepare(`
      INSERT INTO messages (id, conversation_id, role, content, tokens_used, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, conversationId, role, content, tokensUsed ?? null, timestamp);

    // Update conversation updated_at
    this.db
      .prepare('UPDATE conversations SET updated_at = ? WHERE id = ?')
      .run(timestamp, conversationId);

    return {
      id,
      conversationId,
      role,
      content,
      tokensUsed,
      createdAt: timestamp,
    };
  }

  /**
   * Update conversation title
   */
  updateTitle(id: string, title: string): void {
    const stmt = this.db.prepare(
      'UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?'
    );
    stmt.run(title, now(), id);
  }

  private mapRowToConversation(row: ConversationRow): Conversation {
    return {
      id: row.id,
      title: row.title ?? undefined,
      provider: row.provider as Conversation['provider'],
      personaId: row.persona_id ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapRowToMessage(row: MessageRow): Message {
    return {
      id: row.id,
      conversationId: row.conversation_id,
      role: row.role as Message['role'],
      content: row.content,
      tokensUsed: row.tokens_used ?? undefined,
      createdAt: row.created_at,
    };
  }
}

interface ConversationRow {
  id: string;
  title: string | null;
  provider: string;
  persona_id: string | null;
  created_at: number;
  updated_at: number;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  tokens_used: number | null;
  created_at: number;
}
