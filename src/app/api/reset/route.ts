import { getDb } from '@/lib/db';
import { resetSwipes } from '@/lib/swipe';

export const dynamic = 'force-dynamic';

export async function POST() {
  const db = await getDb();
  await resetSwipes(db);
  return Response.json({ ok: true });
}
