'use client';

import { useEffect, useState } from 'react';
import type { MatchItem } from '@/lib/types';
import { fetchMatches } from '@/lib/api';
import { timeAgo } from '@/lib/time';
import Header from './Header';
import Badge from './Badge';
import Avatar from './Avatar';

const AV_BG = ['bg-coy-pink', 'bg-coy-yellow', 'bg-coy-mint', 'bg-coy-lilac'];

export default function MatchesTab() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches()
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="px-6 pb-3">
        <Badge>Only mutual likes show up here</Badge>
      </div>
      {loading ? (
        <p className="px-6 font-bold text-coy-gray">Loading...</p>
      ) : matches.length === 0 ? (
        <p className="px-6 font-bold text-coy-gray">
          No matches yet. Swipe right on someone who likes you back!
        </p>
      ) : (
        <ul className="flex-1 space-y-3.5 overflow-y-auto px-[22px] pb-4 pt-1.5">
          {matches.map(({ profile, matchedAt }, index) => (
            <li
              key={profile.id}
              className="flex min-h-[44px] items-center gap-3.5 rounded-[22px] border-[3px] border-coy-ink bg-white p-3 shadow-hard-sm"
            >
              <Avatar
                src={profile.photoUrl}
                name={profile.name}
                size={58}
                bg={AV_BG[index % 4]}
                className="rounded-2xl border-2 border-coy-ink"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[17px] font-extrabold tracking-[-0.5px] text-coy-ink truncate">
                  {profile.name}, {profile.age}
                </div>
                <div className="text-sm font-semibold text-coy-gray truncate">
                  {profile.cityOrCollege}
                </div>
              </div>
              <span className="rounded-full border-2 border-coy-ink bg-coy-yellow px-3 py-1 text-xs font-bold text-coy-ink shadow-[1px_1px_0px_#17121F] shrink-0">
                {timeAgo(matchedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
