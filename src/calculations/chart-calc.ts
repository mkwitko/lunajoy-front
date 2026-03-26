import type { GetDailyLogsByPeriod200Item } from "@/http/generated/lunajoy-server.schemas";
import { eachDayOfInterval, format, startOfDay } from "date-fns";
import {
  moodMap,
  stressMap,
  anxietyMap,
} from "@/mappings/calculations-mapping";
import type { DateRange } from "react-day-picker";

export const calculateAnalytics = (
  logs?: (GetDailyLogsByPeriod200Item | null)[],
  selectedRange?: DateRange,
) => {
  const cleanLogs = (logs || []).filter(
    Boolean,
  ) as GetDailyLogsByPeriod200Item[];

  const from = selectedRange?.from ?? new Date();
  const to = selectedRange?.to ?? selectedRange?.from ?? new Date();

  // Gera todos os dias do range
  const allDays = eachDayOfInterval({
    start: startOfDay(from),
    end: startOfDay(to),
  });

  // Mapeia logs por data
  const logsByDate = new Map(
    cleanLogs.map((log) => [format(new Date(log!.date), "yyyy-MM-dd"), log]),
  );

  const chartData = allDays.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const log = logsByDate.get(key);

    return {
      day: format(day, "dd/MM"),
      mood: log?.moodRating ? moodMap[log.moodRating.mood] : 0,
      sleep: log?.sleepPattern?.sleepDurationInHours ?? 0,
      stress: log?.stressLevel ? stressMap[log.stressLevel.stressLevelType] : 0,
      anxiety: log?.anxietyLevel
        ? anxietyMap[log.anxietyLevel.anxietyLevelCalculated]
        : 0,
      active:
        log?.physicalActivity?.reduce(
          (sum, act) => sum + act.durationInMinutes,
          0,
        ) ?? 0,
      social:
        log?.socialInteraction?.reduce((sum, soc) => sum + soc.duration, 0) ??
        0,
    };
  });

  return { chartData };
};
