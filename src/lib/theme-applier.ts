import { providerRegistry } from "./providers";

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

// Simple theme tracking
const currentAppliedTheme = { id: '', mode: '' };

export function applyThemeWithTransition(
  themeData: ThemeData,
  currentMode: "light" | "dark"
) {
  const themeKey = `${themeData.id}-${currentMode}`;
  
  // Skip if same theme is already applied
  if (currentAppliedTheme.id === themeKey) return;
  currentAppliedTheme.id = themeKey;
  
  if (typeof window === 'undefined') {
    applyThemeDirectly(themeData, currentMode);
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!document.startViewTransition || prefersReducedMotion) {
    applyThemeDirectly(themeData, currentMode);
    return;
  }

  document.startViewTransition(() => {
    applyThemeDirectly(themeData, currentMode);
  });
}

export function applyThemeModeChange(currentMode: "light" | "dark") {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const applyMode = () => {
    if (currentMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  if (!document.startViewTransition || prefersReducedMotion) {
    applyMode();
    return;
  }

  document.startViewTransition(applyMode);
}

// Simple cache for processed themes
const themeCache = new Map<string, any>();

export function applyThemeDirectly(
  themeData: ThemeData,
  currentMode: "light" | "dark"
) {
  const root = document.documentElement;
  const cacheKey = `${themeData.id}-${currentMode}`;

  let tokens = themeCache.get(cacheKey);
  
  if (!tokens) {
    if (themeData.author === "tweakcn" && themeData.rawTheme) {
      tokens = themeData.rawTheme[currentMode];
    } else if (themeData.rawTheme) {
      try {
        const shadcnTheme = providerRegistry.convert("shadcn", themeData.rawTheme) as any;
        tokens = shadcnTheme[currentMode];
      } catch (error) {
        console.warn("Failed to transform theme:", error);
        applyBasicColors(themeData, currentMode, root);
        return;
      }
    } else {
      applyBasicColors(themeData, currentMode, root);
      return;
    }
    themeCache.set(cacheKey, tokens);
  }

  // Apply CSS custom properties directly
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

function applyBasicColors(
  themeData: ThemeData,
  currentMode: "light" | "dark",
  root: HTMLElement
) {
  const { colors } = themeData;
  const isDark = currentMode === "dark";
  
  // Core colors
  const properties = {
    '--background': colors.background,
    '--foreground': colors.foreground,
    '--primary': colors.primary,
    '--secondary': colors.secondary,
    '--accent': colors.accent,
    '--card': colors.background,
    '--card-foreground': colors.foreground,
    '--popover': colors.background,
    '--popover-foreground': colors.foreground,
    '--primary-foreground': colors.background,
    '--secondary-foreground': colors.foreground,
    '--accent-foreground': colors.foreground,
    '--muted': isDark ? adjustBrightness(colors.background, 10) : adjustBrightness(colors.background, -3),
    '--muted-foreground': isDark ? adjustBrightness(colors.foreground, -20) : adjustBrightness(colors.foreground, 20),
    '--border': isDark ? adjustOpacity(colors.foreground, 0.2) : adjustBrightness(colors.background, -15),
    '--input': isDark ? adjustOpacity(colors.foreground, 0.15) : adjustBrightness(colors.background, -15)
  };

  // Apply all properties
  Object.entries(properties).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

}

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
