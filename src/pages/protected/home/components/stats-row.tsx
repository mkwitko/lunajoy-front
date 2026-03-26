import { motion } from "framer-motion";
import {
  Heart,
  Moon,
  Brain,
  Activity,
  Users,
  AlertCircle,
  Smile,
} from "lucide-react";
import type { GetDailyLogsByPeriod200Item } from "@/http/generated/lunajoy-server.schemas";
import { StatCard } from "./stat-card";
import { buildStats } from "@/calculations/stats-calc";

export default function StatsRow({
  dailyLogs,
  isPending,
}: {
  dailyLogs: GetDailyLogsByPeriod200Item[] | undefined;
  isPending: boolean;
}) {
  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  if (isPending) {
    // Skeleton cards (matching StatCard layout)
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  const stats = buildStats(dailyLogs);

  const cards = [
    {
      label: "Anxiety Level",
      value: `${stats.avgAnxiety.toFixed(1)}/5`,
      sub: "Average",
      icon: Brain,
      color: chartColors[0],
    },
    {
      label: "Symptoms Presented",
      value: stats.symptoms.join(", ") || "None",
      sub: "Total",
      icon: AlertCircle,
      color: chartColors[1],
    },
    {
      label: "Stress Level",
      value: stats.avgStressLabel,
      sub: "Average",
      icon: Brain,
      color: chartColors[2],
    },
    {
      label: "Social Interactions",
      value: `${stats.totalSocial} min`,
      sub: "Total",
      icon: Users,
      color: chartColors[3],
    },
    {
      label: "Physical Activities",
      value: `${stats.totalActivity} min`,
      sub: "Total",
      icon: Activity,
      color: chartColors[4],
    },
    {
      label: "Average Sleep",
      value: `${stats.avgSleep.toFixed(1)}h`,
      sub: "Daily average",
      icon: Moon,
      color: chartColors[0],
    },
    {
      label: "Activity Satisfaction",
      value: `${stats.avgActivitySatisfaction.toFixed(1)}/5`,
      sub: "Total average",
      icon: Heart,
      color: chartColors[1],
    },
    {
      label: "Average Mood",
      value: `${stats.avgMood.toFixed(1)}/5`,
      sub: "Total average",
      icon: Smile,
      color: chartColors[2],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </motion.div>
  );
}
