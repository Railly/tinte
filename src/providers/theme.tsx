"use client";

import React from "react";
import { usePersistentTheme } from "@/hooks/use-persistent-theme";
import { useTheme as useOriginalTheme } from "@/hooks/use-theme";

type ThemeContextValue = ReturnType<typeof usePersistentTheme>;

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useThemeContext(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeValue = usePersistentTheme();

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}
