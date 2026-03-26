export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    name: string;
    value: number | string;
    color: string;
    dataKey: string;
  }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/90 backdrop-blur border border-border rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}
