"use client";

import type { ThemeData } from "@/lib/theme";
import { useThemeStore } from "@/stores/theme";

export function useActiveTheme() {
  const mounted = useThemeStore((state) => state.mounted);
  const activeTheme = useThemeStore((state) => state.activeTheme);
  const tinteTheme = useThemeStore((state) => state.tinteTheme);
  const unsavedChanges = useThemeStore((state) => state.unsavedChanges);
  const selectTheme = useThemeStore((state) => state.selectTheme);
  const updateTinteTheme = useThemeStore((state) => state.updateTinteTheme);
  const markAsSaved = useThemeStore((state) => state.markAsSaved);
  const initialize = useThemeStore((state) => state.initialize);

  return {
    mounted,
    activeTheme,
    tinteTheme,
    unsavedChanges,
    selectTheme,
    updateTinteTheme,
    markAsSaved,
    initialize,
  };
}

export type { ThemeData };
