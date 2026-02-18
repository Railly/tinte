"use client";

import { useThemeStore } from "@/stores/theme";

export function useThemeMode() {
  const mode = useThemeStore((state) => state.mode);
  const isDark = useThemeStore((state) => state.isDark);
  const setMode = useThemeStore((state) => state.setMode);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  return {
    mode,
    isDark,
    setMode,
    toggleMode,
    theme: mode,
    setTheme: setMode,
    toggleTheme: toggleMode,
  };
}
