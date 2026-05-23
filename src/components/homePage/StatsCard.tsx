interface Stat {
  value: string;
  label: string;
}

function StatsCard({ stat }: { stat: Stat }) {
  return (
    <div key={stat.label}>
      <h3 className="text-3xl font-black text-teal-900">{stat.value}</h3>

      <p className="mt-2 text-sm text-neutral-500">{stat.label}</p>
    </div>
  );
}
export default StatsCard;
