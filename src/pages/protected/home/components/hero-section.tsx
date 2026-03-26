import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { CalendarDays, Plus } from "lucide-react";
import {
  format,
  isToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { env } from "@/env";
import { RandomLogsDialog } from "@/components/random-logs-modal";
import {
  useDeleteAllDailyLog,
  useHasDailyLogToday,
} from "@/http/generated/daily-log/daily-log";

type Preset = "today" | "week" | "month" | null;

export default function HeroSection({
  selectedRange,
  setSelectedRange,
  setShowForm,
  developerMode,
  setDeveloperMode,
  handleRefetchDailyLogs,
  handleRefetchConsecutiveDays,
}: {
  selectedRange: DateRange | undefined;
  setSelectedRange: (range: DateRange | undefined) => void;
  setShowForm: (show: boolean) => void;
  developerMode: boolean;
  setDeveloperMode: (mode: boolean) => void;
  handleRefetchDailyLogs: () => void;
  handleRefetchConsecutiveDays: () => void;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<Preset>("week");
  const [randomLogsDialogOpen, setRandomLogsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const refetch = () => {
    handleRefetchDailyLogs();
    handleRefetchConsecutiveDays();
  };

  const label = (() => {
    if (activePreset === "today") return "Today";
    if (activePreset === "week") return "This week";
    if (activePreset === "month") return "This month";
    const from = selectedRange?.from;
    const to = selectedRange?.to;
    if (from && to && from.getTime() === to.getTime()) {
      return isToday(from) ? "Today" : format(from, "MMM d");
    }
    if (from && to) {
      return `${format(from, "MMM d")} - ${format(to, "MMM d")}`;
    }
    if (from) {
      return isToday(from) ? "Today" : format(from, "MMM d");
    }
    return "Select date";
  })();

  const { data: hasLogToday, refetch: refetchHasLogToday } =
    useHasDailyLogToday();
  const { mutateAsync: deleteAllLogs, isPending: isDeletingAllDailyLogs } =
    useDeleteAllDailyLog();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex items-center gap-2 w-full justify-between"
    >
      {/* Date */}
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-md text-sm p-4 shrink-0"
          >
            <CalendarDays className="w-4 h-4 text-primary" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-3 rounded-md border-border space-y-3"
          align="start"
        >
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={activePreset === "today" ? "secondary" : "ghost"}
              onClick={() => {
                const today = new Date();
                setSelectedRange({
                  from: new Date(today.setHours(0, 0, 0, 0)),
                  to: new Date(today.setHours(0, 0, 0, 0)),
                });
                setActivePreset("today");
                setCalendarOpen(false);
              }}
            >
              Today
            </Button>
            <Button
              size="sm"
              variant={activePreset === "week" ? "secondary" : "ghost"}
              onClick={() => {
                const start = startOfWeek(new Date());
                const end = endOfWeek(new Date());
                setSelectedRange({
                  from: new Date(start.setHours(0, 0, 0, 0)),
                  to: new Date(end.setHours(0, 0, 0, 0)),
                });
                setActivePreset("week");
                setCalendarOpen(false);
              }}
            >
              This week
            </Button>
            <Button
              size="sm"
              variant={activePreset === "month" ? "secondary" : "ghost"}
              onClick={() => {
                const start = startOfMonth(new Date());
                const end = endOfMonth(new Date());
                setSelectedRange({
                  from: new Date(start.setHours(0, 0, 0, 0)),
                  to: new Date(end.setHours(0, 0, 0, 0)),
                });
                setActivePreset("month");
                setCalendarOpen(false);
              }}
            >
              This month
            </Button>
          </div>
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={(range) => {
              setSelectedRange(range);
              setActivePreset(null);
            }}
            numberOfMonths={2}
            className="rounded-2xl"
          />
        </PopoverContent>
      </Popover>

      {/* CTA */}
      <div className="flex items-center gap-2">
        {!developerMode && (
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              disabled={hasLogToday?.hasLog}
              onClick={() => setShowForm(true)}
              className="w-full rounded-md flex items-center justify-center gap-2 font-medium disabled:opacity-50"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>
                {hasLogToday?.hasLog
                  ? "Log already created for today"
                  : "New Log"}
              </span>
            </Button>
          </motion.div>
        )}

        {env.VITE_MODE !== "production" && (
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              variant={developerMode ? "secondary" : "outline"}
              onClick={() => setDeveloperMode(!developerMode)}
              className="flex items-center justify-center gap-1 px-2 text-xs"
            >
              {developerMode ? "Disable Dev Mode" : "Enable Dev Mode"}
            </Button>
          </motion.div>
        )}

        {developerMode && (
          <>
            <RandomLogsDialog
              open={randomLogsDialogOpen}
              onOpenChange={setRandomLogsDialogOpen}
              refetch={() => {
                handleRefetchConsecutiveDays();
                refetchHasLogToday();
              }}
            />

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete all logs?</DialogTitle>
                  <DialogDescription>
                    This will permanently delete all daily logs. This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    isSubmitting={isDeletingAllDailyLogs}
                    onClick={async () => {
                      await deleteAllLogs();
                      refetch();
                      refetchHasLogToday();
                      setDeleteDialogOpen(false);
                    }}
                  >
                    Delete all
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                disabled={isDeletingAllDailyLogs}
                onClick={() => setRandomLogsDialogOpen(true)}
                className="flex items-center justify-center gap-1 px-2 text-xs"
              >
                🌀 Random Logs
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                disabled={isDeletingAllDailyLogs}
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                className="flex items-center justify-center gap-1 px-2 text-xs"
              >
                Delete all logs
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
