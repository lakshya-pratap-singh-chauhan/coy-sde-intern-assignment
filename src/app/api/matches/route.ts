import { getDb } from '@/lib/db';
import { getMatches } from '@/lib/swipe';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  return Response.json({ matches: await getMatches(db) });
}
