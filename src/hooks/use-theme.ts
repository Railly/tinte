"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ThemeData } from "@/lib/theme-tokens";
import { 
  ThemeMode, 
  applyThemeWithTransition, 
  applyModeClass,
  saveTheme, 
  saveMode, 
  loadTheme, 
  loadMode,
  getTokensFromDOM,
  convertColorToHex 
} from "@/lib/theme-manager";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { extractTinteThemeData, DEFAULT_THEME } from "@/utils/tinte-presets";

interface Coords { x: number; y: number }

export function useTheme() {
  const [mounted, setMounted] = useState(false);
  const [currentMode, setCurrentMode] = useState<ThemeMode>("light");
  const [activeTheme, setActiveTheme] = useState<ThemeData>(DEFAULT_THEME);
  const [editedTokens, setEditedTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialMode = loadMode();
    const storedTheme = loadTheme();
    
    setCurrentMode(initialMode);
    setActiveTheme(storedTheme);
    setMounted(true);
    
    applyModeClass(initialMode);
    
    if (storedTheme) {
      applyThemeWithTransition(storedTheme, initialMode);
    }
  }, []);

  const baseTokens = useMemo(() => {
    if (!mounted) return {};
    return getTokensFromDOM();
  }, [mounted, activeTheme?.id, currentMode]);

  const currentTokens = useMemo(
    () => ({ ...baseTokens, ...editedTokens }),
    [baseTokens, editedTokens]
  );

  const handleModeChange = useCallback((newMode: ThemeMode) => {
    setCurrentMode(newMode);
    saveMode(newMode);
    
    if (activeTheme) {
      applyThemeWithTransition(activeTheme, newMode);
    } else {
      applyModeClass(newMode);
    }
  }, [activeTheme]);

  const toggleTheme = useCallback((coords?: Coords) => {
    const newMode = currentMode === "light" ? "dark" : "light";
    
    if (typeof window === 'undefined') {
      handleModeChange(newMode);
      return;
    }

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      handleModeChange(newMode);
      return;
    }

    if (coords) {
      root.style.setProperty("--x", `${coords.x}px`);
      root.style.setProperty("--y", `${coords.y}px`);
    }

    document.startViewTransition(() => {
      handleModeChange(newMode);
    });
  }, [currentMode, handleModeChange]);

  const handleThemeSelect = useCallback((theme: ThemeData) => {
    setActiveTheme(theme);
    saveTheme(theme);
    setEditedTokens({});
    applyThemeWithTransition(theme, currentMode);
  }, [currentMode]);

  const handleTokenEdit = useCallback((key: string, value: string) => {
    setEditedTokens(prev => ({
      ...prev,
      [key]: convertColorToHex(value),
    }));
  }, []);

  const resetTokens = useCallback(() => {
    setEditedTokens({});
  }, []);

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

  return {
    // State
    mounted,
    currentMode,
    activeTheme,
    isDark: currentMode === "dark",
    
    // Theme collections
    allThemes,
    tweakcnThemes,
    raysoThemes,
    tinteThemes,
    
    // Token editing
    currentTokens,
    hasEdits: Object.keys(editedTokens).length > 0,
    isLoading: mounted && Object.keys(baseTokens).length === 0,
    
    // Actions
    handleModeChange,
    toggleTheme,
    handleThemeSelect,
    handleTokenEdit,
    resetTokens,
    
    // Legacy compatibility
    theme: currentMode,
    setTheme: handleModeChange,
  };
}