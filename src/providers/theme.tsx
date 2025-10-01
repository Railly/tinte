"use client";

import React, { useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useThemeFonts } from "@/hooks/use-theme-fonts";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";

type ThemeContextValue = ReturnType<typeof useTheme>;

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useThemeContext(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeStore = useThemeStore();
  const authStore = useAuthStore();
  const themeValue = useTheme();

  // Preload fonts whenever the current theme changes
  useThemeFonts(themeValue.activeTheme);

  // Handle initialization at provider level to prevent infinite loops
  useEffect(() => {
    if (!themeStore.mounted) {
      themeStore.initialize();
    }
  }, [themeStore.mounted]);

  useEffect(() => {
    if (!authStore.mounted) {
      authStore.initialize();
    }
  }, [authStore.mounted]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}
