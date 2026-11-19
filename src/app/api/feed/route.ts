import { getDb } from '@/lib/db';
import { getFeed } from '@/lib/swipe';
import type { Show } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const param = new URL(req.url).searchParams.get('show');
  const show: Show = param === 'girl' || param === 'boy' ? param : 'all';
  const db = await getDb();
  return Response.json({ profiles: await getFeed(db, show) });
}
