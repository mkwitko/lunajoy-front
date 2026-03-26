import AmbientBlobs from "@/components/ambient-blobs";
import HeroSection from "./components/hero-section";
import Greetings from "./components/greetings";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  useGetConsecutiveDays,
  useGetDailyLogsByPeriod,
} from "@/http/generated/daily-log/daily-log";
import Charts from "./components/charts";
import StatsRow from "./components/stats-row";
import { AnimatePresence } from "framer-motion";
import LogFormModal from "./form/log-form-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { startOfWeek, endOfWeek } from "date-fns";
import useAbly from "@/hooks/use-ably";
import { AblyEvents } from "@/@types/ably-events";
import { toast } from "sonner";
import type { GetDailyLogsByPeriod200Item } from "@/http/generated/lunajoy-server.schemas";
import { queryClient } from "@/lib/react-query";

export default function Home() {
  const [developerMode, setDeveloperMode] = useState(false);

  const start = startOfWeek(new Date());
  const end = endOfWeek(new Date());

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: new Date(start.setHours(0, 0, 0, 0)),
    to: new Date(end.setHours(0, 0, 0, 0)), // só a data, hora zerada
  });

  const [showForm, setShowForm] = useState(false);

  const {
    data: dailyLogs,
    isPending,
    queryKey: dailyLogsQueryKey,
    refetch: refetchDailyLogs,
  } = useGetDailyLogsByPeriod({
    startDate: selectedRange?.from?.toISOString() || new Date().toISOString(),
    endDate: selectedRange?.to?.toISOString() || new Date().toISOString(),
  });

  const { data, refetch: refetchConsecutiveDays } = useGetConsecutiveDays();
  const consecutiveDays = data?.consecutiveDays || 0;

  const handleRefetchDailyLogs = () => {
    refetchDailyLogs();
  };

  const handleRefetchConsecutiveDays = () => {
    refetchConsecutiveDays();
  };

  useAbly({
    events: [
      {
        event: AblyEvents.createDailyLog,
      },
    ],
    handleMessageReceived: async (message) => {
      if (message.name === AblyEvents.createDailyLog) {
        const newLog = message.data as GetDailyLogsByPeriod200Item;
        console.log("New log received:", newLog);

        queryClient.setQueriesData(
          { queryKey: dailyLogsQueryKey },
          (oldData: GetDailyLogsByPeriod200Item[] | undefined) => {
            if (!oldData) return [newLog]; // first log
            return [...oldData, newLog]; // append to existing logs
          },
        );
      }
    },
  });

  return (
    <div className="bg-lunajoy p-6 space-y-6">
      <AmbientBlobs />

      <Greetings consecutiveDays={consecutiveDays} />

      <HeroSection
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        setShowForm={setShowForm}
        developerMode={developerMode}
        setDeveloperMode={setDeveloperMode}
        handleRefetchDailyLogs={handleRefetchDailyLogs}
        handleRefetchConsecutiveDays={handleRefetchConsecutiveDays}
      />

      <StatsRow dailyLogs={dailyLogs} isPending={isPending} />
      <Charts
        dailyLogs={dailyLogs}
        isPending={isPending}
        selectedRange={selectedRange}
      />

      <AnimatePresence>
        {showForm && (
          <Dialog open={showForm} onOpenChange={(open) => setShowForm(open)}>
            <DialogContent>
              <LogFormModal
                onSave={() => {
                  setShowForm(false);
                  handleRefetchConsecutiveDays();
                  toast.success("Daily log created successfully!");
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
