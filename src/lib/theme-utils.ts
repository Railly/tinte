"use client";

import type { ShadcnTheme } from "@/types/shadcn";
import type { TinteTheme } from "@/types/tinte";
import { DEFAULT_THEME } from "@/utils/default-theme";
import {
  downloadFile,
  downloadJSON,
  downloadMultipleFiles,
} from "./file-download";
import {
  convertAllThemes,
  convertTheme,
  exportAllThemes,
  exportTheme,
  getAvailableProviders,
  getPreviewableProvider,
  getPreviewableProviders,
  getProvider,
} from "./providers";
import type { ThemeData } from "./theme-tokens";

export type ThemeMode = "light" | "dark";

export function computeThemeTokens(theme: ThemeData): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  console.log("📊 computeThemeTokens called with theme:", theme);

  // Safety check for theme
  if (!theme) {
    return DEFAULT_THEME.computedTokens;
  }

  // Extract color properties, filtering out font, shadow, and other non-color properties
  const filterColorProperties = (obj: any) => {
    const colorProps = {};
    for (const [key, value] of Object.entries(obj || {})) {
      // Include all properties that are color-related (exclude font, shadow, radius properties)
      if (!key.startsWith('font-') &&
          !key.startsWith('shadow-') &&
          key !== 'radius' &&
          typeof value === 'string') {
        colorProps[key] = value;
      }
    }
    return colorProps;
  };

  // Step 1: Start with converting rawTheme if available
  let baseTokens: { light: any; dark: any } | null = null;

  if (theme.rawTheme) {
    try {
      console.log("Converting rawTheme to shadcn format:", theme.rawTheme);
      const shadcnTheme = convertTheme("shadcn", theme.rawTheme) as ShadcnTheme;
      if (shadcnTheme && shadcnTheme.light && shadcnTheme.dark) {
        console.log("Successfully converted rawTheme to shadcn:", shadcnTheme);
        baseTokens = {
          light: shadcnTheme.light,
          dark: shadcnTheme.dark,
        };
      }
    } catch (error) {
      console.warn("Error converting theme to shadcn:", error);
    }
  }

  // Step 2: Apply overrides granularly if they exist
  if ((theme as any).shadcn_override?.palettes) {
    const palettes = (theme as any).shadcn_override.palettes;
    const hasValidPalettes = (palettes.light && Object.keys(palettes.light).length > 0) ||
                            (palettes.dark && Object.keys(palettes.dark).length > 0);

    if (hasValidPalettes) {
      console.log("Applying shadcn_override.palettes with granular precedence");

      // Start with base tokens or empty objects
      const lightTokens = { ...(baseTokens?.light || {}) };
      const darkTokens = { ...(baseTokens?.dark || {}) };

      // Override with filtered color properties from overrides
      const lightOverrides = filterColorProperties(palettes.light);
      const darkOverrides = filterColorProperties(palettes.dark);

      // Apply overrides granularly (individual properties override base)
      Object.assign(lightTokens, lightOverrides);
      Object.assign(darkTokens, darkOverrides);

      const computedTokens = {
        light: lightTokens,
        dark: darkTokens,
      };

      console.log("Final computedTokens with overrides applied:", computedTokens);
      return computedTokens;
    }
  }

  // Step 3: Return base tokens if we have them, otherwise default
  if (baseTokens) {
    console.log("Using base tokens from rawTheme conversion");
    return baseTokens;
  }

  console.log("No valid theme data found, using default");
  return DEFAULT_THEME.computedTokens;
}

export function extractThemeColors(
  theme: ThemeData,
  mode: ThemeMode = "light",
): Record<string, string> {
  // Safety check for theme
  if (!theme) {
    return {
      primary: "#000000",
      secondary: "#666666",
      accent: "#0066cc",
      background: "#ffffff",
      foreground: "#000000",
    };
  }

  // Check if theme already has colors property (direct color extraction)
  if ((theme as any).colors) {
    const themeColors = (theme as any).colors;
    return {
      primary: themeColors.primary || "#000000",
      secondary: themeColors.secondary || "#666666",
      accent: themeColors.accent || "#0066cc",
      background: themeColors.background || "#ffffff",
      foreground: themeColors.foreground || "#000000",
    };
  }

  try {
    const computed = computeThemeTokens(theme);
    const tokens = computed?.[mode];

    if (!tokens) {
      // Fallback to rawTheme if computeThemeTokens fails
      if (theme.rawTheme?.[mode]) {
        const rawTokens = theme.rawTheme[mode];
        return {
          primary: rawTokens.pr || "#000000",
          secondary: rawTokens.sc || "#666666",
          accent: rawTokens.ac_1 || "#0066cc",
          background: rawTokens.bg || "#ffffff",
          foreground: rawTokens.tx || "#000000",
        };
      }

      // Final fallback
      return {
        primary: "#000000",
        secondary: "#666666",
        accent: "#0066cc",
        background: "#ffffff",
        foreground: "#000000",
      };
    }

    return {
      primary: tokens.primary || "#000000",
      secondary: tokens.secondary || "#666666",
      accent: tokens.accent || "#0066cc",
      background: tokens.background || "#ffffff",
      foreground: tokens.foreground || "#000000",
    };
  } catch (error) {
    console.warn("Error extracting theme colors:", error);

    // Try fallback to rawTheme direct access
    if (theme.rawTheme?.[mode]) {
      const rawTokens = theme.rawTheme[mode];
      return {
        primary: rawTokens.pr || "#000000",
        secondary: rawTokens.sc || "#666666",
        accent: rawTokens.ac_1 || "#0066cc",
        background: rawTokens.bg || "#ffffff",
        foreground: rawTokens.tx || "#000000",
      };
    }

    // Final fallback
    return {
      primary: "#000000",
      secondary: "#666666",
      accent: "#0066cc",
      background: "#ffffff",
      foreground: "#000000",
    };
  }
}

export function useThemeAdapters() {
  const availableProviders = getAvailableProviders();
  const previewableProviders = getPreviewableProviders();

  return {
    availableProviders,
    previewableProviders,

    convertTheme: <T>(providerId: string, theme: TinteTheme): T | null => {
      return convertTheme(providerId, theme) as T | null;
    },

    exportTheme: (providerId: string, theme: TinteTheme, filename?: string) => {
      return exportTheme(providerId, theme, filename);
    },

    convertAllThemes: (theme: TinteTheme) => {
      return convertAllThemes(theme);
    },

    exportAllThemes: (theme: TinteTheme) => {
      return exportAllThemes(theme);
    },

    getProvider: (providerId: string) => {
      return getProvider(providerId);
    },

    getPreviewableProvider: (providerId: string) => {
      return getPreviewableProvider(providerId);
    },
  };
}

export function useThemeExport(theme: TinteTheme) {
  const adapters = useThemeAdapters();

  const handleExportAll = () => {
    const allExports = adapters.exportAllThemes(theme);
    const files = Object.entries(allExports).map(([_, exportResult]) => ({
      content: exportResult.content,
      filename: exportResult.filename,
      mimeType: exportResult.mimeType,
    }));
    downloadMultipleFiles(files);
  };

  const handleExportTinte = () => {
    downloadJSON(theme, "tinte-theme");
  };

  const handleExport = (adapterId: string) => {
    const exportResult = adapters.exportTheme(adapterId, theme);
    if (exportResult) {
      downloadFile({
        content: exportResult.content,
        filename: exportResult.filename,
        mimeType: exportResult.mimeType,
      });
    }
  };

  return {
    handleExport,
    handleExportAll,
    handleExportTinte,
    ...adapters,
  };
}
