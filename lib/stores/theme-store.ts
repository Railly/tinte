"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/lib/db/schema";

interface ThemeState {
  // Live preview state (memory only - not shareable)
  selectedTheme: Theme | null;

  // UI preferences (persisted)
  viewMode: "grid" | "list";

  // Actions
  setSelectedTheme: (theme: Theme | null) => void;
  setViewMode: (mode: "grid" | "list") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Initial state
      selectedTheme: null,
      viewMode: "grid",

      // Actions
      setSelectedTheme: (theme) => set({ selectedTheme: theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: "tinte-preferences-v1",
      // Only persist user preferences, not ephemeral state
      partialize: (state) => ({
        viewMode: state.viewMode,
      }),
    }
  )
);
