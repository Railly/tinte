import { ThemeData, ThemeColors, TinteThemeData } from "@/lib/theme-tokens";

export function extractThemeColors(theme: ThemeData): Partial<ThemeColors> {
  const tinteTheme = theme as TinteThemeData;

  // First check for computedTokens (tinte themes)
  if (tinteTheme.computedTokens?.light) {
    const tokens = tinteTheme.computedTokens.light;
    return {
      primary: tokens.primary || "#000000",
      secondary: tokens.secondary || "#666666",
      accent: tokens.accent || "#0066cc",
      foreground: tokens.foreground || "#000000",
    };
  }

  // Use standard colors object (all themes have this)
  return {
    primary: theme.colors.primary || "#000000",
    secondary: theme.colors.secondary || "#666666",
    accent: theme.colors.accent || "#0066cc",
    foreground: theme.colors.foreground || "#000000",
  };
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}
