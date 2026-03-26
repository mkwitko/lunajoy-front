import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { MoodStep } from "./steps/mood-step";
import { Button } from "@/components/ui/button";
import { AnxietyStep } from "./steps/anxiety-step";
import { SleepStep } from "./steps/sleep-step";
import { ActivityStep } from "./steps/activity-step";
import { SocialStep } from "./steps/social-step";
import { StressStep } from "./steps/stress-step";
import { SymptomsStep } from "./steps/symptom-step";
import { useCreateDailyLog } from "@/http/generated/daily-log/daily-log";
import { toast } from "sonner";
import { logFormSchema, type LogFormSchema } from "./log-form-schema";
import { steps } from "@/data/log-form-steps";

export default function LogFormModal({ onSave }: { onSave: () => void }) {
  const [step, setStep] = useState(0);

  const methods = useForm({
    resolver: zodResolver(logFormSchema),
    mode: "onChange",
  });

  const { handleSubmit, trigger, watch, formState } = methods;

  const { mutateAsync: createDailyLog, isPending } = useCreateDailyLog({
    mutation: {
      onSuccess: async () => {
        onSave();
      },
      onError: (error: any) => {
        toast.error(`Failed to create daily log: ${error.message}`);
      },
    },
  });

  const onSubmit = async (data: LogFormSchema) => {
    await createDailyLog({
      data: {
        mood: data.mood,
        anxietyLevel: data.anxietyLevel,
        physicalActivity:
          data.activities?.map((activity) => {
            return {
              durationInMinutes: activity.durationInMinutes,
              activityType: activity.activityType,
              intensity: activity.intensity,
              satisfactionLevel: activity.satisfactionLevel,
            };
          }) || [],
        sleep: {
          sleepDurationInHours: data.sleepHours,
          sleepQualityRating: data.sleepQuality,
          disturbances: data.disturbances,
        },
        socialInteractions:
          data.social?.map((interaction) => {
            return {
              interactionType: interaction.interactionType,
              satisfactionLevel: interaction.satisfactionLevel,
              duration: interaction.duration,
            };
          }) || [],
        stressLevel:
          data.stress?.map((stress) => {
            return {
              stressLevelType: stress.stressLevelType,
              stressSource: stress.stressSource,
              duration: stress.duration,
              situationDescription: stress.situationDescription,
            };
          }) || [],
        symptoms:
          data?.symptoms?.map((symptom) => {
            return {
              symptomType: symptom.symptomType,
              symptomSeverity: symptom.symptomSeverity,
              symptomsDescription: symptom.symptomsDescription || "",
            };
          }) || [],
      },
    });
  };

  const currentFields = steps[step].fields;

  // valores atuais do step
  const values = watch(currentFields);

  // erros do step
  const hasErrors = currentFields.some((field) => formState.errors[field]);

  // campos vazios (importante pro enum)
  const hasEmpty = values.some((value) => !value);

  // botão desabilitado
  const isStepInvalid = hasErrors || hasEmpty;

  const nextStep = async () => {
    console.log(watch());
    const valid = await trigger(steps[step].fields);
    if (valid) setStep((s) => s + 1);
  };

  const isLast = step === steps.length - 1;

  return (
    <FormProvider {...methods}>
      <div className="p-6 space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {step === 0 && <MoodStep />}
            {step === 1 && <AnxietyStep />}
            {step === 2 && <SleepStep />}
            {step === 3 && <ActivityStep />}
            {step === 4 && <SocialStep />}
            {step === 5 && <StressStep />}
            {step === 6 && <SymptomsStep />}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>

          <Button
            disabled={isStepInvalid}
            isSubmitting={isPending}
            className="px-4 py-2 disabled:opacity-50"
            onClick={() => {
              console.log("Current values:", values);
              console.log("Current errors:", formState.errors);
              console.log({ hasErrors });
              isLast ? handleSubmit(onSubmit)() : nextStep();
            }}
          >
            {isLast ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
