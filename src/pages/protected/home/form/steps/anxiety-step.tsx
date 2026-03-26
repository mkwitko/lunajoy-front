import { useFormContext } from "react-hook-form";
import { OptionChip } from "../components/option-chip";
import { StepHeader } from "../components/step-header";
import type { CreateDailyLogBodyAnxietyLevel } from "@/http/generated/lunajoy-server.schemas";
import type { LogFormSchema } from "../log-form-schema";

type AnxietyOptions = {
  value: CreateDailyLogBodyAnxietyLevel;
  label: string;
  emoji: string;
};

const ANXIETY_OPTIONS: AnxietyOptions[] = [
  { value: "CALM", label: "Calm", emoji: "🌿" },
  { value: "SLIGHTLY_ANXIOUS", label: "Slightly", emoji: "🌀" },
  { value: "MODERATE", label: "Moderate", emoji: "⚡" },
  { value: "HIGH", label: "High", emoji: "🔥" },
  { value: "OVERWHELMED", label: "Overwhelmed", emoji: "🌊" },
];

export function AnxietyStep() {
  const { watch, setValue } = useFormContext<LogFormSchema>();
  return (
    <div className="space-y-6">
      <StepHeader
        icon="🌬️"
        title="Anxiety levels"
        subtitle="How's your inner weather today?"
      />
      <div className="grid grid-cols-5 gap-4">
        {ANXIETY_OPTIONS.map((o) => (
          <OptionChip
            key={o.value}
            option={o}
            selected={watch("anxietyLevel") === o.value}
            onSelect={() =>
              setValue("anxietyLevel", o.value, {
                shouldDirty: true,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
