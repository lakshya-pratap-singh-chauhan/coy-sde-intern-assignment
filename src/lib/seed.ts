import type { DB } from './db';
import { seedProfiles } from '../data/profiles';

export async function seedDatabase(db: DB): Promise<void> {
  await db.batch(
    [
      'DELETE FROM matches',
      'DELETE FROM swipes',
      'DELETE FROM likes_me',
      'DELETE FROM profiles',
      ...seedProfiles.map((p) => ({
        sql: `INSERT INTO profiles
          (id, name, gender, age, city_or_college, bio, interests, photo_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [p.id, p.name, p.gender, p.age, p.cityOrCollege, p.bio,
          JSON.stringify(p.interests), p.photoUrl],
      })),
      ...seedProfiles
        .filter((p) => p.likesMe)
        .map((p) => ({ sql: 'INSERT INTO likes_me (profile_id) VALUES (?)', args: [p.id] })),
    ],
    'write'
  );
}

export async function ensureSeeded(db: DB): Promise<void> {
  const rs = await db.execute('SELECT COUNT(*) AS c FROM profiles');
  if (Number(rs.rows[0].c) === 0) await seedDatabase(db);
}
