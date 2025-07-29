import { create } from 'zustand';
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo } from "react";
import { applyThemeWithTransition, ThemeData as AppThemeData } from "@/lib/theme-applier";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { extractTinteThemeData } from "@/utils/tinte-presets";

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
  // Initial state
  activeTheme: null,
  mounted: false,

  // Actions
  setActiveTheme: (theme: AppThemeData) => {
    set({ activeTheme: theme });
  },

  setMounted: (mounted: boolean) => {
    set({ mounted });
  },

  initializeTheme: (isDark: boolean) => {
    const { activeTheme, mounted } = get();
    
    if (!mounted || activeTheme) return;

    const defaultTinteTheme = extractTinteThemeData(isDark)[0];
    if (defaultTinteTheme) {
      const themeData = {
        ...defaultTinteTheme,
        description: "Default Tinte theme with modern design principles",
        author: "tinte",
        downloads: 5000,
        likes: 250,
        views: 10000,
        tags: ["default", "tinte", "premium", "design"],
      };

      set({ activeTheme: themeData });
      applyThemeWithTransition(themeData, isDark ? "dark" : "light");
    }
  },

  applyCurrentTheme: (isDark: boolean) => {
    const { activeTheme } = get();
    if (activeTheme) {
      applyThemeWithTransition(activeTheme, isDark ? "dark" : "light");
    }
  },
}));

// Hook for theme management with Next.js theme integration
export function useTinteTheme() {
  const { theme, systemTheme } = useTheme();
  const [localMounted, setLocalMounted] = useState(false);
  
  const {
    activeTheme,
    mounted,
    setMounted,
    setActiveTheme,
    initializeTheme,
    applyCurrentTheme,
  } = useTinteThemeStore();

  useEffect(() => {
    setLocalMounted(true);
    setMounted(true);
  }, [setMounted]);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = localMounted && currentTheme === "dark";

  // Initialize default theme
  useEffect(() => {
    initializeTheme(isDark);
  }, [initializeTheme, isDark]);

  // Apply theme when mode changes
  useEffect(() => {
    if (mounted) {
      applyCurrentTheme(isDark);
    }
  }, [mounted, isDark, applyCurrentTheme]);

  const handleThemeSelect = (selectedTheme: AppThemeData) => {
    setActiveTheme(selectedTheme);
    applyThemeWithTransition(selectedTheme, isDark ? "dark" : "light");
  };

  const tweakcnThemes = useMemo(() => {
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
  }, [isDark]);

  const raysoThemes = useMemo(() => {
    return extractRaysoThemeData(isDark).map((themeData, index) => ({
      ...themeData,
      description: `Beautiful ${themeData.name.toLowerCase()} theme from ray.so with carefully crafted color combinations`,
      author: "ray.so",
      downloads: 6000 + index * 400,
      likes: 300 + index * 40,
      views: 12000 + index * 1500,
      tags: [themeData.name.toLowerCase(), "rayso", "modern", "community"],
    }));
  }, [isDark]);

  const tinteThemes = useMemo(() => {
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
  }, [isDark]);

  const allThemes = useMemo(
    () => [...tinteThemes, ...raysoThemes, ...tweakcnThemes],
    [tinteThemes, raysoThemes, tweakcnThemes]
  );

  return {
    mounted: localMounted,
    isDark,
    currentTheme,
    activeTheme,
    handleThemeSelect,
    tweakcnThemes,
    raysoThemes,
    tinteThemes,
    allThemes,
  };
}