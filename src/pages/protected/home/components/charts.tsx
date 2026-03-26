import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import type { GetDailyLogsByPeriod200Item } from "@/http/generated/lunajoy-server.schemas";
import { ChartTooltip } from "./chart-tooltip";
import { useState } from "react";
import { calculateAnalytics } from "@/calculations/chart-calc";
import type { DateRange } from "react-day-picker";

const CHART_OPTIONS = [
  { key: "mood", label: "Mood", color: "var(--chart-1)" },
  { key: "sleep", label: "Sleep", color: "var(--chart-3)" },
  { key: "stress", label: "Stress", color: "var(--chart-2)" },
  { key: "anxiety", label: "Anxiety", color: "var(--chart-5)" },
  { key: "active", label: "Activity", color: "var(--chart-4)" },
  { key: "social", label: "Social", color: "var(--chart-3)" },
];

export default function Charts({
  dailyLogs,
  isPending,
  selectedRange,
}: {
  dailyLogs?: (GetDailyLogsByPeriod200Item | null)[];
  isPending: boolean;
  selectedRange: DateRange | undefined;
}) {
  const [activeChart, setActiveChart] = useState("mood");
  const activeOption = CHART_OPTIONS.find((opt) => opt.key === activeChart);

  if (isPending) {
    return (
      <div className="bg-lunajoy p-5 rounded-3xl animate-pulse h-[200px]" />
    );
  }

  const { chartData } = calculateAnalytics(dailyLogs, selectedRange);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-lunajoy p-5 rounded-3xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Weekly Trends
          </h3>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CHART_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setActiveChart(opt.key)}
              className={cn(
                "px-2.5 py-1 rounded-xl text-xs font-medium transition-all",
                activeChart === opt.key
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={activeOption?.color}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={activeOption?.color}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.85 0.01 300 / 0.4)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "oklch(0.55 0.03 280)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.55 0.03 280)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{
                  stroke: "oklch(0.65 0.12 320 / 0.3)",
                  strokeWidth: 1.5,
                }}
              />
              <Area
                type="monotone"
                dataKey={activeChart}
                stroke={activeOption?.color}
                strokeWidth={2.5}
                fill="url(#areaGradient)"
                dot={{ fill: activeOption?.color, r: 3.5, strokeWidth: 0 }}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "var(--background)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
