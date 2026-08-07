export interface StatItem {
  value: string;
  label: string;
}
export default function StatsCard({ stat }: { stat: StatItem }) {
  return (
    <div className="space-y-1 pl-4">
      <div className="text-3xl md:text-4xl font-extrabold text-mauve-200 tracking-tight">
        {stat.value}
      </div>
      <div className="text-xs md:text-sm font-semibold text-mauve-200 uppercase tracking-wider">
        {stat.label}
      </div>
    </div>
  );
}
