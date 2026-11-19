'use client';

import { motion } from 'framer-motion';
import Logo from './Logo';
import Avatar from './Avatar';
import type { Profile } from '@/lib/types';

export default function MatchOverlay({
  profile,
  onViewMatches,
  onKeepSwiping,
}: {
  profile: Profile;
  onViewMatches: () => void;
  onKeepSwiping: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      role="dialog"
      aria-label="It's a match"
      className="absolute inset-0 z-50 flex flex-col bg-coy-pink"
    >
      <div className="px-[22px] pt-4">
        <Logo />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-7 pb-8 text-center">
        <div className="flex items-center justify-center pt-2">
          <div className="-rotate-[8deg]">
            <Avatar
              name="You"
              size={130}
              bg="bg-coy-yellow"
              className="rounded-[26px] border-[3px] border-coy-ink shadow-hard"
            />
          </div>
          <div className="-ml-5 rotate-[8deg]">
            <Avatar
              src={profile.photoUrl}
              name={profile.name}
              size={130}
              bg="bg-coy-mint"
              className="rounded-[26px] border-[3px] border-coy-ink shadow-hard"
            />
          </div>
        </div>
        <h1 className="mt-7 text-[50px] font-extrabold leading-[0.95] tracking-[-2px] text-coy-ink">
          It&apos;s a match!
        </h1>
        <p className="mt-3 text-[19px] font-bold text-coy-ink">
          You and {profile.name} liked each other.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={onViewMatches}
            className="h-[58px] rounded-full border-[3px] border-coy-ink bg-coy-ink text-[17px] font-extrabold text-white shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            View matches
          </button>
          <button
            type="button"
            onClick={onKeepSwiping}
            className="h-[58px] rounded-full border-[3px] border-coy-ink bg-white text-[17px] font-extrabold text-coy-ink shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Keep swiping
          </button>
        </div>
      </div>
    </motion.div>
  );
}
