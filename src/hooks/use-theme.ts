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
  convertColorToHex 
} from "@/lib/theme-manager";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { extractTinteThemeData, DEFAULT_THEME } from "@/utils/tinte-presets";
import { useThemeConversion, useThemeAdapters } from "./use-theme-adapters";
import { downloadFile, downloadJSON, downloadMultipleFiles } from "@/lib/file-download";
import type { TinteTheme } from "@/types/tinte";

interface Coords { x: number; y: number }

export function useTheme() {
  const [mounted, setMounted] = useState(false);
  const [currentMode, setCurrentMode] = useState<ThemeMode>("light");
  const [activeTheme, setActiveTheme] = useState<ThemeData>(DEFAULT_THEME);
  const [editedTokens, setEditedTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    // Try to get immediate data from theme script
    const preloadedData = typeof window !== 'undefined' ? window.__TINTE_THEME__ : null;
    
    if (preloadedData) {
      // Use pre-loaded data for instant rendering
      setCurrentMode(preloadedData.mode);
      setActiveTheme(preloadedData.theme);
      setMounted(true);
    } else {
      // Fallback to storage
      const storedTheme = loadTheme();
      const initialMode = loadMode();
      
      setCurrentMode(initialMode);
      setActiveTheme(storedTheme);
      setMounted(true);
      
      applyModeClass(initialMode);
      applyThemeWithTransition(storedTheme, initialMode);
    }
  }, []);

  const baseTokens = useMemo(() => {
    if (!mounted || !activeTheme) return {};
    
    const { computeThemeTokens } = require('@/lib/theme-manager');
    const computed = computeThemeTokens(activeTheme);
    const tokens = computed[currentMode];
    
    const processedTokens: Record<string, string> = {};
    for (const [key, value] of Object.entries(tokens)) {
      if (typeof value === "string") {
        processedTokens[key] = convertColorToHex(value);
      }
    }
    
    return processedTokens;
  }, [mounted, activeTheme, currentMode]);

  const currentTokens = useMemo(
    () => ({ ...baseTokens, ...editedTokens }),
    [baseTokens, editedTokens]
  );

  const handleModeChange = useCallback((newMode: ThemeMode) => {
    const savedTheme = loadTheme();
    
    setCurrentMode(newMode);
    setActiveTheme(savedTheme);
    setEditedTokens({});
    
    saveMode(newMode);
    applyThemeWithTransition(savedTheme, newMode);
  }, []);

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
    // Use current mode instead of loading from storage to maintain consistency
    const modeToUse = currentMode;
    
    setActiveTheme(theme);
    setEditedTokens({});
    
    saveTheme(theme);
    applyThemeWithTransition(theme, modeToUse);
  }, [currentMode]);

  const handleTokenEdit = useCallback((key: string, value: string) => {
    const hexValue = convertColorToHex(value);
    
    setEditedTokens(prev => ({ ...prev, [key]: hexValue }));
    
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty(`--${key}`, hexValue);
    }
  }, []);

  const resetTokens = useCallback(() => {
    setEditedTokens({});
    
    // Restore original CSS custom properties by re-applying the base theme
    if (typeof window !== 'undefined' && activeTheme) {
      const savedMode = loadMode();
      applyThemeWithTransition(activeTheme, savedMode);
    }
  }, [activeTheme]);

  const tweakcnThemes = useMemo(() => {
    if (!mounted) return [];
    return extractTweakcnThemeData(false).map((themeData, index) => ({
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
  }, [mounted]);

  const raysoThemes = useMemo(() => {
    if (!mounted) return [];
    return extractRaysoThemeData(false).map((themeData, index) => ({
      ...themeData,
      description: `Beautiful ${themeData.name.toLowerCase()} theme from ray.so with carefully crafted color combinations`,
      author: "ray.so",
      provider: "rayso" as const,
      downloads: 6000 + index * 400,
      likes: 300 + index * 40,
      views: 12000 + index * 1500,
      tags: [themeData.name.toLowerCase(), "rayso", "modern", "community"],
    }));
  }, [mounted]);

  const tinteThemes = useMemo(() => {
    if (!mounted) return [];
    return extractTinteThemeData(false).map((themeData, index) => ({
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
  }, [mounted]);

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

  // TinteTheme extraction
  const tinteTheme: TinteTheme = useMemo(() => {
    const currentTheme = activeTheme || DEFAULT_THEME;
    if (
      currentTheme?.rawTheme &&
      typeof currentTheme.rawTheme === "object" &&
      "light" in currentTheme.rawTheme &&
      "dark" in currentTheme.rawTheme
    ) {
      return currentTheme.rawTheme as TinteTheme;
    }
    return DEFAULT_THEME.rawTheme as TinteTheme;
  }, [activeTheme]);

  // Theme conversion
  const conversion = useThemeConversion(tinteTheme);
  const { exportTheme } = useThemeAdapters();

  // Export handlers
  const handleExportAll = useCallback(() => {
    const allExports = conversion.exportAll();
    const files = Object.entries(allExports).map(([_, exportResult]) => ({
      content: exportResult.content,
      filename: exportResult.filename,
      mimeType: exportResult.mimeType,
    }));
    downloadMultipleFiles(files);
  }, [conversion]);

  const handleExportTinte = useCallback(() => {
    downloadJSON(tinteTheme, "tinte-theme");
  }, [tinteTheme]);

  const handleExport = useCallback(
    (adapterId: string) => {
      const exportResult = exportTheme(adapterId, tinteTheme);
      if (exportResult) {
        downloadFile({
          content: exportResult.content,
          filename: exportResult.filename,
          mimeType: exportResult.mimeType,
        });
      }
    },
    [exportTheme, tinteTheme]
  );

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
    
    // Theme data
    tinteTheme,
    conversion,
    
    // Actions
    handleModeChange,
    toggleTheme,
    handleThemeSelect,
    handleTokenEdit,
    resetTokens,
    
    // Export actions
    handleExport,
    handleExportAll,
    handleExportTinte,
    
    // Legacy compatibility
    theme: currentMode,
    setTheme: handleModeChange,
  };
}