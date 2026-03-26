import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function OptionChip<T>({
  option,
  selected,
  onSelect,
  size = "md",
}: {
  option: { value: string; label: string; emoji?: string };
  selected: boolean;
  onSelect: (value: T) => void;
  size?: "sm" | "md";
}) {
  const isMd = size === "md";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.96 }}
      animate={{
        scale: selected ? 1.04 : 1,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onClick={() => onSelect(option.value)}
      className={cn(
        "relative flex flex-col items-center justify-center text-center rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden",

        // 📐 tamanho fixo (ESSENCIAL)
        isMd ? "w-[110px] h-[110px] text-sm" : "w-[90px] h-[90px] text-xs",

        // 🎨 estado
        selected
          ? "border-primary text-primary bg-primary/10 shadow-md shadow-primary/20"
          : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:bg-accent/40",
      )}
    >
      {/* glow background */}
      {selected && (
        <motion.div
          layoutId="chip-glow"
          className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl"
        />
      )}

      {/* emoji */}
      {option.emoji && (
        <motion.span
          animate={{ scale: selected ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={cn(isMd ? "text-2xl" : "text-xl")}
        >
          {option.emoji}
        </motion.span>
      )}

      {/* label */}
      <span className="font-medium leading-tight px-1">{option.label}</span>

      {/* selected ring */}
      {selected && (
        <motion.div
          layoutId="chip-ring"
          className="absolute inset-0 rounded-2xl ring-2 ring-primary/40"
        />
      )}
    </motion.button>
  );
}
