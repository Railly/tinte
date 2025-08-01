import { create } from "zustand";
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ThemeData as AppThemeData, applyThemeWithTransition, applyThemeModeChange } from "@/lib/theme-applier";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { extractTinteThemeData, DEFAULT_THEME } from "@/utils/tinte-presets";

// Local storage key for theme persistence
const THEME_STORAGE_KEY = "tinte-selected-theme";

// Enhanced storage with pre-computed tokens
interface StoredThemeData extends AppThemeData {
  computedTokens?: {
    light: any;
    dark: any;
  };
}

// Helper functions for localStorage with pre-computed tokens
function saveThemeToStorage(theme: AppThemeData) {
  if (typeof window === "undefined") return;
  try {
    // Pre-compute both light and dark tokens for instant application
    const computedTokens = {
      light: computeTokensForMode(theme, "light"),
      dark: computeTokensForMode(theme, "dark"),
    };

    const enhancedTheme: StoredThemeData = {
      ...theme,
      computedTokens,
    };

    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(enhancedTheme));
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
}

function loadThemeFromStorage(): StoredThemeData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("Failed to load theme from localStorage:", error);
    return null;
  }
}

// Pre-compute tokens for a specific mode
function computeTokensForMode(themeData: AppThemeData, mode: "light" | "dark") {
  if (themeData.author === "tweakcn" && themeData.rawTheme) {
    return themeData.rawTheme[mode];
  } else if (themeData.rawTheme) {
    try {
      const { providerRegistry } = require("@/lib/providers");
      const shadcnTheme = providerRegistry.convert(
        "shadcn",
        themeData.rawTheme
      );
      return shadcnTheme[mode];
    } catch (error) {
      console.warn("Failed to transform theme during pre-computation:", error);
      return generateBasicTokens(themeData, mode);
    }
  } else {
    return generateBasicTokens(themeData, mode);
  }
}

// Generate basic tokens without DOM manipulation
function generateBasicTokens(themeData: AppThemeData, mode: "light" | "dark") {
  const { colors } = themeData;
  const isDark = mode === "dark";

  return {
    background: colors.background,
    foreground: colors.foreground,
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    card: colors.background,
    "card-foreground": colors.foreground,
    popover: colors.background,
    "popover-foreground": colors.foreground,
    "primary-foreground": colors.background,
    "secondary-foreground": colors.foreground,
    "accent-foreground": colors.foreground,
    muted: isDark
      ? adjustBrightness(colors.background, 10)
      : adjustBrightness(colors.background, -3),
    "muted-foreground": isDark
      ? adjustBrightness(colors.foreground, -20)
      : adjustBrightness(colors.foreground, 20),
    border: isDark
      ? adjustOpacity(colors.foreground, 0.2)
      : adjustBrightness(colors.background, -15),
    input: isDark
      ? adjustOpacity(colors.foreground, 0.15)
      : adjustBrightness(colors.background, -15),
  };
}

// Helper functions for color manipulation
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

function adjustOpacity(color: string, opacity: number): string {
  return `${color}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

interface TinteThemeStore {
  // State
  activeTheme: AppThemeData | null;
  mounted: boolean;

  // Actions
  setActiveTheme: (theme: AppThemeData) => void;
  setMounted: (mounted: boolean) => void;
  initializeTheme: (isDark: boolean) => void;
  applyCurrentTheme: (isDark: boolean) => void;
}

export const useTinteThemeStore = create<TinteThemeStore>((set, get) => ({
  // Initial state - load theme immediately from localStorage
  activeTheme:
    typeof window !== "undefined"
      ? loadThemeFromStorage() || DEFAULT_THEME
      : null,
  mounted: false,

  // Actions
  setActiveTheme: (theme: AppThemeData) => {
    set({ activeTheme: theme });
    // Persist to localStorage whenever theme changes
    saveThemeToStorage(theme);
  },

  setMounted: (mounted: boolean) => {
    set({ mounted });
  },

  initializeTheme: (isDark: boolean) => {
    const { activeTheme, mounted } = get();

    // Apply immediately if we have a theme (from initial state) - NO TRANSITIONS
    if (activeTheme && mounted) {
      applyThemeDirectly(activeTheme, isDark ? "dark" : "light");
      return;
    }

    // Fallback only if no theme exists
    if (!activeTheme && mounted) {
      const themeToUse = DEFAULT_THEME;
      set({ activeTheme: themeToUse });
      applyThemeDirectly(themeToUse, isDark ? "dark" : "light");
    }
  },

  applyCurrentTheme: (isDark: boolean) => {
    const { activeTheme } = get();
    // Only apply if we have an active theme (don't create one) - NO TRANSITIONS for mode changes
    if (activeTheme) {
      applyThemeDirectly(activeTheme, isDark ? "dark" : "light");
    }
  },
}));

// Direct theme application without transitions
function applyThemeDirectly(themeData: StoredThemeData, mode: "light" | "dark") {
  if (typeof window === "undefined") return;

  const tokensToApply = themeData.computedTokens?.[mode] || computeTokensForMode(themeData, mode);
  
  const root = document.documentElement;
  Object.entries(tokensToApply).forEach(([key, value]) => {
    if (typeof value === "string" && 
        !key.startsWith("font-") && 
        !key.startsWith("shadow-") &&
        key !== "radius" && 
        key !== "spacing" && 
        key !== "letter-spacing") {
      root.style.setProperty(`--${key}`, value);
    }
  });
}

// Hook for theme management with Next.js theme integration
export function useTinteTheme() {
  const { theme } = useTheme();
  const [localMounted, setLocalMounted] = useState(false);
  const [themesReady, setThemesReady] = useState(false);

  const {
    activeTheme,
    setMounted,
    setActiveTheme,
  } = useTinteThemeStore();

  // Mount only once - theme is already applied by TinteThemeScript
  useEffect(() => {
    if (!localMounted) {
      setLocalMounted(true);
      setMounted(true);
      
      // Apply current theme to DOM if needed
      const storedTheme = loadThemeFromStorage();
      if (storedTheme) {
        setActiveTheme(storedTheme);
      }

      // Delay theme generation to not block initial render
      setTimeout(() => {
        setThemesReady(true);
      }, 100);
    }
  }, [localMounted, setMounted, setActiveTheme]);

  const isDark = localMounted && theme === "dark";

  // Handle mode changes with view transitions
  useEffect(() => {
    if (localMounted) {
      applyThemeModeChange(isDark ? "dark" : "light");
    }
  }, [localMounted, isDark]);

  const handleThemeSelect = (selectedTheme: AppThemeData) => {
    setActiveTheme(selectedTheme);
    // Apply theme with view transition
    applyThemeWithTransition(selectedTheme, isDark ? "dark" : "light");
  };

  // Generate themes only once and cache them (don't regenerate on every isDark change)
  const tweakcnThemes = useMemo(() => {
    if (!localMounted || !themesReady) return [];
    return extractTweakcnThemeData(isDark).map((themeData, index) => ({
      ...themeData,
      description: `Beautiful ${themeData.name.toLowerCase()} theme with carefully crafted color combinations`,
      author: "tweakcn",
      downloads: 8000 + index * 500,
      likes: 400 + index * 50,
      views: 15000 + index * 2000,
      tags: [
        themeData.name.split(" ")[0].toLowerCase(),
        "modern",
        "preset",
        "community",
      ],
    }));
  }, [localMounted, themesReady, isDark]);

  const raysoThemes = useMemo(() => {
    if (!localMounted || !themesReady) return [];
    return extractRaysoThemeData(isDark).map((themeData, index) => ({
      ...themeData,
      description: `Beautiful ${themeData.name.toLowerCase()} theme from ray.so with carefully crafted color combinations`,
      author: "ray.so",
      downloads: 6000 + index * 400,
      likes: 300 + index * 40,
      views: 12000 + index * 1500,
      tags: [themeData.name.toLowerCase(), "rayso", "modern", "community"],
    }));
  }, [localMounted, themesReady, isDark]);

  const tinteThemes = useMemo(() => {
    if (!localMounted || !themesReady) return [];
    return extractTinteThemeData(isDark).map((themeData, index) => ({
      ...themeData,
      description: `Stunning ${themeData.name.toLowerCase()} theme created by tinte with modern design principles`,
      author: "tinte",
      downloads: 5000 + index * 350,
      likes: 250 + index * 35,
      views: 10000 + index * 1200,
      tags: [
        themeData.name.toLowerCase().split(" ")[0],
        "tinte",
        "premium",
        "design",
      ],
    }));
  }, [localMounted, themesReady, isDark]);

  const allThemes = useMemo(() => {
    if (!localMounted) return [DEFAULT_THEME];
    
    // Combine all themes and remove duplicates by id
    const combinedThemes = [DEFAULT_THEME, ...tinteThemes, ...raysoThemes, ...tweakcnThemes];
    const uniqueThemes = combinedThemes.filter((theme, index, arr) => 
      arr.findIndex(t => t.id === theme.id) === index
    );
    
    return uniqueThemes;
  }, [localMounted, themesReady, tinteThemes, raysoThemes, tweakcnThemes]);

  // Debug logs
  console.log('🔍 useTinteTheme Debug:', {
    localMounted,
    activeTheme: activeTheme ? { id: activeTheme.id, name: activeTheme.name } : null,
    allThemesCount: allThemes.length,
    allThemeIds: allThemes.map(t => `${t.id}:${t.name}`).slice(0, 10), // First 10 for brevity
    isDark,
    theme,
    // Check localStorage directly
    storedTheme: (() => {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('tinte-selected-theme');
          const parsed = stored ? JSON.parse(stored) : null;
          return parsed ? { id: parsed.id, name: parsed.name } : null;
        } catch (e) {
          return 'error';
        }
      }
      return 'ssr';
    })()
  });

  return {
    mounted: localMounted,
    isDark,
    currentTheme: theme, // Direct theme value (light or dark)
    activeTheme,
    handleThemeSelect,
    tweakcnThemes,
    raysoThemes,
    tinteThemes,
    allThemes,
  };
}
