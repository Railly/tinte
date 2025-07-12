"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/lib/db/schema";

interface ThemeState {
  // Selected theme for preview
  selectedTheme: Theme | null;
  
  // Search preferences (only thing we persist)
  useUpstashSearch: boolean;

  // Actions
  setSelectedTheme: (theme: Theme | null) => void;
  setUseUpstashSearch: (useUpstash: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Initial state
      selectedTheme: null,
      useUpstashSearch: true,

      // Actions
      setSelectedTheme: (theme) => set({ selectedTheme: theme }),
      setUseUpstashSearch: (useUpstash) => set({ useUpstashSearch: useUpstash }),
    }),
    {
      name: "theme-store",
      // Only persist search preference
      partialize: (state) => ({
        useUpstashSearch: state.useUpstashSearch,
      }),
    }
  )
);

// Simple selectors for backward compatibility
export const useThemeSelectors = () => {
  return {
    isFormOpen: false,
    currentFormTheme: null,
    hasUnsavedChanges: false,
  };
};
