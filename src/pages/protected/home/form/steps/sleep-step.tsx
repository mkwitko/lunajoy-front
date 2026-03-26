import { useFormContext } from "react-hook-form";
import { OptionChip } from "../components/option-chip";
import { StepHeader } from "../components/step-header";
import { Stepper } from "../components/stepper";
import type { CreateDailyLogBodySleepSleepQualityRating } from "@/http/generated/lunajoy-server.schemas";
import { useEffect } from "react";
import type { LogFormSchema } from "../log-form-schema";

type SleepOption = {
  value: CreateDailyLogBodySleepSleepQualityRating;
  label: string;
  emoji: string;
};

const SLEEP_QUALITY: SleepOption[] = [
  { value: "VERY_POOR", label: "Very Poor", emoji: "😫" },
  { value: "POOR", label: "Poor", emoji: "😴" },
  { value: "AVERAGE", label: "Average", emoji: "😑" },
  { value: "GOOD", label: "Good", emoji: "😌" },
  { value: "EXCELLENT", label: "Excellent", emoji: "✨" },
];

export function SleepStep() {
  const { watch, setValue } = useFormContext<LogFormSchema>();

  useEffect(() => {
    setValue("sleepHours", 8, { shouldDirty: true });
  }, []);

  return (
    <div className="space-y-6">
      <StepHeader
        icon="🌙"
        title="Sleep patterns"
        subtitle="Rest is the foundation of everything."
      />
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Hours of sleep
          </p>
          <Stepper
            value={watch("sleepHours")}
            onChange={(v) => setValue("sleepHours", v, { shouldDirty: true })}
            min={0}
            max={24}
            step={0.5}
            unit="h"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Sleep quality
          </p>
          <div className="grid grid-cols-5 gap-4">
            {SLEEP_QUALITY.map((o) => (
              <OptionChip
                key={o.value}
                option={o}
                size="sm"
                selected={watch("sleepQuality") === o.value}
                onSelect={(v) =>
                  setValue(
                    "sleepQuality",
                    v as CreateDailyLogBodySleepSleepQualityRating,
                    { shouldDirty: true },
                  )
                }
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Any disturbances? <span className="text-xs">(optional)</span>
          </p>
          <textarea
            value={watch("disturbances") || ""}
            onChange={(e) =>
              setValue("disturbances", e.target.value, { shouldDirty: true })
            }
            placeholder="Nightmares, noise, woke up early..."
            className="w-full bg-muted/30 border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
