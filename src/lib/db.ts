import { createClient, type Client } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { ensureSeeded } from './seed';

export type DB = Client;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS profiles (
 id INTEGER PRIMARY KEY,
 name TEXT NOT NULL,
 gender TEXT NOT NULL,
 age INTEGER NOT NULL,
 city_or_college TEXT NOT NULL,
 bio TEXT NOT NULL,
 interests TEXT NOT NULL,
 photo_url TEXT NOT NULL
)`,
  `CREATE TABLE IF NOT EXISTS likes_me (
 profile_id INTEGER PRIMARY KEY
)`,
  `CREATE TABLE IF NOT EXISTS swipes (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 profile_id INTEGER NOT NULL UNIQUE,
 direction TEXT NOT NULL CHECK (direction IN ('like', 'pass')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS matches (
 profile_id INTEGER PRIMARY KEY,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
];

export function createDb(url: string, authToken?: string): DB {
  return createClient({ url, authToken });
}

export async function initDb(db: DB): Promise<void> {
  await db.batch(SCHEMA, 'write');
}

let shared: DB | null = null;
let ready: Promise<void> | null = null;

function defaultUrl(): string {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
  if (process.env.VERCEL) return 'file:/tmp/coy.db';
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
  return 'file:data/coy.db';
}

export async function getDb(): Promise<DB> {
  if (!shared) {
    const db = createDb(defaultUrl(), process.env.TURSO_AUTH_TOKEN);
    shared = db;
    ready = initDb(db).then(() => ensureSeeded(db));
  }
  await ready;
  return shared as DB;
}
