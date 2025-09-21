import type { ThemeData } from "@/lib/theme-tokens";
import { DEFAULT_THEME } from "@/utils/default-theme";
import type { ThemeMode, ThemeOverrides } from "../types";
import { computeThemeTokens } from "./theme-computation";

const THEME_STORAGE_KEY = "tinte-selected-theme";
const MODE_STORAGE_KEY = "tinte-current-mode";
const ANONYMOUS_THEMES_KEY = "tinte-anonymous-themes";

export const loadFromStorage = (): { theme: ThemeData; mode: ThemeMode } => {
  if (typeof window === "undefined") {
    console.log("📱 [loadFromStorage] SSR - using defaults");
    return { theme: DEFAULT_THEME, mode: "light" };
  }

  const preloaded = (window as any).__TINTE_THEME__;
  if (preloaded) {
    console.log(
      "📱 [loadFromStorage] Using preloaded theme:",
      preloaded.theme.name,
    );
    return { theme: preloaded.theme, mode: preloaded.mode };
  }

  let theme = DEFAULT_THEME;
  let mode: ThemeMode = "light";

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const storedMode = localStorage.getItem(MODE_STORAGE_KEY);

    if (storedTheme) {
      theme = JSON.parse(storedTheme);
    }

    if (storedMode === "dark" || storedMode === "light") {
      mode = storedMode;
    } else {
      mode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
  } catch (error) {
    console.error("📱 [loadFromStorage] Error:", error);
  }

  return { theme, mode };
};

export const saveToStorage = (
  theme: ThemeData,
  mode: ThemeMode,
  overrides?: ThemeOverrides,
  hasActualEdits?: boolean,
): void => {
  if (typeof window === "undefined") return;

  try {
    const computedTokens = computeThemeTokens(theme);
    const themeWithTokens = {
      ...theme,
      computedTokens,
      ...(hasActualEdits
        ? { lastEditTimestamp: new Date().toISOString() }
        : {}),
      overrides: overrides
        ? {
            shadcn: overrides.shadcn,
            vscode: overrides.vscode,
            shiki: overrides.shiki,
          }
        : (theme as any).overrides,
    };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeWithTokens));
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // Silent fail
  }
};

export const saveAnonymousThemes = (themes: ThemeData[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ANONYMOUS_THEMES_KEY, JSON.stringify(themes));
  } catch {
    // Silent fail
  }
};

export const loadAnonymousThemes = (): ThemeData[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(ANONYMOUS_THEMES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export { THEME_STORAGE_KEY, MODE_STORAGE_KEY, ANONYMOUS_THEMES_KEY };
