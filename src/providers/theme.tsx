"use client";

import { useTheme } from "@/hooks/use-theme";

export function useThemeContext() {
  return useTheme();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
