export interface ThemeData {
  id: string;
  name: string;
  description: string;
  author: string;
  downloads: number;
  likes: number;
  views: number;
  createdAt: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  tags: string[];
  rawTheme?: any;
}

import { DEFAULT_THEME } from "@/utils/tinte-presets";

export interface ComputedTheme extends ThemeData {
  computedTokens: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export const THEME_STORAGE_KEY = "tinte-selected-theme";

export function computeThemeTokens(theme: ThemeData): ComputedTheme {
  if ((theme as ComputedTheme).computedTokens) {
    return theme as ComputedTheme;
  }

  let computedTokens: { light: any; dark: any };

  if (theme.author === "tweakcn" && theme.rawTheme) {
    computedTokens = {
      light: theme.rawTheme.light,
      dark: theme.rawTheme.dark
    };
  } else if (theme.rawTheme) {
    try {
      const { providerRegistry } = require('@/lib/providers');
      const shadcnTheme = providerRegistry.convert("shadcn", theme.rawTheme);
      computedTokens = {
        light: shadcnTheme.light,
        dark: shadcnTheme.dark
      };
    } catch (error) {
      console.warn('Failed to compute theme tokens:', error);
      computedTokens = DEFAULT_THEME.computedTokens;
    }
  } else {
    computedTokens = DEFAULT_THEME.computedTokens;
  }

  return {
    ...theme,
    computedTokens
  };
}

export function saveTheme(theme: ThemeData): void {
  if (typeof window === 'undefined') return;
  
  try {
    const computedTheme = computeThemeTokens(theme);
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(computedTheme));
  } catch (error) {
    console.warn('Failed to save theme:', error);
  }
}

export function loadTheme(): ComputedTheme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      const parsedTheme = JSON.parse(stored);
      return computeThemeTokens(parsedTheme);
    }
  } catch (error) {
    console.warn('Failed to load theme:', error);
  }
  
  return DEFAULT_THEME;
}

export function applyTokensToDOM(tokens: Record<string, string>): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  Object.entries(tokens).forEach(([key, value]) => {
    if (
      typeof value === "string" &&
      !key.startsWith("font-") &&
      !key.startsWith("shadow-") &&
      key !== "radius" &&
      key !== "spacing" &&
      key !== "letter-spacing"
    ) {
      root.style.setProperty(`--${key}`, value);
    }
  });
}