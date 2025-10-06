import {
  computeShadowVars,
  convertTinteToShadcn,
} from "@/lib/providers/shadcn";
import { getShadcnPaletteWithOverrides } from "@/lib/shadcn-theme-utils";
import type {
  ThemeColors,
  ThemeData,
  TinteThemeData,
} from "@/lib/theme-tokens";
import {
  buildFontFamily,
  getDefaultWeights,
  loadGoogleFont,
} from "@/utils/fonts";

export function extractThemeColors(theme: ThemeData): Partial<ThemeColors> {
  // Safety check for theme
  if (!theme) {
    return {
      primary: "#000000",
      secondary: "#666666",
      accent: "#0066cc",
      foreground: "#000000",
      background: "#ffffff",
    };
  }

  const tinteTheme = theme as TinteThemeData;

  // First check for computedTokens (tinte themes)
  if (tinteTheme.computedTokens?.light) {
    const tokens = tinteTheme.computedTokens.light;
    return {
      primary: tokens.primary || "#000000",
      secondary: tokens.secondary || "#666666",
      accent: tokens.accent || "#0066cc",
      foreground: tokens.foreground || "#000000",
      background: tokens.background || "#ffffff",
    };
  }

  // Check for colors object with null safety
  if (theme.colors) {
    return {
      primary: theme.colors.primary || "#000000",
      secondary: theme.colors.secondary || "#666666",
      accent: theme.colors.accent || "#0066cc",
      foreground: theme.colors.foreground || "#000000",
      background: theme.colors.background || "#ffffff",
    };
  }

  // Fallback to rawTheme if available
  if (theme.rawTheme?.light) {
    const rawTokens = theme.rawTheme.light;
    return {
      primary: rawTokens.pr || "#000000",
      secondary: rawTokens.sc || "#666666",
      accent: rawTokens.ac_1 || "#0066cc",
      foreground: rawTokens.tx || "#000000",
      background: rawTokens.bg || "#ffffff",
    };
  }

  // Final fallback
  return {
    primary: "#000000",
    secondary: "#666666",
    accent: "#0066cc",
    foreground: "#000000",
    background: "#ffffff",
  };
}

export function extractShadcnColors(theme: ThemeData, isDark = false) {
  const mode = isDark ? "dark" : "light";

  // Get shadcn overrides from theme
  const themeWithOverride = theme as any;
  const shadcnOverride =
    themeWithOverride.shadcn_override || themeWithOverride.overrides?.shadcn;

  // Use getShadcnPaletteWithOverrides if we have rawTheme (Tinte themes)
  if ("rawTheme" in theme && theme.rawTheme) {
    try {
      const paletteWithOverrides = getShadcnPaletteWithOverrides(
        theme.rawTheme,
        mode,
        shadcnOverride,
      );

      const colorSet = paletteWithOverrides;

      return {
        // Core colors
        "--background": colorSet.background,
        "--foreground": colorSet.foreground,
        "--card": colorSet.card,
        "--card-foreground": colorSet["card-foreground"],
        "--popover": colorSet.popover,
        "--popover-foreground": colorSet["popover-foreground"],

        // Primary colors
        "--primary": colorSet.primary,
        "--primary-foreground": colorSet["primary-foreground"],
        "--secondary": colorSet.secondary,
        "--secondary-foreground": colorSet["secondary-foreground"],

        // Accent colors
        "--accent": colorSet.accent,
        "--accent-foreground": colorSet["accent-foreground"],
        "--muted": colorSet.muted,
        "--muted-foreground": colorSet["muted-foreground"],

        // Destructive
        "--destructive": colorSet.destructive,
        "--destructive-foreground": colorSet["destructive-foreground"],

        // Borders and inputs
        "--border": colorSet.border,
        "--input": colorSet.input,
        "--ring": colorSet.ring,

        // Chart colors
        "--chart-1": colorSet["chart-1"],
        "--chart-2": colorSet["chart-2"],
        "--chart-3": colorSet["chart-3"],
        "--chart-4": colorSet["chart-4"],
        "--chart-5": colorSet["chart-5"],

        // Sidebar colors
        "--sidebar": colorSet.sidebar,
        "--sidebar-foreground": colorSet["sidebar-foreground"],
        "--sidebar-primary": colorSet["sidebar-primary"],
        "--sidebar-primary-foreground": colorSet["sidebar-primary-foreground"],
        "--sidebar-accent": colorSet["sidebar-accent"],
        "--sidebar-accent-foreground": colorSet["sidebar-accent-foreground"],
        "--sidebar-border": colorSet["sidebar-border"],
        "--sidebar-ring": colorSet["sidebar-ring"],

        // Radius (if available)
        "--radius": colorSet.radius,
      };
    } catch (error) {
      console.warn("Failed to extract shadcn colors with overrides:", error);
    }
  }

  // Fallback to basic colors
  const basicColors = extractThemeColors(theme);
  return {
    "--primary": basicColors.primary,
    "--secondary": basicColors.secondary,
    "--accent": basicColors.accent,
    "--background": basicColors.background,
    "--foreground": basicColors.foreground,
  };
}

export function extractShadcnFonts(theme: ThemeData) {
  let extractedFonts: any = {};

  // Helper to process font values with buildFontFamily
  const processFontValue = (
    fontValue: string | undefined,
    category: "sans-serif" | "serif" | "monospace",
  ) => {
    if (!fontValue) return undefined;

    // If already has comma (fallback), use as-is
    if (fontValue.includes(",")) return fontValue;

    // Otherwise use buildFontFamily for proper quotes and fallback
    return buildFontFamily(fontValue, category);
  };

  // First check rawTheme for fonts (tweakcn themes have fonts directly in the palette)
  if (
    "rawTheme" in theme &&
    theme.rawTheme &&
    typeof theme.rawTheme === "object"
  ) {
    const rawTheme = theme.rawTheme as any;

    // Check for nested fonts object first
    if ("fonts" in rawTheme) {
      const fonts = rawTheme.fonts;
      if (fonts) {
        const sansFontValue = processFontValue(
          fonts.sans || fonts.primary,
          "sans-serif",
        );
        const serifFontValue = processFontValue(
          fonts.serif || fonts.secondary,
          "serif",
        );
        const monoFontValue = processFontValue(
          fonts.mono || fonts.code,
          "monospace",
        );

        extractedFonts = {
          "--font-sans": sansFontValue,
          "--font-serif": serifFontValue,
          "--font-mono": monoFontValue,
          fontFamily: sansFontValue,
        };

        // Preload the fonts
        preloadThemeFonts(fonts);
      }
    }

    // Check for font properties directly in light/dark themes (tweakcn structure)
    // Use light mode fonts by default, since that's what we extract colors from too
    const themeData = rawTheme.light || rawTheme.dark || rawTheme;

    if (
      themeData &&
      (themeData["font-sans"] ||
        themeData["font-serif"] ||
        themeData["font-mono"])
    ) {
      const sansFontValue = processFontValue(
        themeData["font-sans"],
        "sans-serif",
      );
      const serifFontValue = processFontValue(themeData["font-serif"], "serif");
      const monoFontValue = processFontValue(
        themeData["font-mono"],
        "monospace",
      );

      extractedFonts = {
        "--font-sans": sansFontValue,
        "--font-serif": serifFontValue,
        "--font-mono": monoFontValue,
        fontFamily: sansFontValue, // Apply sans as default
      };

      // Preload the fonts
      preloadThemeFonts({
        sans: themeData["font-sans"],
        serif: themeData["font-serif"],
        mono: themeData["font-mono"],
      });
    }
  }

  // Fall back to shadcn_override with fonts (database themes)
  const themeWithOverride = theme as any;
  if (themeWithOverride.shadcn_override?.fonts) {
    const fonts = themeWithOverride.shadcn_override.fonts;

    const sansFontValue = processFontValue(fonts.sans, "sans-serif");
    const serifFontValue = processFontValue(fonts.serif, "serif");
    const monoFontValue = processFontValue(fonts.mono, "monospace");

    extractedFonts = {
      "--font-sans": sansFontValue,
      "--font-serif": serifFontValue,
      "--font-mono": monoFontValue,
      fontFamily: sansFontValue, // Apply sans as default
    };

    // Preload the fonts
    preloadThemeFonts(fonts);
  }

  return extractedFonts;
}

// Helper function to preload theme fonts
function preloadThemeFonts(fonts: any) {
  if (typeof window === "undefined") return;

  try {
    // Preload sans-serif font
    if (fonts.sans) {
      const sansFamily = fonts.sans.split(",")[0].trim().replace(/['"]/g, "");
      loadGoogleFont(sansFamily, ["400", "500", "600"]);
    }

    // Preload serif font
    if (fonts.serif) {
      const serifFamily = fonts.serif.split(",")[0].trim().replace(/['"]/g, "");
      loadGoogleFont(serifFamily, ["400", "600"]);
    }

    // Preload mono font
    if (fonts.mono) {
      const monoFamily = fonts.mono.split(",")[0].trim().replace(/['"]/g, "");
      loadGoogleFont(monoFamily, ["400", "500"]);
    }
  } catch (error) {
    console.warn("Failed to preload theme fonts:", error);
  }
}

export function extractShadcnShadows(theme: ThemeData, isDark = false) {
  // First check for shadcn_override with shadows (database themes)
  const themeWithOverride = theme as any;
  const mode = isDark ? "dark" : "light";

  // Check for mode-specific shadows in normalized format
  if (themeWithOverride.shadcn_override?.shadows?.[mode]) {
    const shadows = themeWithOverride.shadcn_override.shadows[mode];

    // Create tokens object for computeShadowVars utility
    const shadowTokens = {
      "shadow-color": shadows.color,
      "shadow-opacity": shadows.opacity,
      "shadow-offset-x": shadows.offsetX,
      "shadow-offset-y": shadows.offsetY,
      "shadow-blur": shadows.blur,
      "shadow-spread": shadows.spread,
    };

    // Use the existing utility to generate all shadow variants
    const computedShadows = computeShadowVars(shadowTokens);

    // Convert to CSS custom properties format and include shadow-color
    const result: any = {
      "--shadow-color": shadows.color,
    };
    Object.entries(computedShadows).forEach(([key, value]) => {
      result[`--${key}`] = value;
    });

    return result;
  }

  let shadcnTheme;

  // Check if theme has rawTheme with shadcn format (tweakcn themes)
  if (
    "rawTheme" in theme &&
    theme.rawTheme &&
    "light" in theme.rawTheme &&
    typeof theme.rawTheme.light === "object" &&
    "background" in theme.rawTheme.light
  ) {
    // Already in shadcn format (tweakcn)
    shadcnTheme = theme.rawTheme as any;
  } else if ("rawTheme" in theme && theme.rawTheme) {
    // Tinte format - needs conversion
    try {
      shadcnTheme = convertTinteToShadcn(theme.rawTheme);
    } catch (error) {
      console.warn("Failed to convert tinte theme:", error);
      shadcnTheme = null;
    }
  }

  if (shadcnTheme) {
    const colorSet = isDark ? shadcnTheme.dark : shadcnTheme.light;

    const result: any = {
      "--shadow-2xs": colorSet["shadow-2xs"],
      "--shadow-xs": colorSet["shadow-xs"],
      "--shadow-sm": colorSet["shadow-sm"],
      "--shadow": colorSet.shadow,
      "--shadow-md": colorSet["shadow-md"],
      "--shadow-lg": colorSet["shadow-lg"],
      "--shadow-xl": colorSet["shadow-xl"],
      "--shadow-2xl": colorSet["shadow-2xl"],
    };

    // Add shadow color if available
    if (colorSet["shadow-color"]) {
      result["--shadow-color"] = colorSet["shadow-color"];
    }

    return result;
  }

  // Fallback shadows
  return {
    "--shadow-2xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "--shadow-xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "--shadow-sm":
      "0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "--shadow":
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "--shadow-md":
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "--shadow-lg":
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "--shadow-xl":
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "--shadow-2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  };
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}
