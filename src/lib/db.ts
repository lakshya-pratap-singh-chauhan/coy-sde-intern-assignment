import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export type DB = Database.Database & {
  execute(stmt: { sql: string; args?: unknown[] } | string): Promise<{ rows: Record<string, unknown>[]; rowsAffected?: number }>;
  batch(stmts: ({ sql: string; args?: unknown[] } | string)[], mode?: 'write' | 'read' | 'deferred'): Promise<unknown[]>;
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS profiles (
 id INTEGER PRIMARY KEY,
 name TEXT NOT NULL,
 gender TEXT NOT NULL,
 age INTEGER NOT NULL,
 city_or_college TEXT NOT NULL,
 bio TEXT NOT NULL,
 interests TEXT NOT NULL,
 photo_url TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS likes_me (
 profile_id INTEGER PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS swipes (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 profile_id INTEGER NOT NULL UNIQUE,
 direction TEXT NOT NULL CHECK (direction IN ('like', 'pass')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS matches (
 profile_id INTEGER PRIMARY KEY,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

export function createDb(file: string): DB {
 if (file !== ':memory:') {
 fs.mkdirSync(path.dirname(file), { recursive: true });
 }
 const db = new Database(file);
  (db as unknown as Record<string, unknown>).execute = async function (stmt: { sql: string; args?: unknown[] } | string) {
    const sql = typeof stmt === 'string' ? stmt : stmt.sql;
    const args = typeof stmt === 'string' ? [] : (stmt.args ?? []);
    if (/^\s*SELECT/i.test(sql)) {
      const rows = db.prepare(sql).all(...args) as Record<string, unknown>[];
      return { rows, rowsAffected: 0 };
    }
    const info = db.prepare(sql).run(...args);
    return { rows: [], rowsAffected: info.changes };
  };
  (db as unknown as Record<string, unknown>).batch = async function (stmts: ({ sql: string; args?: unknown[] } | string)[]) {
    const fn = db.transaction(() => {
      for (const s of stmts) {
        const sql = typeof s === 'string' ? s : s.sql;
        const args = typeof s === 'string' ? [] : (s.args ?? []);
        db.prepare(sql).run(...args);
      }
    });
    fn();
    return [];
  };
 db.exec(SCHEMA);
 return db as DB;
}

let shared: DB | null = null;

export function getDb(): DB {
 if (!shared) {
 shared = createDb(path.join(process.cwd(), 'data', 'coy.db'));
 }
 return shared;
}
