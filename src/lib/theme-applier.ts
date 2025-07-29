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

// Custom event system for theme changes
const THEME_CHANGE_EVENT = "tinte-theme-change";

export interface ThemeChangeEventDetail {
  themeData: ThemeData;
  mode: "light" | "dark";
  tokens: any;
}

function dispatchThemeChangeEvent(detail: ThemeChangeEventDetail) {
  const event = new CustomEvent(THEME_CHANGE_EVENT, { detail });
  window.dispatchEvent(event);
}

export function addThemeChangeListener(
  callback: (detail: ThemeChangeEventDetail) => void
) {
  const handler = (event: CustomEvent<ThemeChangeEventDetail>) => {
    callback(event.detail);
  };
  window.addEventListener(THEME_CHANGE_EVENT, handler as EventListener);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handler as EventListener);
  };
}

let isApplyingTheme = false;

export function applyThemeWithTransition(
  themeData: ThemeData,
  currentMode: "light" | "dark"
) {
  if (isApplyingTheme) return;
  isApplyingTheme = true;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!document.startViewTransition || prefersReducedMotion) {
    applyThemeDirectly(themeData, currentMode);
    isApplyingTheme = false;
    return;
  }

  const transition = document.startViewTransition(() => {
    applyThemeDirectly(themeData, currentMode);
  });

  transition.finished.finally(() => {
    isApplyingTheme = false;
  });
}

export function applyThemeModeChange(currentMode: "light" | "dark") {
  if (isApplyingTheme) return; // Prevent interference with active theme transitions

  const root = document.documentElement;

  requestAnimationFrame(() => {
    if (currentMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  });
}

// Cache for processed themes to avoid re-computation
const themeCache = new Map<string, any>();

function applyThemeDirectly(
  themeData: ThemeData,
  currentMode: "light" | "dark"
) {
  const root = document.documentElement;
  const cacheKey = `${themeData.id}-${currentMode}`;

  let tokens;

  if (themeCache.has(cacheKey)) {
    tokens = themeCache.get(cacheKey);
  } else {
    if (themeData.author === "tweakcn" && themeData.rawTheme) {
      tokens = themeData.rawTheme[currentMode];
    } else if (themeData.rawTheme) {
      try {
        const shadcnTheme = providerRegistry.convert(
          "shadcn",
          themeData.rawTheme
        );
        // @ts-ignore
        tokens = shadcnTheme[currentMode];
      } catch (error) {
        console.warn(
          "Failed to transform theme, falling back to basic colors:",
          error
        );
        applyBasicColors(themeData, currentMode, root);
        return;
      }
    } else {
      applyBasicColors(themeData, currentMode, root);
      return;
    }

    themeCache.set(cacheKey, tokens);
  }

  // Batch DOM updates for better performance
  requestAnimationFrame(() => {
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

    // Dispatch theme change event after DOM updates
    dispatchThemeChangeEvent({
      themeData,
      mode: currentMode,
      tokens,
    });
  });
}

function applyBasicColors(
  themeData: ThemeData,
  currentMode: "light" | "dark",
  root: HTMLElement
) {
  const colors = themeData.colors;
  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--foreground", colors.foreground);
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--accent", colors.accent);

  const isDark = currentMode === "dark";
  if (isDark) {
    root.style.setProperty("--card", colors.background);
    root.style.setProperty("--card-foreground", colors.foreground);
    root.style.setProperty("--popover", colors.background);
    root.style.setProperty("--popover-foreground", colors.foreground);
    root.style.setProperty("--primary-foreground", colors.background);
    root.style.setProperty("--secondary-foreground", colors.foreground);
    root.style.setProperty("--muted", adjustBrightness(colors.background, 10));
    root.style.setProperty(
      "--muted-foreground",
      adjustBrightness(colors.foreground, -20)
    );
    root.style.setProperty("--accent-foreground", colors.foreground);
    root.style.setProperty("--border", adjustOpacity(colors.foreground, 0.2));
    root.style.setProperty("--input", adjustOpacity(colors.foreground, 0.15));
  } else {
    root.style.setProperty("--card", colors.background);
    root.style.setProperty("--card-foreground", colors.foreground);
    root.style.setProperty("--popover", colors.background);
    root.style.setProperty("--popover-foreground", colors.foreground);
    root.style.setProperty("--primary-foreground", colors.background);
    root.style.setProperty("--secondary-foreground", colors.foreground);
    root.style.setProperty("--muted", adjustBrightness(colors.background, -3));
    root.style.setProperty(
      "--muted-foreground",
      adjustBrightness(colors.foreground, 20)
    );
    root.style.setProperty("--accent-foreground", colors.foreground);
    root.style.setProperty(
      "--border",
      adjustBrightness(colors.background, -15)
    );
    root.style.setProperty("--input", adjustBrightness(colors.background, -15));
  }

  // Dispatch theme change event for basic colors too
  dispatchThemeChangeEvent({
    themeData,
    mode: currentMode,
    tokens: colors,
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
