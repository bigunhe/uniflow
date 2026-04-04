type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-5 shadow-sm">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-black tracking-tight text-slate-50">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-400">{helper}</p> : null}
    </article>
  );
}
