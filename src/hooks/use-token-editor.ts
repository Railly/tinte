"use client";

import { useState, useCallback, useMemo } from "react";
import { ThemeData } from "@/lib/theme-tokens";
import { formatHex, parse } from "culori";

declare global {
  interface Window {
    __TINTE_THEME__?: {
      theme: any;
      mode: 'light' | 'dark';
      tokens: Record<string, string>;
      allowTransitions: boolean;
    };
  }
}

function convertColorToHex(colorValue: string): string {
  try {
    if (colorValue.startsWith("#")) return colorValue;

    const parsed = parse(colorValue);
    if (parsed) {
      return formatHex(parsed) || colorValue;
    }
    return colorValue;
  } catch {
    return colorValue;
  }
}

export function useTokenEditor(activeTheme: ThemeData, isDark: boolean) {
  const [editedTokens, setEditedTokens] = useState<Record<string, string>>({});

  const baseTokens = useMemo(() => {
    if (typeof window === "undefined") {
      console.log('🔍 useTokenEditor: SSR - returning empty');
      return {};
    }

    console.log('🔍 useTokenEditor: Reading tokens...', {
      hasGlobalState: !!window.__TINTE_THEME__,
      globalTokens: window.__TINTE_THEME__?.tokens ? Object.keys(window.__TINTE_THEME__.tokens).length : 0,
      activeTheme: activeTheme ? { id: activeTheme.id, name: activeTheme.name } : null,
      isDark
    });

    try {
      // First, try to read from the global state set by TinteThemeScript
      if (window.__TINTE_THEME__ && window.__TINTE_THEME__.tokens) {
        console.log('✅ useTokenEditor: Reading from global state');
        const tokens = window.__TINTE_THEME__.tokens;
        const processedTokens: Record<string, string> = {};
        
        for (const [key, value] of Object.entries(tokens)) {
          if (typeof value === "string") {
            processedTokens[key] = convertColorToHex(value);
          }
        }
        
        console.log('✅ useTokenEditor: Global tokens processed:', Object.keys(processedTokens).length);
        return processedTokens;
      }

      // Fallback: read from CSS custom properties (what's actually applied)
      console.log('⚠️ useTokenEditor: Fallback to CSS properties');
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      const tokenKeys = [
        "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
        "primary", "primary-foreground", "secondary", "secondary-foreground", 
        "muted", "muted-foreground", "accent", "accent-foreground", 
        "destructive", "border", "input", "ring"
      ];

      const processedTokens: Record<string, string> = {};
      
      for (const key of tokenKeys) {
        const value = computedStyle.getPropertyValue(`--${key}`).trim();
        if (value) {
          processedTokens[key] = convertColorToHex(value);
        }
      }

      console.log('⚠️ useTokenEditor: CSS tokens processed:', Object.keys(processedTokens).length);
      return processedTokens;
    } catch (error) {
      console.error("❌ useTokenEditor: Error reading theme tokens:", error);
      return {};
    }
  }, [activeTheme, isDark]);

  // Add a loading state for better UX
  const isLoading = typeof window !== "undefined" && Object.keys(baseTokens).length === 0;

  const currentTokens = useMemo(
    () => ({ ...baseTokens, ...editedTokens }),
    [baseTokens, editedTokens]
  );

  const handleTokenEdit = useCallback((key: string, value: string) => {
    setEditedTokens((prev) => ({
      ...prev,
      [key]: convertColorToHex(value),
    }));
  }, []);

  const resetTokens = useCallback(() => {
    setEditedTokens({});
  }, []);

  const hasEdits = Object.keys(editedTokens).length > 0;

  return {
    currentTokens,
    handleTokenEdit,
    resetTokens,
    hasEdits,
    isLoading,
  };
}