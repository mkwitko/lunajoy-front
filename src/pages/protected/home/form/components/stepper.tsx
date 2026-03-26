import { ChevronLeft, ChevronRight } from "lucide-react";

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-muted/40 rounded-2xl px-4 py-3 w-fit">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-2xl font-semibold text-foreground min-w-[60px] text-center">
        {value}
        {unit}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
