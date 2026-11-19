export type Direction = 'like' | 'pass';

export type Profile = {
  id: number;
  name: string;
  gender: 'girl' | 'boy';
  age: number;
  cityOrCollege: string;
  bio: string;
  interests: string[];
  photoUrl: string;
};

export type MatchItem = { profile: Profile; matchedAt: string };
export type SwipeResult = { match: boolean; profile?: Profile };
export type Show = 'girl' | 'boy' | 'all';

