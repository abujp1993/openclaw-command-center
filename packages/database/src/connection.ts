import Database from 'better-sqlite3';
import { join } from 'path';
import { app } from 'electron';
import { DB_NAME } from '@openclaw/shared';

let db: Database.Database | null = null;

/**
 * Get the database file path
 */
function getDatabasePath(): string {
  // In development, use the current directory
  // In production, use the app's user data directory
  const userDataPath =
    process.type === 'browser'
      ? app.getPath('userData')
      : process.env.APPDATA || process.env.HOME || '.';

  return join(userDataPath, DB_NAME);
}

/**
 * Initialize the database connection
 */
export function initializeDatabase(): Database.Database {
  if (db) {
    return db;
  }

  const dbPath = getDatabasePath();
  console.log(`Initializing database at: ${dbPath}`);

  db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');

  return db;
}

/**
 * Get the database instance
 */
export function getDatabase(): Database.Database {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
