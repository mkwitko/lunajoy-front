import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { addDays, isAfter, startOfDay } from "date-fns";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";
import { useCreateDailyLog } from "@/http/generated/daily-log/daily-log";
import { generateRandomLog } from "@/utils/fill-randomly";

export function RandomLogsDialog({
  open,
  onOpenChange,
  refetch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    undefined,
  );

  const { mutateAsync: createDailyLog, isPending } = useCreateDailyLog();

  const handleSubmit = async () => {
    if (!selectedRange?.from || !selectedRange.to) {
      toast.error("Please select a start and end date");
      return;
    }

    const from = startOfDay(selectedRange.from);
    const to = startOfDay(selectedRange.to);

    if (isAfter(from, to)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    const dates: Date[] = [];
    let current = from;
    while (!isAfter(current, to)) {
      dates.push(current);
      current = addDays(current, 1);
    }

    await Promise.all(
      dates.map((date) => {
        const randomLog = generateRandomLog();
        return createDailyLog({
          data: {
            ...randomLog,
            date: date.toISOString(),
          },
        }).catch(() => {
          // ignora erros (ex: log já existente) e continua
        });
      }),
    );

    await refetch();
    onOpenChange(false);
    setSelectedRange(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-fit p-4">
        <DialogHeader>
          <DialogTitle>Generate Random Logs</DialogTitle>
        </DialogHeader>

        <div className="mt-4 w-fit">
          <p className="text-sm text-muted-foreground mb-2">
            Select a date range for random logs:
          </p>
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
            numberOfMonths={2}
            className="rounded-2xl"
            disabled={{ after: new Date() }}
          />
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isSubmitting={isPending}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
