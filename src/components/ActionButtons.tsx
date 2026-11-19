import { CloseIcon, HeartIcon } from './icons';

export default function ActionButtons({
  onPass,
  onLike,
  disabled,
}: {
  onPass: () => void;
  onLike: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-7 pb-3 pt-2">
      <button
        type="button"
        disabled={disabled}
        aria-label="Pass"
        onClick={onPass}
        className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px]
          border-coy-ink bg-white text-coy-ink shadow-hard transition-transform
          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
      >
        <CloseIcon size={30} strokeWidth={3} />
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-label="Like"
        onClick={onLike}
        className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px]
          border-coy-ink bg-coy-pink text-coy-ink shadow-hard transition-transform
          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
      >
        <HeartIcon size={32} filled />
      </button>
    </div>
  );
}
