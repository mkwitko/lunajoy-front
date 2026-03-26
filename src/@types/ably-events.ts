export const AblyEvents = {
  createDailyLog: "createDailyLog",
} as const;

export type AblyEvents = keyof typeof AblyEvents;
