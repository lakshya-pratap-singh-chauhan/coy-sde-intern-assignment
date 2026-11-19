import Logo from './Logo';
import { FilterIcon } from './icons';

export default function Header({
  onFilterClick,
  filterLabel,
}: {
  onFilterClick?: () => void;
  filterLabel?: string;
} = {}) {
  return (
    <div className="flex items-center justify-between px-[22px] pb-2 pt-3">
      <Logo />
      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          aria-label={filterLabel ? `Showing ${filterLabel}. Change who you see` : 'Change who you see'}
          className={`flex h-12 items-center justify-center gap-2 rounded-full border-[3px] border-coy-ink bg-white text-sm font-extrabold shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${filterLabel ? 'px-4' : 'w-12'}`}
        >
          <FilterIcon size={20} strokeWidth={2.6} />
          {filterLabel}
        </button>
      )}
    </div>
  );
}
