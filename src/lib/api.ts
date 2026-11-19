import type { Direction, MatchItem, Profile, SwipeResult, Show } from './types';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchFeed(show: Show = 'all'): Promise<Profile[]> {
  const res = await fetch(`/api/feed?show=${show}`, { cache: 'no-store' });
  return (await json<{ profiles: Profile[] }>(res)).profiles;
}

export async function postSwipe(profileId: number, direction: Direction): Promise<SwipeResult> {
  return json<SwipeResult>(
    await fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, direction }),
    })
  );
}

export async function fetchMatches(): Promise<MatchItem[]> {
  const data = await json<{ matches: MatchItem[] }>(await fetch('/api/matches', { cache: 'no-store' }));
  return data.matches;
}

export async function resetAll(): Promise<void> {
  const res = await fetch('/api/reset', { method: 'POST' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
}
