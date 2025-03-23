import { ClerkProvider } from "@clerk/nextjs";
import { ClientProviders } from "./client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ClientProviders>{children}</ClientProviders>
    </ClerkProvider>
  );
}
