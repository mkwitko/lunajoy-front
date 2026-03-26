import {
  CreateDailyLogBodyMood,
  CreateDailyLogBodyAnxietyLevel,
  CreateDailyLogBodySleepSleepQualityRating,
  CreateDailyLogBodyPhysicalActivityItemActivityType,
  CreateDailyLogBodyPhysicalActivityItemIntensity,
  CreateDailyLogBodySocialInteractionsItemInteractionType,
  CreateDailyLogBodySocialInteractionsItemSatisfactionLevel,
  CreateDailyLogBodyStressLevelItemStressLevelType,
  CreateDailyLogBodyStressLevelItemStressSource,
  CreateDailyLogBodySymptomsItemSymptomType,
  CreateDailyLogBodySymptomsItemSymptomSeverity,
} from "@/http/generated/lunajoy-server.schemas";

const randomItem = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function generateRandomLog() {
  return {
    mood: randomItem(Object.values(CreateDailyLogBodyMood)),
    anxietyLevel: randomItem(Object.values(CreateDailyLogBodyAnxietyLevel)),
    physicalActivity: [
      {
        durationInMinutes: randomNumber(10, 90),
        activityType: randomItem(
          Object.values(CreateDailyLogBodyPhysicalActivityItemActivityType),
        ),
        intensity: randomItem(
          Object.values(CreateDailyLogBodyPhysicalActivityItemIntensity),
        ),
        satisfactionLevel: randomItem(
          Object.values(
            CreateDailyLogBodySocialInteractionsItemSatisfactionLevel,
          ),
        ),
      },
    ],
    sleep: {
      sleepDurationInHours: randomNumber(4, 10),
      sleepQualityRating: randomItem(
        Object.values(CreateDailyLogBodySleepSleepQualityRating),
      ),
      disturbances: Math.random() > 0.5 ? "Woke up once" : "",
    },
    socialInteractions: [
      {
        interactionType: randomItem(
          Object.values(
            CreateDailyLogBodySocialInteractionsItemInteractionType,
          ),
        ),
        satisfactionLevel: randomItem(
          Object.values(
            CreateDailyLogBodySocialInteractionsItemSatisfactionLevel,
          ),
        ),
        duration: randomNumber(5, 120),
      },
    ],
    stressLevel: [
      {
        stressLevelType: randomItem(
          Object.values(CreateDailyLogBodyStressLevelItemStressLevelType),
        ),
        stressSource: randomItem(
          Object.values(CreateDailyLogBodyStressLevelItemStressSource),
        ),
        duration: randomNumber(5, 120),
        situationDescription: Math.random() > 0.5 ? "Tough meeting" : "",
      },
    ],
    symptoms: [
      {
        symptomType: randomItem(
          Object.values(CreateDailyLogBodySymptomsItemSymptomType),
        ),
        symptomSeverity: randomItem(
          Object.values(CreateDailyLogBodySymptomsItemSymptomSeverity),
        ),
        symptomsDescription: Math.random() > 0.5 ? "Mild headache" : "",
      },
    ],
  };
}
