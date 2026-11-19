'use client';

import { HomeIcon, CompassIcon, HeartIcon } from './icons';

export type Tab = 'home' | 'discover' | 'matches';

export default function TabBar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; Icon: typeof HomeIcon }[] = [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'discover', label: 'Discover', Icon: CompassIcon },
    { id: 'matches', label: 'Matches', Icon: HeartIcon },
  ];

  return (
    <nav className="flex h-20 shrink-0 border-t-[3px] border-coy-ink bg-white">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
            className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 text-xs font-bold text-coy-ink"
          >
            <span
              className={`flex h-8 w-[58px] items-center justify-center rounded-2xl border-2 transition-all ${
                isActive
                  ? 'border-coy-ink bg-coy-pink text-coy-ink shadow-[1.5px_1.5px_0px_#17121F]'
                  : 'border-transparent text-coy-gray'
              }`}
            >
              <Icon size={22} />
            </span>
            {label}
          </button>
        );
      })}
    </nav>
  );
}
