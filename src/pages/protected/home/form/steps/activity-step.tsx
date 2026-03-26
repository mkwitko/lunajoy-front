import { AnimatePresence, motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { OptionChip } from "../components/option-chip";
import { StepHeader } from "../components/step-header";
import { Stepper } from "../components/stepper";
import type {
  CreateDailyLogBodyPhysicalActivityItemActivityType,
  CreateDailyLogBodyPhysicalActivityItemIntensity,
  CreateDailyLogBodySocialInteractionsItemSatisfactionLevel,
} from "@/http/generated/lunajoy-server.schemas";
import type { LogFormSchema } from "../log-form-schema";

type ActivityTypesOptions = {
  value: CreateDailyLogBodyPhysicalActivityItemActivityType;
  label: string;
  emoji: string;
};

type IntensityOptions = {
  value: CreateDailyLogBodyPhysicalActivityItemIntensity;
  label: string;
  emoji: string;
};

type SatisfactionOptions = {
  value: CreateDailyLogBodySocialInteractionsItemSatisfactionLevel;
  label: string;
  emoji: string;
};

const ACTIVITY_TYPES: ActivityTypesOptions[] = [
  { value: "WALKING", label: "Walking", emoji: "🚶" },
  { value: "RUNNING", label: "Running", emoji: "🏃" },
  { value: "CYCLING", label: "Cycling", emoji: "🚴" },
  { value: "SWIMMING", label: "Swimming", emoji: "🏊" },
  { value: "YOGA", label: "Yoga", emoji: "🧘" },
  { value: "OTHER", label: "Other", emoji: "💪" },
];

const INTENSITY: IntensityOptions[] = [
  { value: "LOW", label: "Low", emoji: "🌱" },
  { value: "MODERATE", label: "Moderate", emoji: "⚡" },
  { value: "HIGH", label: "High", emoji: "🔥" },
];

export const SATISFACTION: SatisfactionOptions[] = [
  { value: "VERY_DISSATISFIED", label: "Very Bad", emoji: "😞" },
  { value: "DISSATISFIED", label: "Bad", emoji: "😕" },
  { value: "NEUTRAL", label: "Ok", emoji: "😐" },
  { value: "SATISFIED", label: "Good", emoji: "🙂" },
  { value: "VERY_SATISFIED", label: "Great", emoji: "😄" },
];

export function ActivityStep() {
  const { watch, setValue } = useFormContext<LogFormSchema>();

  const activities = watch("activities") || [];

  const toggleActivity = (
    type: CreateDailyLogBodyPhysicalActivityItemActivityType,
  ) => {
    const exists = activities.find((a) => a.activityType === type);
    if (exists) {
      setValue(
        "activities",
        activities.filter((a) => a.activityType !== type),
      );
    } else {
      setValue("activities", [
        ...(activities || []),
        {
          activityType: type,
          durationInMinutes: 30,
          intensity: "MODERATE",
          satisfactionLevel: "NEUTRAL",
        },
      ]);
    }
  };
  const updateActivity = ({
    type,
    field,
    value,
  }: {
    type: CreateDailyLogBodyPhysicalActivityItemActivityType;
    field: "durationInMinutes" | "intensity" | "satisfactionLevel";
    value: number | CreateDailyLogBodyPhysicalActivityItemIntensity | string;
  }) => {
    const activities = watch("activities") || [];
    const updated = activities.map((a) =>
      a.activityType === type ? { ...a, [field]: value } : a,
    );
    setValue("activities", updated);
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon="⚡"
        title="Physical activity"
        subtitle="How did you move your body today?"
      />
      <div className="grid grid-cols-6 gap-4">
        {ACTIVITY_TYPES.map((o) => (
          <OptionChip<CreateDailyLogBodyPhysicalActivityItemActivityType>
            key={o.value}
            option={o}
            size="sm"
            selected={activities?.some((a) => a.activityType === o.value)}
            onSelect={toggleActivity}
          />
        ))}
      </div>
      <AnimatePresence>
        {activities?.map((act) => {
          const label = ACTIVITY_TYPES.find(
            (t) => t.value === act.activityType,
          )?.label;
          return (
            <motion.div
              key={act.activityType as string}
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
              className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3"
            >
              <p className="font-medium text-sm text-foreground">{label}</p>
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Duration</p>
                  <Stepper
                    value={act.durationInMinutes}
                    onChange={(v) =>
                      updateActivity({
                        type: act.activityType as CreateDailyLogBodyPhysicalActivityItemActivityType,
                        field: "durationInMinutes",
                        value: v,
                      })
                    }
                    min={5}
                    max={300}
                    step={5}
                    unit="min"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Intensity</p>
                <div className="flex flex-wrap gap-4">
                  {INTENSITY.map((i) => (
                    <OptionChip
                      key={i.value}
                      option={i}
                      size="sm"
                      selected={act.intensity === i.value}
                      onSelect={(v) =>
                        updateActivity({
                          type: act.activityType as CreateDailyLogBodyPhysicalActivityItemActivityType,
                          field: "intensity",
                          value:
                            v as CreateDailyLogBodyPhysicalActivityItemIntensity,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  How did it feel?
                </p>
                <div className="grid grid-cols-5 gap-4">
                  {SATISFACTION.map((s) => (
                    <OptionChip
                      key={s.value}
                      option={s}
                      size="sm"
                      selected={act.satisfactionLevel === s.value}
                      onSelect={(v) =>
                        updateActivity({
                          type: act.activityType as CreateDailyLogBodyPhysicalActivityItemActivityType,
                          field: "satisfactionLevel",
                          value:
                            v as CreateDailyLogBodySocialInteractionsItemSatisfactionLevel,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {(!activities || activities.length === 0) && (
        <p className="text-sm text-muted-foreground italic">
          Select activities above to log details ↑
        </p>
      )}
    </div>
  );
}
