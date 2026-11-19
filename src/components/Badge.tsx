import { LockIcon } from './icons';

export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex -rotate-2 items-center gap-2 rounded-full border-[3px]
        border-coy-ink bg-coy-yellow px-3.5 py-1.5 text-[13px] font-extrabold shadow-hard-sm select-none"
    >
      <LockIcon size={16} strokeWidth={2.6} />
      {children}
    </span>
  );
}
