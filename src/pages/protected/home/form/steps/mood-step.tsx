import { useFormContext } from "react-hook-form";
import { OptionChip } from "../components/option-chip";
import { StepHeader } from "../components/step-header";
import type { CreateDailyLogBodyMood } from "@/http/generated/lunajoy-server.schemas";
import type { LogFormSchema } from "../log-form-schema";

type MoodOption = {
  value: CreateDailyLogBodyMood;
  label: string;
  emoji: string;
};

const MOOD_OPTIONS: MoodOption[] = [
  { value: "VERY_SAD", label: "Very Sad", emoji: "😔" },
  { value: "SAD", label: "Sad", emoji: "😕" },
  { value: "NEUTRAL", label: "Neutral", emoji: "😐" },
  { value: "HAPPY", label: "Happy", emoji: "🙂" },
  { value: "VERY_HAPPY", label: "Very Happy", emoji: "😄" },
];

export function MoodStep() {
  const { watch, setValue } = useFormContext<LogFormSchema>();
  return (
    <div className="space-y-6">
      <StepHeader
        icon="💜"
        title="How are you feeling today?"
        subtitle="Take a moment — there's no right answer."
      />
      <div className="grid grid-cols-5 gap-4">
        {MOOD_OPTIONS.map((o) => (
          <OptionChip
            key={o.value}
            option={o}
            selected={watch("mood") === o.value}
            onSelect={() =>
              setValue("mood", o.value, {
                shouldDirty: true,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
