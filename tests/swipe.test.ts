import { describe, it, expect, beforeEach } from 'vitest';
import { createDb, initDb, type DB } from '../src/lib/db';
import { getFeed, recordSwipe, getMatches, resetSwipes } from '../src/lib/swipe';

let db: DB;

beforeEach(async () => {
  db = createDb(':memory:');
  await initDb(db);
  await db.batch(
    [
      ...Array.from({ length: 4 }, (_, i) => ({
        sql: `INSERT INTO profiles (id, name, gender, age, city_or_college, bio, interests, photo_url)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [i + 1, `P${i + 1}`, (i + 1) % 2 ? 'girl' : 'boy', 20 + (i + 1), 'Delhi', 'bio',
          JSON.stringify(['a', 'b']), `/photos/p0${i + 1}.jpg`],
      })),
      { sql: 'INSERT INTO likes_me (profile_id) VALUES (?)', args: [1] },
      { sql: 'INSERT INTO likes_me (profile_id) VALUES (?)', args: [3] },
    ],
    'write'
  );
});

describe('feed', () => {
  it('never shows a swiped profile again', async () => {
    await recordSwipe(db, 2, 'pass');
    expect((await getFeed(db)).map((p) => p.id)).not.toContain(2);
  });
  it('never reveals who liked the user', async () => {
    expect(/like/i.test(JSON.stringify(await getFeed(db)))).toBe(false);
  });
  it('filters by gender', async () => {
    const girls = await getFeed(db, 'girl');
    const boys = await getFeed(db, 'boy');
    expect(girls.every((p) => p.gender === 'girl')).toBe(true);
    expect(boys.every((p) => p.gender === 'boy')).toBe(true);
    expect(girls.length + boys.length).toBe((await getFeed(db, 'all')).length);
  });
  it('excludes swiped profiles when filtered', async () => {
    await recordSwipe(db, 1, 'pass');
    expect((await getFeed(db, 'girl')).map((p) => p.id)).not.toContain(1);
  });
});

describe('swipe', () => {
  it('matches on a like when the profile liked me', async () => {
    expect((await recordSwipe(db, 1, 'like')).match).toBe(true);
  });
  it('does not match on a like when the profile did not like me', async () => {
    expect((await recordSwipe(db, 2, 'like')).match).toBe(false);
  });
  it('does not match on a pass', async () => {
    expect((await recordSwipe(db, 1, 'pass')).match).toBe(false);
    expect(await getMatches(db)).toHaveLength(0);
  });
  it('ignores duplicate swipes', async () => {
    await recordSwipe(db, 3, 'like');
    await recordSwipe(db, 3, 'like');
    const countRs = await db.execute('SELECT COUNT(*) AS c FROM swipes');
    expect(Number(countRs.rows[0].c)).toBe(1);
    expect(await getMatches(db)).toHaveLength(1);
  });
  it('rejects bad input', async () => {
    await expect(recordSwipe(db, 99, 'like')).rejects.toThrow();
    await expect(recordSwipe(db, 1, 'maybe' as never)).rejects.toThrow();
  });
});

describe('matches', () => {
  it('returns only mutual matches', async () => {
    await recordSwipe(db, 1, 'like');
    await recordSwipe(db, 2, 'like');
    expect((await getMatches(db)).map((m) => m.profile.id)).toEqual([1]);
  });
});

describe('reset', () => {
  it('clears swipes and matches but keeps the secret likes', async () => {
    await recordSwipe(db, 1, 'like');
    await recordSwipe(db, 2, 'pass');
    await resetSwipes(db);
    expect(await getMatches(db)).toHaveLength(0);
    expect((await getFeed(db)).map((p) => p.id)).toContain(1);
    const likes = await db.execute('SELECT COUNT(*) AS c FROM likes_me');
    expect(Number(likes.rows[0].c)).toBe(2);
    expect((await recordSwipe(db, 1, 'like')).match).toBe(true);
  });
});
