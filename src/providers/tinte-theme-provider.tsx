"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTinteThemeStore } from "@/stores/tinte-theme";
import { applyThemeWithTransition, applyThemeModeChange } from "@/lib/theme-applier";
import { ThemeData } from "@/lib/theme-tokens";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { extractTinteThemeData, DEFAULT_THEME } from "@/utils/tinte-presets";
import { useMemo } from "react";

type Theme = "dark" | "light";

type TinteThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type Coords = { x: number; y: number };

type TinteThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (coords?: Coords) => void;
  mounted: boolean;
  isDark: boolean;
  currentMode: Theme;
  activeTheme: ThemeData | null;
  handleThemeSelect: (theme: ThemeData) => void;
  handleModeChange: (mode: Theme) => void;
  allThemes: ThemeData[];
  tweakcnThemes: ThemeData[];
  raysoThemes: ThemeData[];
  tinteThemes: ThemeData[];
};

const THEME_STORAGE_KEY = "tinte-current-mode";

const initialState: TinteThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
  mounted: false,
  isDark: false,
  currentMode: "light",
  activeTheme: null,
  handleThemeSelect: () => null,
  handleModeChange: () => null,
  allThemes: [],
  tweakcnThemes: [],
  raysoThemes: [],
  tinteThemes: [],
};

const TinteThemeProviderContext = createContext<TinteThemeProviderState>(initialState);

export function TinteThemeProvider({ 
  children, 
  defaultTheme = "light" 
}: TinteThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [currentMode, setCurrentMode] = useState<Theme>(defaultTheme);
  
  const {
    activeTheme,
    setActiveTheme,
    setMounted: setStoreMounted,
    initializeTheme,
  } = useTinteThemeStore();

  // Initialize theme mode from localStorage on mount
  useEffect(() => {
    const storedMode = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialMode = storedMode || systemPreference;
    
    setCurrentMode(initialMode);
    setMounted(true);
    setStoreMounted(true);
    
    // Apply dark class immediately if needed
    if (initialMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Initialize the theme store
    initializeTheme(initialMode);
  }, [setStoreMounted, initializeTheme]);

  const handleThemeChange = (newMode: Theme) => {
    setCurrentMode(newMode);
    localStorage.setItem(THEME_STORAGE_KEY, newMode);
    
    // If we have an active theme, apply it with the new mode and view transition
    // This ensures both theme tokens and dark class are applied together
    if (activeTheme) {
      applyThemeWithTransition(activeTheme, newMode);
    } else {
      // If no active theme, just apply the mode change with view transition
      applyThemeModeChange(newMode);
    }
  };

  const handleThemeToggle = (coords?: Coords) => {
    const root = document.documentElement;
    const newMode = currentMode === "light" ? "dark" : "light";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      handleThemeChange(newMode);
      return;
    }

    if (coords) {
      root.style.setProperty("--x", `${coords.x}px`);
      root.style.setProperty("--y", `${coords.y}px`);
    }

    document.startViewTransition(() => {
      handleThemeChange(newMode);
    });
  };

  const handleThemeSelect = (selectedTheme: ThemeData) => {
    setActiveTheme(selectedTheme, currentMode);
  };

  // Generate themes only when mounted to avoid SSR issues
  const tweakcnThemes = useMemo(() => {
    if (!mounted) return [];
    return extractTweakcnThemeData(currentMode === "dark").map((themeData, index) => ({
      ...themeData,
      description: `Beautiful ${themeData.name.toLowerCase()} theme with carefully crafted color combinations`,
      author: "tweakcn",
      provider: "tweakcn" as const,
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
  }, [mounted, currentMode]);

  const raysoThemes = useMemo(() => {
    if (!mounted) return [];
    return extractRaysoThemeData(currentMode === "dark").map((themeData, index) => ({
      ...themeData,
      description: `Beautiful ${themeData.name.toLowerCase()} theme from ray.so with carefully crafted color combinations`,
      author: "ray.so",
      provider: "rayso" as const,
      downloads: 6000 + index * 400,
      likes: 300 + index * 40,
      views: 12000 + index * 1500,
      tags: [themeData.name.toLowerCase(), "rayso", "modern", "community"],
    }));
  }, [mounted, currentMode]);

  const tinteThemes = useMemo(() => {
    if (!mounted) return [];
    return extractTinteThemeData(currentMode === "dark").map((themeData, index) => ({
      ...themeData,
      description: `Stunning ${themeData.name.toLowerCase()} theme created by tinte with modern design principles`,
      author: "tinte",
      provider: "tinte" as const,
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
  }, [mounted, currentMode]);

  const allThemes = useMemo(() => {
    if (!mounted) return [DEFAULT_THEME];
    
    const combinedThemes = [
      DEFAULT_THEME, 
      ...tinteThemes, 
      ...raysoThemes, 
      ...tweakcnThemes
    ];
    const uniqueThemes = combinedThemes.filter((theme, index, arr) => 
      arr.findIndex(t => t.id === theme.id) === index
    );
    
    return uniqueThemes;
  }, [mounted, tinteThemes, raysoThemes, tweakcnThemes]);

  const value: TinteThemeProviderState = {
    theme: currentMode,
    setTheme: handleThemeChange,
    toggleTheme: handleThemeToggle,
    mounted,
    isDark: currentMode === "dark",
    currentMode,
    activeTheme,
    handleThemeSelect,
    handleModeChange: handleThemeChange,
    allThemes,
    tweakcnThemes,
    raysoThemes,
    tinteThemes,
  };

  return (
    <TinteThemeProviderContext.Provider value={value}>
      {children}
    </TinteThemeProviderContext.Provider>
  );
}

export const useTinteTheme = () => {
  const context = useContext(TinteThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTinteTheme must be used within a TinteThemeProvider");
  }

  return context;
};