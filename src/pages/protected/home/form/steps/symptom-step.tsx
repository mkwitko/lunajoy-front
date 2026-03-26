import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { OptionChip } from "../components/option-chip";
import { StepHeader } from "../components/step-header";
import { useFormContext } from "react-hook-form";
import type {
  CreateDailyLogBodySymptomsItemSymptomSeverity,
  CreateDailyLogBodySymptomsItemSymptomType,
} from "@/http/generated/lunajoy-server.schemas";
import type { LogFormSchema } from "../log-form-schema";

type SeverityOptions = {
  value: CreateDailyLogBodySymptomsItemSymptomSeverity;
  label: string;
  color: string;
};

type SymptomTypesOptions = {
  value: CreateDailyLogBodySymptomsItemSymptomType;
  label: string;
  emoji: string;
};

const SEVERITY: SeverityOptions[] = [
  { value: "MILD", label: "Mild", color: "text-green-500" },
  { value: "MODERATE", label: "Moderate", color: "text-yellow-500" },
  { value: "SEVERE", label: "Severe", color: "text-red-500" },
];

const SYMPTOM_TYPES: SymptomTypesOptions[] = [
  { value: "SADNESS", label: "Sadness", emoji: "💧" },
  { value: "FATIGUE", label: "Fatigue", emoji: "😴" },
  { value: "IRRITABILITY", label: "Irritability", emoji: "⚡" },
  { value: "LACK_OF_FOCUS", label: "Lack of Focus", emoji: "🌫️" },
  { value: "ANXIETY", label: "Anxiety", emoji: "🌀" },
  { value: "INSOMNIA", label: "Insomnia", emoji: "🌙" },
  { value: "LOSS_OF_INTEREST", label: "Loss of Interest", emoji: "🍂" },
  { value: "RESTLESSNESS", label: "Restlessness", emoji: "🏃" },
];

export function SymptomsStep() {
  const { watch, setValue } = useFormContext<LogFormSchema>();

  const symptoms = watch("symptoms") || [];

  const toggle = (symptomType: CreateDailyLogBodySymptomsItemSymptomType) => {
    const exists = symptoms.find((s) => s.symptomType === symptomType);

    if (exists) {
      setValue(
        "symptoms",
        symptoms.filter((s) => s.symptomType !== symptomType),
        { shouldValidate: true },
      );
    } else {
      setValue(
        "symptoms",
        [
          ...symptoms,
          {
            symptomType,
            symptomSeverity: "MILD",
            symptomsDescription: "",
          },
        ],
        { shouldValidate: true },
      );
    }
  };

  const update = (
    symptomType: string,
    field: "symptomSeverity" | "symptomsDescription",
    value: any,
  ) => {
    setValue(
      "symptoms",
      symptoms.map((s) =>
        s.symptomType === symptomType ? { ...s, [field]: value } : s,
      ),
      { shouldValidate: true },
    );
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon="🌿"
        title="Symptoms check-in"
        subtitle="Select anything you're experiencing today."
      />

      {/* SELECT SYMPTOMS */}
      <div className="grid grid-cols-6 gap-4">
        {SYMPTOM_TYPES.map((o) => (
          <OptionChip
            key={o.value}
            option={o}
            size="sm"
            selected={symptoms.some((s) => s.symptomType === o.value)}
            onSelect={() => toggle(o.value)}
          />
        ))}
      </div>

      {/* DYNAMIC ITEMS */}
      <AnimatePresence>
        {symptoms.map((symptom) => {
          const label = SYMPTOM_TYPES.find(
            (t) => t.value === symptom.symptomType,
          )?.label;

          return (
            <motion.div
              key={symptom.symptomType}
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
              className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3"
            >
              <p className="font-medium text-sm">{label}</p>

              {/* SEVERITY */}
              <div className="flex gap-2">
                {SEVERITY.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() =>
                      update(symptom.symptomType, "symptomSeverity", s.value)
                    }
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                      symptom.symptomSeverity === s.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* DESCRIPTION */}
              <textarea
                value={symptom.symptomsDescription || ""}
                onChange={(e) =>
                  update(
                    symptom.symptomType,
                    "symptomsDescription",
                    e.target.value,
                  )
                }
                placeholder="Brief description..."
                className="w-full bg-card/60 border border-border rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring/50"
                rows={2}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* EMPTY STATE */}
      {symptoms.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 rounded-2xl px-4 py-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>
            No symptoms? That's wonderful! Tap any above if you're experiencing
            something.
          </span>
        </div>
      )}
    </div>
  );
}
