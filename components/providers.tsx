"use client";
import { ThemeProvider } from "next-themes";
import { TRPCProvider } from "@/trpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCProvider>{children}</TRPCProvider>
    </ThemeProvider>
  );
} 