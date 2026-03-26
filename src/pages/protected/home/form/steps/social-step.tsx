import { AnimatePresence, motion } from "framer-motion";
import { OptionChip } from "../components/option-chip";
import { StepHeader } from "../components/step-header";
import { Stepper } from "../components/stepper";
import { useFormContext } from "react-hook-form";
import type {
  CreateDailyLogBodySocialInteractionsItemInteractionType,
  CreateDailyLogBodySocialInteractionsItemSatisfactionLevel,
} from "@/http/generated/lunajoy-server.schemas";
import type { LogFormSchema } from "../log-form-schema";

type SatisfactionOptions = {
  value: CreateDailyLogBodySocialInteractionsItemSatisfactionLevel;
  label: string;
  emoji: string;
};

type SocialOptions = {
  value: CreateDailyLogBodySocialInteractionsItemInteractionType;
  label: string;
  emoji: string;
};

const SATISFACTION: SatisfactionOptions[] = [
  { value: "VERY_DISSATISFIED", label: "Very Bad", emoji: "😞" },
  { value: "DISSATISFIED", label: "Bad", emoji: "😕" },
  { value: "NEUTRAL", label: "Ok", emoji: "😐" },
  { value: "SATISFIED", label: "Good", emoji: "🙂" },
  { value: "VERY_SATISFIED", label: "Great", emoji: "😄" },
];

const SOCIAL_TYPES: SocialOptions[] = [
  { value: "FAMILY", label: "Family", emoji: "🏠" },
  { value: "FRIENDS", label: "Friends", emoji: "👯" },
  { value: "COLLEAGUES", label: "Colleagues", emoji: "💼" },
  { value: "STRANGERS", label: "Strangers", emoji: "🌍" },
  { value: "WORK", label: "Work", emoji: "🏢" },
  { value: "OTHER", label: "Other", emoji: "💬" },
];

export function SocialStep() {
  const { watch, setValue } = useFormContext<LogFormSchema>();

  const interactions = watch("social") || [];

  const toggle = (
    interactionType: CreateDailyLogBodySocialInteractionsItemInteractionType,
  ) => {
    const exists = interactions.find(
      (i) => i.interactionType === interactionType,
    );

    if (exists) {
      setValue(
        "social",
        interactions.filter((i) => i.interactionType !== interactionType),
        { shouldValidate: true },
      );
    } else {
      setValue(
        "social",
        [
          ...interactions,
          {
            interactionType,
            duration: 30,
            satisfactionLevel: "NEUTRAL",
          },
        ],
        { shouldValidate: true },
      );
    }
  };

  const update = (
    interactionType: string,
    field: "duration" | "satisfactionLevel",
    value: any,
  ) => {
    setValue(
      "social",
      interactions.map((i) =>
        i.interactionType === interactionType ? { ...i, [field]: value } : i,
      ),
      { shouldValidate: true },
    );
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon="👥"
        title="Social interactions"
        subtitle="Connection is medicine too."
      />

      <div className="grid grid-cols-6 gap-4">
        {SOCIAL_TYPES.map((o) => (
          <OptionChip
            key={o.value}
            option={o}
            size="sm"
            selected={interactions.some((i) => i.interactionType === o.value)}
            onSelect={() => toggle(o.value)}
          />
        ))}
      </div>

      <AnimatePresence>
        {interactions.map((interaction) => {
          const label = SOCIAL_TYPES.find(
            (t) => t.value === interaction.interactionType,
          )?.label;

          return (
            <motion.div
              key={interaction.interactionType as string}
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
              className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3"
            >
              <p className="font-medium text-sm">{label}</p>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Duration</p>
                <Stepper
                  value={interaction.duration}
                  onChange={(v) =>
                    update(interaction.interactionType, "duration", v)
                  }
                  min={5}
                  max={480}
                  step={15}
                  unit="min"
                />
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  How was it?
                </p>
                <div className="grid grid-cols-5 gap-4">
                  {SATISFACTION.map((s) => (
                    <OptionChip
                      key={s.value}
                      option={s}
                      size="sm"
                      selected={interaction.satisfactionLevel === s.value}
                      onSelect={() =>
                        update(
                          interaction.interactionType,
                          "satisfactionLevel",
                          s.value,
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
