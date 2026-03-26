export function StepHeader({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
