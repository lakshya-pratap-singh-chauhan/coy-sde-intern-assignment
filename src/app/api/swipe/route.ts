import { getDb } from '@/lib/db';
import { recordSwipe, SwipeError } from '@/lib/swipe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: { profileId?: unknown; direction?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  try {
    const db = await getDb();
    const result = await recordSwipe(db, Number(body.profileId), body.direction as 'like' | 'pass');
    return Response.json(result);
  } catch (e) {
    if (e instanceof SwipeError) {
      return Response.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
