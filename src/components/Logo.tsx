export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end gap-[3px] select-none ${className}`} role="img" aria-label="coy">
      <span className="text-[42px] font-extrabold leading-[0.9] tracking-[-2.5px] text-coy-ink">coy</span>
      <span className="mb-[5px] h-3 w-3 rounded-full bg-coy-pink" />
    </div>
  );
}
