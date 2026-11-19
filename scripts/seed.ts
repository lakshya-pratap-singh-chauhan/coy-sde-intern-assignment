import path from 'path';
import { createDb } from '../src/lib/db';
import { seedProfiles } from '../src/data/profiles';

const db = createDb(path.join(process.cwd(), 'data', 'coy.db'));

const insertProfile = db.prepare(
  `INSERT INTO profiles (id, name, gender, age, city_or_college, bio, interests, photo_url)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);

const insertLike = db.prepare('INSERT INTO likes_me (profile_id) VALUES (?)');

const run = db.transaction(() => {
  db.exec('DELETE FROM matches; DELETE FROM swipes; DELETE FROM likes_me; DELETE FROM profiles;');
  for (const p of seedProfiles) {
    insertProfile.run(
      p.id,
      p.name,
      p.gender,
      p.age,
      p.cityOrCollege,
      p.bio,
      JSON.stringify(p.interests),
      p.photoUrl
    );
    if (p.likesMe) insertLike.run(p.id);
  }
});

run();

console.log(`Seeded ${seedProfiles.length} profiles, ${seedProfiles.filter((p) => p.likesMe).length} secret likes.`);
