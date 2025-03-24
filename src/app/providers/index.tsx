import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { ClientProviders } from "./client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={100}>
      <ClerkProvider>
        <ClientProviders>{children}</ClientProviders>
      </ClerkProvider>
    </TooltipProvider>
  );
}
