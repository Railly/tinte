"use client";

import type { ShadcnTheme } from "@/types/shadcn";
import type { TinteTheme } from "@/types/tinte";
import { DEFAULT_THEME } from "@/utils/default-theme";
import {
  downloadFile,
  downloadJSON,
  downloadMultipleFiles,
} from "@/lib/file-download";
import {
  convertAllThemes,
  convertTheme,
  exportAllThemes,
  exportTheme,
  getAvailableProviders,
  getPreviewableProvider,
  getPreviewableProviders,
  getProvider,
} from "../providers";
import type { ThemeData } from "./tokens";

export type ThemeMode = "light" | "dark";

export function computeThemeTokens(theme: ThemeData): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  // Safety check for theme
  if (!theme) {
    return DEFAULT_THEME.computedTokens;
  }

  // Extract color properties, filtering out font, shadow, and other non-color properties
  const filterColorProperties = (obj: any) => {
    const colorProps: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj || {})) {
      // Include all properties that are color-related (exclude font, shadow, radius properties)
      if (
        !key.startsWith("font-") &&
        !key.startsWith("shadow-") &&
        key !== "radius" &&
        typeof value === "string"
      ) {
        colorProps[key] = value;
      }
    }
    return colorProps;
  };

  // Step 1: Start with converting rawTheme if available
  let baseTokens: { light: any; dark: any } | null = null;

  if (theme.rawTheme) {
    try {
      const shadcnTheme = convertTheme("shadcn", theme.rawTheme) as ShadcnTheme;
      if (shadcnTheme?.light && shadcnTheme.dark) {
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
    const hasValidPalettes =
      (palettes.light && Object.keys(palettes.light).length > 0) ||
      (palettes.dark && Object.keys(palettes.dark).length > 0);

    if (hasValidPalettes) {
      // Start with base tokens or empty objects
      const lightTokens = { ...(baseTokens?.light || {}) };
      const darkTokens = { ...(baseTokens?.dark || {}) };

      // Override with filtered color properties from overrides
      const lightOverrides = filterColorProperties(palettes.light);
      const darkOverrides = filterColorProperties(palettes.dark);

      // Apply overrides granularly (individual properties override base)
      Object.assign(lightTokens, lightOverrides);
      Object.assign(darkTokens, darkOverrides);

      return {
        light: lightTokens,
        dark: darkTokens,
      };
    }
  }

  // Step 3: If no rawTheme but we have individual database columns, convert them
  if (!baseTokens && (theme as any).light_bg) {
    try {
      const dbTheme = theme as any;
      const rawTheme = {
        light: {
          bg: dbTheme.light_bg,
          bg_2: dbTheme.light_bg_2,
          ui: dbTheme.light_ui,
          ui_2: dbTheme.light_ui_2,
          ui_3: dbTheme.light_ui_3,
          tx: dbTheme.light_tx,
          tx_2: dbTheme.light_tx_2,
          tx_3: dbTheme.light_tx_3,
          pr: dbTheme.light_pr,
          sc: dbTheme.light_sc,
          ac_1: dbTheme.light_ac_1,
          ac_2: dbTheme.light_ac_2,
          ac_3: dbTheme.light_ac_3,
        },
        dark: {
          bg: dbTheme.dark_bg,
          bg_2: dbTheme.dark_bg_2,
          ui: dbTheme.dark_ui,
          ui_2: dbTheme.dark_ui_2,
          ui_3: dbTheme.dark_ui_3,
          tx: dbTheme.dark_tx,
          tx_2: dbTheme.dark_tx_2,
          tx_3: dbTheme.dark_tx_3,
          pr: dbTheme.dark_pr,
          sc: dbTheme.dark_sc,
          ac_1: dbTheme.dark_ac_1,
          ac_2: dbTheme.dark_ac_2,
          ac_3: dbTheme.dark_ac_3,
        },
      };

      const shadcnTheme = convertTheme("shadcn", rawTheme) as ShadcnTheme;
      if (shadcnTheme?.light && shadcnTheme.dark) {
        baseTokens = {
          light: shadcnTheme.light,
          dark: shadcnTheme.dark,
        };
      }
    } catch (error) {
      console.warn("Error converting database theme:", error);
    }
  }

  // Step 4: Return base tokens if we have them, otherwise default
  if (baseTokens) {
    return baseTokens;
  }

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
  // Note: This path should not be used for mode-aware themes
  // Skip this and let it fall through to computed/rawTheme which are mode-aware

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
