import Header from './Header';

export default function HomeTab({ onDiscover }: { onDiscover?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-9 pb-10 text-center">
        <div
          className="rounded-full border-[3px] border-coy-ink bg-coy-mint shadow-hard-lg"
          aria-hidden="true"
        >
          <svg viewBox="0 0 160 160" width="150" height="150">
            <path
              d="M80 118s-30-18-30-40a17 17 0 0130-10 17 17 0 0130 10c0 22-30 40-30 40z"
              fill="#FF3A7D" stroke="#17121F" strokeWidth="3" strokeLinejoin="round"
            />
            <path
              d="M128 30l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"
              fill="#FFE45C" stroke="#17121F" strokeWidth="2.5" strokeLinejoin="round"
            />
            <path
              d="M34 44l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"
              fill="#FFE45C" stroke="#17121F" strokeWidth="2.5" strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          className="mt-4 inline-block -rotate-2 rounded-full border-[3px] border-coy-ink
            bg-coy-yellow px-3.5 py-1 text-[13px] font-extrabold shadow-hard-sm"
        >
          Coming soon
        </span>
        <h2 className="text-[34px] font-extrabold leading-none tracking-[-1.5px]">
          We&apos;re working on it.
        </h2>
        <p className="text-base font-medium leading-[1.45] text-coy-gray">
          This page is not ready yet. Head over to Discover and start swiping.
        </p>
        {onDiscover && (
          <button
            type="button"
            onClick={onDiscover}
            className="mt-3 h-14 rounded-full border-[3px] border-coy-ink bg-coy-pink px-8
              text-[17px] font-extrabold text-coy-ink shadow-hard active:translate-x-[2px]
              active:translate-y-[2px] active:shadow-none"
          >
            Go to Discover
          </button>
        )}
      </div>
    </div>
  );
}
