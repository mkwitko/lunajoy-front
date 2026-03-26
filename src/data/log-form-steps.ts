import type { LogFormSchema } from "@/pages/protected/home/form/log-form-schema";

type FormField = keyof LogFormSchema;

export const steps: { id: string; fields: FormField[] }[] = [
  { id: "mood", fields: ["mood"] },
  { id: "anxiety", fields: ["anxietyLevel"] },
  { id: "sleep", fields: ["sleepHours", "sleepQuality"] },
  {
    id: "activities",
    fields: [],
  },
  {
    id: "social",
    fields: [],
  },
  {
    id: "stress",
    fields: [],
  },
  {
    id: "symptoms",
    fields: [],
  },
];
