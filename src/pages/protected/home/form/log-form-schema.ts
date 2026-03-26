import {
  CreateDailyLogBodyMood,
  CreateDailyLogBodyAnxietyLevel,
  CreateDailyLogBodySleepSleepQualityRating,
  CreateDailyLogBodyPhysicalActivityItemActivityType,
  CreateDailyLogBodyPhysicalActivityItemIntensity,
  CreateDailyLogBodySocialInteractionsItemSatisfactionLevel,
  CreateDailyLogBodySocialInteractionsItemInteractionType,
  CreateDailyLogBodyStressLevelItemStressLevelType,
  CreateDailyLogBodyStressLevelItemStressSource,
  CreateDailyLogBodySymptomsItemSymptomType,
  CreateDailyLogBodySymptomsItemSymptomSeverity,
} from "@/http/generated/lunajoy-server.schemas";
import z from "zod";

export const logFormSchema = z.object({
  mood: z.enum(CreateDailyLogBodyMood),
  anxietyLevel: z.enum(CreateDailyLogBodyAnxietyLevel),
  sleepHours: z.number().min(0).max(24),
  sleepQuality: z.enum(CreateDailyLogBodySleepSleepQualityRating),
  disturbances: z.string().optional(),
  activities: z
    .array(
      z.object({
        durationInMinutes: z.number(),
        activityType: z.enum(
          CreateDailyLogBodyPhysicalActivityItemActivityType,
        ),
        intensity: z.enum(CreateDailyLogBodyPhysicalActivityItemIntensity),
        satisfactionLevel: z.enum(
          CreateDailyLogBodySocialInteractionsItemSatisfactionLevel,
        ),
      }),
    )
    .optional(),
  social: z
    .array(
      z.object({
        interactionType: z.enum(
          CreateDailyLogBodySocialInteractionsItemInteractionType,
        ),
        satisfactionLevel: z.enum(
          CreateDailyLogBodySocialInteractionsItemSatisfactionLevel,
        ),
        duration: z.number(),
      }),
    )
    .optional(),
  stress: z
    .array(
      z.object({
        stressLevelType: z.enum(
          CreateDailyLogBodyStressLevelItemStressLevelType,
        ),
        stressSource: z.enum(CreateDailyLogBodyStressLevelItemStressSource),
        duration: z.number(),
        situationDescription: z.string().optional(),
      }),
    )
    .optional(),

  symptoms: z
    .array(
      z.object({
        symptomType: z.enum(CreateDailyLogBodySymptomsItemSymptomType),
        symptomSeverity: z.enum(CreateDailyLogBodySymptomsItemSymptomSeverity),
        symptomsDescription: z.string().optional(),
      }),
    )
    .optional(),
});

export type LogFormSchema = z.infer<typeof logFormSchema>;
