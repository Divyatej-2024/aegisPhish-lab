interface StatCardProps {
  title: string;
  value: number;
  description: string;
}

export function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{title}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
