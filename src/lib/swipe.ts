import type { DB } from './db';
import type { Direction, MatchItem, Profile, SwipeResult, Show } from './types';

type Row = {
  id: number;
  name: string;
  gender: string;
  age: number;
  city_or_college: string;
  bio: string;
  interests: string;
  photo_url: string;
};

const COLS = 'id, name, gender, age, city_or_college, bio, interests, photo_url';

export class SwipeError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function toProfile(r: Row | Record<string, unknown>): Profile {
  return {
    id: Number(r.id),
    name: String(r.name),
    gender: r.gender as Profile['gender'],
    age: Number(r.age),
    cityOrCollege: String(r.city_or_college),
    bio: String(r.bio),
    interests: typeof r.interests === 'string' ? JSON.parse(r.interests) : (r.interests as string[]),
    photoUrl: String(r.photo_url),
  };
}

export async function getFeed(db: DB, show: Show = 'all'): Promise<Profile[]> {
  const extra = show === 'all' ? '' : 'AND gender = ?';
  const rs = await db.execute({
    sql: `SELECT ${COLS} FROM profiles
          WHERE id NOT IN (SELECT profile_id FROM swipes) ${extra}
          ORDER BY ((id * 7) % 32), id`,
    args: show === 'all' ? [] : [show],
  });
  return rs.rows.map((r) => toProfile(r));
}

export function recordSwipe(db: DB, profileId: number, direction: Direction): SwipeResult {
  if (direction !== 'like' && direction !== 'pass') throw new SwipeError(400, 'Invalid direction');
  if (!Number.isInteger(profileId)) throw new SwipeError(400, 'Invalid profileId');
  const row = db.prepare(`SELECT ${COLS} FROM profiles WHERE id = ?`).get(profileId) as Row | undefined;
  if (!row) throw new SwipeError(404, 'Profile not found');
  const profile = toProfile(row);

  const run = db.transaction((): SwipeResult => {
    const existing = db.prepare('SELECT 1 FROM swipes WHERE profile_id = ?').get(profileId);
    if (existing) {
      const m = db.prepare('SELECT 1 FROM matches WHERE profile_id = ?').get(profileId);
      return m ? { match: true, profile } : { match: false };
    }
    db.prepare('INSERT INTO swipes (profile_id, direction) VALUES (?, ?)').run(profileId, direction);
    const likedMe = db.prepare('SELECT 1 FROM likes_me WHERE profile_id = ?').get(profileId);
    if (direction === 'like' && likedMe) {
      db.prepare('INSERT INTO matches (profile_id) VALUES (?)').run(profileId);
      return { match: true, profile };
    }
    return { match: false };
  });

  return run();
}

export function getMatches(db: DB): MatchItem[] {
  const rows = db
    .prepare(
      `SELECT p.id, p.name, p.gender, p.age, p.city_or_college, p.bio, p.interests, p.photo_url,
              m.created_at AS matched_at
       FROM matches m JOIN profiles p ON p.id = m.profile_id
       ORDER BY m.created_at DESC, m.rowid DESC`
    )
    .all() as (Row & { matched_at: string })[];
  return rows.map((r) => ({ profile: toProfile(r), matchedAt: r.matched_at }));
}

export async function resetSwipes(db: DB): Promise<void> {
  await db.batch(['DELETE FROM matches', 'DELETE FROM swipes'], 'write');
}
