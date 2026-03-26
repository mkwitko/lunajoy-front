import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-lunajoy rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg min-h-[80px] cursor-default"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: `color-mix(in oklch, ${color} 20%, transparent)`,
              }}
            >
              <Icon className="w-6 h-6" style={{ color }} />
            </div>

            <div className="flex flex-col justify-center flex-1 overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {label}
              </p>
              <p className="text-lg md:text-xl font-bold text-foreground truncate capitalize">
                {value}
              </p>
              {sub && (
                <p className="text-xs text-muted-foreground truncate">{sub}</p>
              )}
            </div>
          </motion.div>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          className="capitalize font-medium tracking-wide"
        >
          {value}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
