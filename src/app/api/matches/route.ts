import { getDb } from '@/lib/db';
import { getMatches } from '@/lib/swipe';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ matches: getMatches(getDb()) });
}
