import { ThemeData } from "./theme-tokens";
import { formatHex, parse } from "culori";
import { DEFAULT_THEME } from "@/utils/tinte-presets";
import { providerRegistry } from "./providers";
import { ShadcnTheme } from "@/types/shadcn";

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "tinte-selected-theme";
const MODE_STORAGE_KEY = "tinte-current-mode";

let currentAppliedTheme = { id: "", mode: "" };

declare global {
  interface Window {
    __TINTE_THEME__?: {
      theme: ThemeData;
      mode: ThemeMode;
      tokens: Record<string, string>;
    };
  }
}

export function convertColorToHex(colorValue: string): string {
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

export function extractThemeColors(
  theme: ThemeData,
  mode?: ThemeMode
): Record<string, string> {
  const computed = computeThemeTokens(theme);
  const currentMode = mode || loadMode();
  const tokens = computed[currentMode];

  return {
    primary: tokens.primary || "#000000",
    secondary: tokens.secondary || "#666666",
    accent: tokens.accent || "#0066cc",
    background: tokens.background || "#ffffff",
    foreground: tokens.foreground || "#000000",
  };
}

export function computeThemeTokens(theme: ThemeData): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  if ((theme as any).computedTokens) {
    return (theme as any).computedTokens;
  }

  let computedTokens: { light: any; dark: any };

  if (theme.author === "tweakcn" && theme.rawTheme) {
    computedTokens = {
      light: theme.rawTheme.light,
      dark: theme.rawTheme.dark,
    };
  } else if (theme.rawTheme) {
    try {
      const shadcnTheme = providerRegistry.convert(
        "shadcn",
        theme.rawTheme
      ) as ShadcnTheme;
      computedTokens = {
        light: shadcnTheme.light,
        dark: shadcnTheme.dark,
      };
    } catch {
      computedTokens = DEFAULT_THEME.computedTokens;
    }
  } else {
    computedTokens = DEFAULT_THEME.computedTokens;
  }

  return computedTokens;
}

export function applyTokensToDOM(tokens: Record<string, string>): void {
  console.log({ tokens });
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const root = document.documentElement;

  Object.entries(tokens).forEach(([key, value]) => {
    console.log({ key, value });
    if (typeof value === "string" && value.trim()) {
      // Apply all tokens - colors, fonts, shadows, radius, spacing, etc.
      root.style.setProperty(`--${key}`, value);
    }
  });
}

export function applyTheme(theme: ThemeData, mode: ThemeMode): void {
  const themeKey = `${theme.id}-${mode}`;
  console.log({ themeKey });

  if (currentAppliedTheme.id === themeKey) return;
  currentAppliedTheme.id = themeKey;

  const computedTokens = computeThemeTokens(theme);
  const tokens = computedTokens[mode];

  console.log({ tokens });
  applyTokensToDOM(tokens);

  if (typeof window !== "undefined") {
    window.__TINTE_THEME__ = {
      theme,
      mode,
      tokens,
    };
  }
}

export function applyThemeWithTransition(
  theme: ThemeData,
  mode: ThemeMode
): void {
  const applyChanges = () => {
    applyTheme(theme, mode);
    applyModeClass(mode);
  };

  console.log({ applyChanges });

  if (typeof window === "undefined") {
    applyChanges();
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!document.startViewTransition || prefersReducedMotion) {
    applyChanges();
    return;
  }

  document.startViewTransition(applyChanges);
}

export function applyModeClass(mode: ThemeMode): void {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  if (mode === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

export function saveTheme(theme: ThemeData): void {
  if (typeof window === "undefined") return;

  try {
    const computedTokens = computeThemeTokens(theme);
    const themeWithTokens = { ...theme, computedTokens };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeWithTokens));
  } catch {
    // Silent fail - localStorage might not be available
  }
}

export function loadTheme(): ThemeData {
  if (typeof window === "undefined") return DEFAULT_THEME;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Silent fail - localStorage might not be available
  }

  return DEFAULT_THEME;
}

export function saveMode(mode: ThemeMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MODE_STORAGE_KEY, mode);
}

export function loadMode(): ThemeMode {
  if (typeof window === "undefined") return "light";

  try {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

// Fast token getter - prioritizes window.__TINTE_THEME__ (instant)
export function getTokensFast(): Record<string, string> {
  if (typeof window === "undefined") return {};

  if (window.__TINTE_THEME__?.tokens) {
    const processedTokens: Record<string, string> = {};
    for (const [key, value] of Object.entries(window.__TINTE_THEME__.tokens)) {
      if (typeof value === "string") {
        processedTokens[key] = convertColorToHex(value);
      }
    }
    return processedTokens;
  }

  return {};
}
