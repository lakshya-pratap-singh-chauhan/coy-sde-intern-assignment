'use client';

import { useEffect, useRef, useState } from 'react';
import type { Direction, Profile, Show } from '@/lib/types';
import { fetchFeed, postSwipe, resetAll } from '@/lib/api';
import Header from './Header';
import Badge from './Badge';
import SwipeCard, { type SwipeCardHandle } from './SwipeCard';
import ActionButtons from './ActionButtons';
import MatchOverlay from './MatchOverlay';
import EmptyState from './EmptyState';
import PreferencePicker from './PreferencePicker';

const SHOW_LABEL = { girl: 'Women', boy: 'Men', all: 'Everyone' } as const;

export default function DiscoverTab({ onViewMatches }: { onViewMatches: () => void }) {
  const [queue, setQueue] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [matched, setMatched] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<SwipeCardHandle>(null);

  const [show, setShow] = useState<Show | null>(null);
  const [prefLoaded, setPrefLoaded] = useState(false);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('coy-show');
      if (saved === 'girl' || saved === 'boy' || saved === 'all') {
        setShow(saved);
      }
    } catch {
      // ignore localStorage error
    }
    setPrefLoaded(true);
  }, []);

  useEffect(() => {
    if (show === null) return;
    setLoading(true);
    fetchFeed(show)
      .then(setQueue)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [show]);

  function pickShow(s: Show) {
    try {
      localStorage.setItem('coy-show', s);
    } catch {
      // ignore localStorage error
    }
    setShow(s);
    setPicking(false);
  }

  async function startOver() {
    try {
      setError(false);
      setLoading(true);
      await resetAll();
      setQueue(await fetchFeed(show ?? 'all'));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const next = queue[1];
    if (next) {
      const img = new Image();
      img.src = next.photoUrl;
    }
  }, [queue]);

  async function handleSwiped(d: Direction) {
    const current = queue[0];
    if (!current) return;
    setQueue((q) => q.slice(1));
    setBusy(false);
    try {
      const result = await postSwipe(current.id, d);
      if (result.match && result.profile) setMatched(result.profile);
    } catch {
      setError(true);
    }
  }

  function trigger(d: Direction) {
    if (busy || !queue[0]) return;
    setBusy(true);
    cardRef.current?.swipe(d);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (matched || picking || show === null) return;
      if (e.key === 'ArrowRight') trigger('like');
      if (e.key === 'ArrowLeft') trigger('pass');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const top = queue[0];

  return (
    <div className="flex h-full flex-col">
      <Header onFilterClick={() => setPicking(true)} filterLabel={show ? SHOW_LABEL[show] : undefined} />
      {!prefLoaded ? (
        <p className="pt-24 text-center font-bold text-coy-gray">Loading...</p>
      ) : show === null || picking ? (
        <div className="relative mx-[22px] mb-1.5 flex-1">
          <PreferencePicker current={show} onPick={pickShow} />
        </div>
      ) : (
        <>
          <div className="px-6 pb-2">
            <Badge>Likes stay secret until it&apos;s mutual</Badge>
          </div>
          <div className="relative mx-[22px] mb-1.5 flex-1">
            {loading ? (
              <p className="pt-24 text-center font-bold text-coy-gray">Loading...</p>
            ) : top ? (
              <>
                <div
                  className="absolute inset-x-3 bottom-0 top-3 rotate-3 rounded-[28px]
                    border-[3px] border-coy-ink bg-coy-yellow"
                />
                <div className="absolute inset-0">
                  <SwipeCard key={top.id} ref={cardRef} profile={top} onSwiped={handleSwiped} />
                </div>
              </>
            ) : (
              <EmptyState onViewMatches={onViewMatches} onStartOver={startOver} />
            )}
          </div>
          {error && (
            <p className="px-6 pt-2 text-center text-sm font-bold text-coy-nope">
              Something went wrong. Please try again.
            </p>
          )}
          {top && (
            <ActionButtons
              onPass={() => trigger('pass')}
              onLike={() => trigger('like')}
              disabled={busy}
            />
          )}
        </>
      )}
      {matched && (
        <MatchOverlay
          profile={matched}
          onKeepSwiping={() => setMatched(null)}
          onViewMatches={() => {
            setMatched(null);
            onViewMatches();
          }}
        />
      )}
    </div>
  );
}
