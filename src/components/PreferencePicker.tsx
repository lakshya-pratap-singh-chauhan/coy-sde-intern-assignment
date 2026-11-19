import type { Show } from '@/lib/types';

const OPTIONS: { id: Show; label: string; bg: string }[] = [
  { id: 'girl', label: 'Women', bg: 'bg-coy-pink' },
  { id: 'boy', label: 'Men', bg: 'bg-coy-yellow' },
  { id: 'all', label: 'Everyone', bg: 'bg-coy-mint' },
];

export default function PreferencePicker({
  current,
  onPick,
}: {
  current: Show | null;
  onPick: (s: Show) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <h2 className="text-[34px] font-extrabold leading-none tracking-[-1.5px]">
        Who do you want to meet?
      </h2>
      <p className="mb-2 text-base font-medium text-coy-gray">
        You can change this anytime.
      </p>
      {OPTIONS.map(({ id, label, bg }) => {
        const isSelected = current === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onPick(id)}
            aria-pressed={isSelected}
            className={`h-[58px] w-full rounded-full border-[3px] border-coy-ink text-[17px] font-extrabold text-coy-ink shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${bg}${
              isSelected ? ' ring-4 ring-coy-ink ring-offset-2' : ''
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
