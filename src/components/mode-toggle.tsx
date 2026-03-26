import { Moon, Sun, Laptop } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/dark-mode-provider";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative flex items-center justify-center rounded-full border-border/60 bg-background/60 backdrop-blur-md hover:bg-muted/60 transition-all"
        >
          {/* 🌞 Sun */}
          <motion.div
            initial={false}
            animate={{
              scale: theme === "dark" ? 0 : 1,
              rotate: theme === "dark" ? -90 : 0,
              opacity: theme === "dark" ? 0 : 1,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="size-4" />
          </motion.div>

          {/* 🌙 Moon */}
          <motion.div
            initial={false}
            animate={{
              scale: theme === "dark" ? 1 : 0,
              rotate: theme === "dark" ? 0 : 90,
              opacity: theme === "dark" ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="size-4" />
          </motion.div>

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-40 p-1 rounded-xl border border-border/50 bg-background/70 backdrop-blur-xl shadow-xl"
      >
        <ModeItem
          icon={<Sun className="size-4" />}
          label="Light"
          active={theme === "light"}
          onClick={() => setTheme("light")}
        />

        <ModeItem
          icon={<Moon className="size-4" />}
          label="Dark"
          active={theme === "dark"}
          onClick={() => setTheme("dark")}
        />

        <ModeItem
          icon={<Laptop className="size-4" />}
          label="System"
          active={theme === "system"}
          onClick={() => setTheme("system")}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type ModeItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
};

function ModeItem({ icon, label, active, onClick }: ModeItemProps) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm cursor-pointer"
    >
      {icon}

      <span className="flex-1">{label}</span>

      {/* ✨ active indicator */}
      {active && (
        <motion.div
          layoutId="active-theme"
          className="h-1.5 w-1.5 rounded-full bg-primary"
        />
      )}
    </DropdownMenuItem>
  );
}
