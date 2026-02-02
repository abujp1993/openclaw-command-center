import type Database from 'better-sqlite3';
import { migration001Initial } from './001_initial.js';

interface Migration {
  version: number;
  name: string;
  up: (db: Database.Database) => void;
}

const migrations: Migration[] = [migration001Initial];

/**
 * Run all pending migrations
 */
export function runMigrations(db: Database.Database): void {
  // Create migrations table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at INTEGER NOT NULL
    )
  `);

  // Get current version
  const getCurrentVersion = db.prepare<[], { version: number }>(
    'SELECT COALESCE(MAX(version), 0) as version FROM migrations'
  );
  const currentVersion = getCurrentVersion.get()?.version ?? 0;

  console.log(`Current database version: ${currentVersion}`);

  // Run pending migrations
  const pendingMigrations = migrations.filter((m) => m.version > currentVersion);

  if (pendingMigrations.length === 0) {
    console.log('Database is up to date');
    return;
  }

  console.log(`Running ${pendingMigrations.length} migration(s)...`);

  const insertMigration = db.prepare<[number, string, number]>(
    'INSERT INTO migrations (version, name, applied_at) VALUES (?, ?, ?)'
  );

  for (const migration of pendingMigrations) {
    console.log(`Running migration ${migration.version}: ${migration.name}`);

    db.transaction(() => {
      migration.up(db);
      insertMigration.run(migration.version, migration.name, Date.now());
    })();

    console.log(`Migration ${migration.version} completed`);
  }

  console.log('All migrations completed');
}
