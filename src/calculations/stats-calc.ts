import type { GetDailyLogsByPeriod200Item } from "@/http/generated/lunajoy-server.schemas";
import {
  anxietyMap,
  stressMap,
  moodMap,
  satisfactionMap,
} from "@/mappings/calculations-mapping";

export const buildStats = (logs?: GetDailyLogsByPeriod200Item[]) => {
  console.log("Calculating stats with logs:", logs);
  if (!logs || logs.length === 0) {
    return {
      avgAnxiety: 0,
      symptoms: [],
      avgStressLabel: "Low",
      totalSocial: 0,
      totalActivity: 0,
      avgSleep: 0,
      avgActivitySatisfaction: 0,
      avgMood: 0,
    };
  }

  // Average Anxiety
  const anxieties = logs
    .map((l) => l?.anxietyLevel?.anxietyLevelCalculated)
    .filter(Boolean) as string[];
  const avgAnxiety =
    anxieties.length > 0
      ? anxieties.reduce((sum, a) => sum + anxietyMap[a], 0) / anxieties.length
      : 0;

  // Symptoms presented
  const symptoms = Array.from(
    new Set(
      logs
        .flatMap((l) => l?.symptoms?.map((s) => s.symptomType))
        .filter(Boolean),
    ),
  ).map((s) =>
    s
      ?.toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  );

  // Average Stress
  const stresses = logs
    .map((l) => l?.stressLevel?.stressLevelType)
    .filter(Boolean) as string[];
  const avgStress =
    stresses.length > 0
      ? stresses.reduce((sum, s) => sum + stressMap[s], 0) / stresses.length
      : 0;
  const avgStressLabel =
    avgStress < 1.5
      ? "Low"
      : avgStress < 2.5
        ? "Moderate"
        : avgStress < 3.5
          ? "High"
          : "Extreme";

  // Social interactions
  const totalSocial = logs
    .flatMap((l) => l?.socialInteraction?.map((s) => s.duration) ?? [])
    .reduce((sum, d) => sum + d, 0);

  // Physical activity
  const totalActivity = logs
    .flatMap((l) => l?.physicalActivity?.map((a) => a.durationInMinutes) ?? [])
    .reduce((sum, d) => sum + d, 0);

  // Average activity satisfaction
  const activitySatisfactions = logs
    .flatMap((l) => l?.physicalActivity?.map((a) => a.satisfactionLevel))
    .filter(Boolean) as string[];
  const avgActivitySatisfaction =
    activitySatisfactions.length > 0
      ? activitySatisfactions.reduce(
          (sum, a) => sum + (satisfactionMap[a] || 0),
          0,
        ) / activitySatisfactions.length
      : 0;

  // Average sleep hours
  const sleeps = logs
    .map((l) => l?.sleepPattern?.sleepDurationInHours)
    .filter((s): s is number => s !== undefined);
  const avgSleep =
    sleeps.length > 0
      ? sleeps.reduce((sum, s) => sum + s, 0) / sleeps.length
      : 0;

  // Average mood
  const moods = logs
    .map((l) => l?.moodRating?.mood)
    .filter(Boolean) as string[];
  const avgMood =
    moods.length > 0
      ? moods.reduce((sum, m) => sum + moodMap[m], 0) / moods.length
      : 0;

  return {
    avgAnxiety,
    symptoms,
    avgStressLabel,
    totalSocial,
    totalActivity,
    avgSleep,
    avgActivitySatisfaction,
    avgMood,
  };
};
