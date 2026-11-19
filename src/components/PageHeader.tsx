export default function PageHeader({ title }: { title: string }) {
  return (
    <div className="px-6 pb-3 pt-5">
      <div className="text-[13px] font-extrabold tracking-wider text-accent">COY</div>
      <h1 className="text-[26px] font-extrabold leading-tight">{title}</h1>
    </div>
  );
}
