'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion';
import type { Direction, Profile } from '@/lib/types';
import { CloseIcon, HeartIcon } from './icons';

export type SwipeCardHandle = { swipe: (d: Direction) => void };
type Props = { profile: Profile; onSwiped: (d: Direction) => void };

const CHIP_COLORS = ['bg-coy-yellow', 'bg-coy-mint', 'bg-coy-lilac'];

const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard(
  { profile, onSwiped },
  ref
) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-11, -1, 9]);
  const greenOpacity = useTransform(x, [0, 120], [0, 0.82]);
  const redOpacity = useTransform(x, [-120, 0], [0.85, 0]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  function fly(d: Direction) {
    animate(x, d === 'like' ? 500 : -500, { duration: 0.25, onComplete: () => onSwiped(d) });
  }

  useImperativeHandle(ref, () => ({ swipe: fly }));

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 100 || info.velocity.x > 600) fly('like');
    else if (info.offset.x < -100 || info.velocity.x < -600) fly('pass');
    else animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
  }

  return (
    <motion.div
      drag="x"
      dragMomentum={false}
      onDragEnd={onDragEnd}
      style={{ x, rotate }}
      className="absolute inset-0 flex flex-col touch-none select-none overflow-hidden rounded-[28px]
        border-[3px] border-coy-ink bg-white shadow-hard-lg"
    >
      <div
        className="relative flex min-h-0 flex-1 items-end justify-center overflow-hidden
          border-b-[3px] border-coy-ink bg-coy-pink"
      >
        <svg viewBox="0 0 100 100" className="h-[85%] w-auto" aria-hidden="true">
          <circle cx="50" cy="36" r="17" fill="#17121F" />
          <path d="M12 100c0-24 17-38 38-38s38 14 38 38z" fill="#17121F" />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photoUrl}
          alt={profile.name}
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
          className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
        />
      </div>
      <div className="flex shrink-0 flex-col gap-1 px-4 py-2.5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-[28px] font-extrabold tracking-[-1px] text-coy-ink">{profile.name}</h2>
          <span className="text-xl font-bold text-coy-ink">{profile.age}</span>
        </div>
        <p className="text-[13px] font-bold text-coy-gray">{profile.cityOrCollege}</p>
        <p className="line-clamp-2 text-sm font-medium leading-snug text-coy-ink">{profile.bio}</p>
        <div className="flex flex-nowrap gap-1.5 overflow-hidden pt-0.5">
          {profile.interests.map((i, idx) => (
            <span
              key={i}
              className={`shrink-0 rounded-full border-2 border-coy-ink px-2.5 py-0.5 text-xs font-bold text-coy-ink ${CHIP_COLORS[idx % 3]}`}
            >
              {i}
            </span>
          ))}
        </div>
      </div>
      <motion.div
        style={{ opacity: greenOpacity }}
        className="pointer-events-none absolute inset-0 bg-coy-mint"
      />
      <motion.div
        style={{ opacity: redOpacity }}
        className="pointer-events-none absolute inset-0 bg-coy-nopetint"
      />
      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-5 top-6 -rotate-12 rounded-xl border-4
          border-coy-like bg-white px-3.5 py-0.5 text-3xl font-extrabold tracking-widest
          text-coy-like"
      >
        LIKE
      </motion.div>
      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute inset-x-0 top-[34%] flex justify-center
          text-coy-like"
      >
        <HeartIcon size={110} filled />
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="pointer-events-none absolute right-5 top-6 rotate-12 rounded-xl border-4
          border-coy-nope bg-white px-3.5 py-0.5 text-3xl font-extrabold tracking-widest
          text-coy-nope"
      >
        NOPE
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="pointer-events-none absolute inset-x-0 top-[34%] flex justify-center
          text-coy-nope"
      >
        <CloseIcon size={110} strokeWidth={3.4} />
      </motion.div>
    </motion.div>
  );
});

export default SwipeCard;
