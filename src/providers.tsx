import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "./dark-mode-provider";
import { TooltipProvider } from "./components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
