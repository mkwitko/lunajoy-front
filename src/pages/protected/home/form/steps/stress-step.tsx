import { useFormContext } from "react-hook-form";
import { OptionChip } from "../components/option-chip";
import { StepHeader } from "../components/step-header";
import { Stepper } from "../components/stepper";

import { AnimatePresence, motion } from "framer-motion";
import type {
  CreateDailyLogBodyStressLevelItemStressLevelType,
  CreateDailyLogBodyStressLevelItemStressSource,
} from "@/http/generated/lunajoy-server.schemas";
import type { LogFormSchema } from "../log-form-schema";

type StressSourcesOptions = {
  value: CreateDailyLogBodyStressLevelItemStressSource;
  label: string;
  emoji: string;
};

type StressLevelOptions = {
  value: CreateDailyLogBodyStressLevelItemStressLevelType;
  label: string;
  emoji: string;
};

const STRESS_SOURCES: StressSourcesOptions[] = [
  { value: "WORK", label: "Work", emoji: "💼" },
  { value: "FAMILY", label: "Family", emoji: "🏠" },
  { value: "HEALTH", label: "Health", emoji: "❤️" },
  { value: "FINANCES", label: "Finances", emoji: "💰" },
  { value: "RELATIONSHIPS", label: "Relationships", emoji: "🤝" },
  { value: "OTHER", label: "Other", emoji: "🌀" },
];

const STRESS_LEVELS: StressLevelOptions[] = [
  { value: "LOW", label: "Low", emoji: "🌿" },
  { value: "MODERATE", label: "Moderate", emoji: "⚡" },
  { value: "HIGH", label: "High", emoji: "🔥" },
  { value: "EXTREME", label: "Extreme", emoji: "🌊" },
];

export function StressStep() {
  const { watch, setValue } = useFormContext<LogFormSchema>();

  const stressList = watch("stress") || [];

  const toggle = (
    stressSource: CreateDailyLogBodyStressLevelItemStressSource,
  ) => {
    const exists = stressList.find((s) => s.stressSource === stressSource);

    if (exists) {
      setValue(
        "stress",
        stressList.filter((s) => s.stressSource !== stressSource),
        { shouldValidate: true },
      );
    } else {
      setValue(
        "stress",
        [
          ...stressList,
          {
            stressSource,
            stressLevelType: "MODERATE",
            duration: 30,
            situationDescription: "",
          },
        ],
        { shouldValidate: true },
      );
    }
  };

  const update = (
    stressSource: CreateDailyLogBodyStressLevelItemStressSource,
    field: "stressLevelType" | "duration" | "situationDescription",
    value: any,
  ) => {
    setValue(
      "stress",
      stressList.map((s) =>
        s.stressSource === stressSource ? { ...s, [field]: value } : s,
      ),
      { shouldValidate: true },
    );
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon="🧠"
        title="Stress levels"
        subtitle="Acknowledging stress is the first step."
      />

      {/* SOURCE SELECTOR */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">
          What caused stress?
        </p>
        <div className="grid grid-cols-6 gap-4">
          {STRESS_SOURCES.map((o) => (
            <OptionChip
              key={o.value}
              option={o}
              size="sm"
              selected={stressList.some((s) => s.stressSource === o.value)}
              onSelect={() => toggle(o.value)}
            />
          ))}
        </div>
      </div>

      {/* DYNAMIC ITEMS */}
      <AnimatePresence>
        {stressList.map((stress) => {
          const label = STRESS_SOURCES.find(
            (s) => s.value === stress.stressSource,
          )?.label;

          return (
            <motion.div
              key={stress.stressSource}
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
              className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3"
            >
              <p className="font-medium text-sm">{label}</p>

              {/* LEVEL */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  How intense?
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {STRESS_LEVELS.map((lvl) => (
                    <OptionChip
                      key={lvl.value}
                      option={lvl}
                      size="sm"
                      selected={stress.stressLevelType === lvl.value}
                      onSelect={() =>
                        update(
                          stress.stressSource,
                          "stressLevelType",
                          lvl.value,
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              {/* DURATION */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Duration</p>
                <Stepper
                  value={stress.duration}
                  onChange={(v) => update(stress.stressSource, "duration", v)}
                  min={0}
                  max={1440}
                  step={15}
                  unit="min"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Describe (optional)
                </p>
                <textarea
                  value={stress.situationDescription || ""}
                  onChange={(e) =>
                    update(
                      stress.stressSource,
                      "situationDescription",
                      e.target.value,
                    )
                  }
                  placeholder="What happened? How did you cope?"
                  className="w-full bg-muted/30 border border-border rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50"
                  rows={3}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
