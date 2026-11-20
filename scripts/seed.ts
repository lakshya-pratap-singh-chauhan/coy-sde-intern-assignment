import { config } from 'dotenv';
config({ path: '.env.local' });

import { createDb, initDb } from '../src/lib/db';
import { seedDatabase } from '../src/lib/seed';

async function main() {
  const url = process.env.TURSO_DATABASE_URL ?? 'file:data/coy.db';
  const db = createDb(url, process.env.TURSO_AUTH_TOKEN);
  await initDb(db);
  await seedDatabase(db);
  console.log(`Seeded ${url}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
