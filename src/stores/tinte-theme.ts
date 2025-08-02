import { create } from "zustand";
import { applyThemeWithTransition } from "@/lib/theme-applier";
import { loadTheme, saveTheme, applyTokensToDOM, ThemeData } from "@/lib/theme-tokens";


interface TinteThemeStore {
  // State
  activeTheme: ThemeData | null;
  mounted: boolean;

  // Actions
  setActiveTheme: (theme: ThemeData, currentMode: "light" | "dark") => void;
  setMounted: (mounted: boolean) => void;
  initializeTheme: (currentMode: "light" | "dark") => void;
}

export const useTinteThemeStore = create<TinteThemeStore>((set, get) => ({
  // Initial state
  activeTheme: null,
  mounted: false,

  // Actions
  setActiveTheme: (theme: ThemeData, currentMode: "light" | "dark") => {
    set({ activeTheme: theme });
    saveTheme(theme);
    
    // Apply theme with transition
    if (typeof window !== "undefined") {
      applyThemeWithTransition(theme, currentMode);
    }
  },

  setMounted: (mounted: boolean) => {
    set({ mounted });
  },

  initializeTheme: (currentMode: "light" | "dark") => {
    const { mounted } = get();
    if (!mounted) return;

    // Load theme from storage
    const storedTheme = loadTheme();
    
    set({ activeTheme: storedTheme });

    // Apply theme tokens directly (initial load)
    const tokens = storedTheme.computedTokens[currentMode];
    applyTokensToDOM(tokens);
  },
}));

