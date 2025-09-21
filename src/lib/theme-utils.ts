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
  // Safety check for theme
  if (!theme) {
    return DEFAULT_THEME.computedTokens;
  }

  if ((theme as any).computedTokens) {
    const tokens = (theme as any).computedTokens;
    // Ensure the tokens have the required structure
    if (tokens.light && tokens.dark) {
      return {
        light: tokens.light || {},
        dark: tokens.dark || {},
      };
    }
  }

  let computedTokens: { light: any; dark: any };

  // Check if we have shadcn overrides (this should take precedence)
  // First check if overrides are already structured (from transformOverridesFromDb)
  const structuredOverrides = (theme as any).overrides?.shadcn;
  if (structuredOverrides?.light?.palettes) {
    computedTokens = {
      light: structuredOverrides.light.palettes.light || {},
      dark: structuredOverrides.light.palettes.dark || {},
    };
  }
  // Then check direct shadcn_override from database (this is the most common case for TweakCN themes)
  else if ((theme as any).shadcn_override?.palettes) {
    computedTokens = {
      light: (theme as any).shadcn_override.palettes.light || {},
      dark: (theme as any).shadcn_override.palettes.dark || {},
    };
  }
  // Fallback to old format for backwards compatibility
  else if ((theme as any).shadcn_overrides) {
    const overrides = (theme as any).shadcn_overrides;
    computedTokens = {
      light: overrides.light || {},
      dark: overrides.dark || {},
    };
  } else if (theme.rawTheme) {
    try {
      const shadcnTheme = convertTheme("shadcn", theme.rawTheme) as ShadcnTheme;
      if (shadcnTheme && shadcnTheme.light && shadcnTheme.dark) {
        computedTokens = {
          light: shadcnTheme.light,
          dark: shadcnTheme.dark,
        };
      } else {
        computedTokens = DEFAULT_THEME.computedTokens;
      }
    } catch (error) {
      console.warn("Error converting theme to shadcn:", error);
      computedTokens = DEFAULT_THEME.computedTokens;
    }
  } else {
    computedTokens = DEFAULT_THEME.computedTokens;
  }

  // Final safety check to ensure we always return valid objects
  return {
    light: computedTokens.light || {},
    dark: computedTokens.dark || {},
  };
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
