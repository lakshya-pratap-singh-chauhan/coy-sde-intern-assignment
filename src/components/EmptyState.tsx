import { HeartIcon } from './icons';

export default function EmptyState({
  onViewMatches,
  onStartOver,
}: {
  onViewMatches: () => void;
  onStartOver?: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="flex h-[132px] w-[132px] items-center justify-center rounded-full border-[3px] border-coy-ink bg-coy-mint shadow-hard-lg">
        <HeartIcon size={60} strokeWidth={2.2} />
      </div>
      <h2 className="mt-5 text-[34px] font-extrabold leading-none tracking-[-1.5px] text-coy-ink">
        You&apos;re all caught up.
      </h2>
      <p className="mt-3 max-w-[270px] text-[15px] font-bold leading-snug text-coy-gray">
        No more profiles right now. Check back later, or see who you&apos;ve matched with.
      </p>
      <button
        type="button"
        onClick={onViewMatches}
        className="mt-6 h-14 rounded-full border-[3px] border-coy-ink bg-coy-pink px-[34px] text-[17px] font-extrabold text-coy-ink shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        View matches
      </button>
      {onStartOver && (
        <button
          type="button"
          onClick={onStartOver}
          className="mt-3 h-12 rounded-full border-[3px] border-coy-ink bg-white px-7 text-base font-extrabold text-coy-ink shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Start over
        </button>
      )}
    </div>
  );
}
