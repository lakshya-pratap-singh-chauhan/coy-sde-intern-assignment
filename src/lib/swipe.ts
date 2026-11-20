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
  return rs.rows.map((r) => toProfile(r as unknown as Row));
}

export async function recordSwipe(db: DB, profileId: number, direction: Direction): Promise<SwipeResult> {
  if (direction !== 'like' && direction !== 'pass') throw new SwipeError(400, 'Invalid direction');
  if (!Number.isInteger(profileId)) throw new SwipeError(400, 'Invalid profileId');

  const rs = await db.execute({ sql: `SELECT ${COLS} FROM profiles WHERE id = ?`, args: [profileId] });
  if (rs.rows.length === 0) throw new SwipeError(404, 'Profile not found');
  const profile = toProfile(rs.rows[0] as unknown as Row);

  // Check for duplicate swipe
  const dup = await db.execute({ sql: 'SELECT 1 FROM swipes WHERE profile_id = ?', args: [profileId] });
  if (dup.rows.length > 0) {
    const m = await db.execute({ sql: 'SELECT 1 FROM matches WHERE profile_id = ?', args: [profileId] });
    return m.rows.length > 0 ? { match: true, profile } : { match: false };
  }

  // Record the swipe and optionally create a match — atomically
  if (direction === 'like') {
    const likedMe = await db.execute({ sql: 'SELECT 1 FROM likes_me WHERE profile_id = ?', args: [profileId] });
    if (likedMe.rows.length > 0) {
      await db.batch([
        { sql: 'INSERT INTO swipes (profile_id, direction) VALUES (?, ?)', args: [profileId, direction] },
        { sql: 'INSERT INTO matches (profile_id) VALUES (?)', args: [profileId] },
      ], 'write');
      return { match: true, profile };
    }
  }
  await db.execute({ sql: 'INSERT INTO swipes (profile_id, direction) VALUES (?, ?)', args: [profileId, direction] });
  return { match: false };
}

export async function getMatches(db: DB): Promise<MatchItem[]> {
  const rs = await db.execute(
    `SELECT p.id, p.name, p.gender, p.age, p.city_or_college, p.bio, p.interests, p.photo_url,
            m.created_at AS matched_at
     FROM matches m JOIN profiles p ON p.id = m.profile_id
     ORDER BY m.created_at DESC, m.rowid DESC`
  );
  return rs.rows.map((r) => ({
    profile: toProfile(r as unknown as Row),
    matchedAt: String(r.matched_at),
  }));
}

export async function resetSwipes(db: DB): Promise<void> {
  await db.batch(['DELETE FROM matches', 'DELETE FROM swipes'], 'write');
}
