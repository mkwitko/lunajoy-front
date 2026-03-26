import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export default function Greetings({
  consecutiveDays,
}: {
  consecutiveDays: number;
}) {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const isMilestone = [3, 7, 30, 100].includes(consecutiveDays);
  const consecutiveDaysText = `${consecutiveDays} day${consecutiveDays !== 1 ? "s" : ""} streak`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">
            {greeting()} ✦
          </p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Your Wellness
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Week at a glance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={isMilestone ? "destructive" : "secondary"}
            className="rounded-xl gap-1 text-xs"
          >
            <Flame className="w-3 h-3 text-primary" />
            {consecutiveDaysText}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
