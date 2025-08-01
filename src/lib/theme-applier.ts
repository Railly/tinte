import { computeThemeTokens, saveTheme, applyTokensToDOM, ThemeData } from "./theme-tokens";

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
  
  // Save theme for persistence
  saveTheme(themeData);
  
  // Compute and apply tokens
  const computedTheme = computeThemeTokens(themeData);
  const tokens = computedTheme.computedTokens[currentMode];
  
  const applyTheme = () => applyTokensToDOM(tokens);
  
  if (typeof window === 'undefined') {
    applyTheme();
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!document.startViewTransition || prefersReducedMotion) {
    applyTheme();
    return;
  }

  document.startViewTransition(applyTheme);
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

export function applyThemeDirectly(
  themeData: ThemeData,
  currentMode: "light" | "dark"
) {
  const computedTheme = computeThemeTokens(themeData);
  const tokens = computedTheme.computedTokens[currentMode];
  applyTokensToDOM(tokens);
}

