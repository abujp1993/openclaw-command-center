import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { app } from 'electron';
import { DB_NAME } from '@openclaw/shared';

let db: SqlJsDatabase | null = null;
let dbPath: string = '';
let SQL: initSqlJs.SqlJsStatic | null = null;

/**
 * Get the database file path
 */
function getDatabasePath(): string {
  // In development, use the current directory
  // In production, use the app's user data directory
  let userDataPath: string;

  try {
    userDataPath = app.getPath('userData');
  } catch {
    userDataPath = process.env.APPDATA || process.env.HOME || '.';
  }

  // Ensure directory exists
  if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath, { recursive: true });
  }

  return join(userDataPath, DB_NAME);
}

/**
 * Initialize the database connection
 */
export async function initializeDatabase(): Promise<SqlJsDatabase> {
  if (db) {
    return db;
  }

  // Initialize SQL.js
  if (!SQL) {
    SQL = await initSqlJs();
  }

  dbPath = getDatabasePath();
  console.log(`Initializing database at: ${dbPath}`);

  // Load existing database or create new one
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  return db;
}

/**
 * Get the database instance
 */
export function getDatabase(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

/**
 * Save the database to disk
 */
export function saveDatabase(): void {
  if (db && dbPath) {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(dbPath, buffer);
  }
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
  }
}

/**
 * Helper to run a query and return results
 */
export function runQuery<T>(sql: string, params: unknown[] = []): T[] {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  stmt.bind(params);

  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();

  return results;
}

/**
 * Helper to run a statement (insert, update, delete)
 */
export function runStatement(sql: string, params: unknown[] = []): void {
  const database = getDatabase();
  database.run(sql, params);
  saveDatabase();
}

// Export type for compatibility
export type Database = SqlJsDatabase;
