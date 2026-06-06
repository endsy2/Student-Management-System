interface StatsCardProps {
  label: string;
  value: string | number;
  accent?: string;
}

export function StatsCard({ label, value, accent = 'text-brand' }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
