// Re-export unified types from theme-types
export type {
  ProviderThemeData,
  Theme,
  ThemeColors,
  ThemeOverrides,
  ThemeTransformOptions,
  ThemeWithMetadata,
} from "@/lib/theme-types";

import type { ProviderThemeData, ThemeColors } from "@/lib/theme-types";

// Legacy compatibility (deprecated - use ProviderThemeData instead)
export type ThemeData = ProviderThemeData;

// Legacy compatibility (deprecated - use ThemeWithMetadata instead)
export interface TinteThemeData extends ProviderThemeData {
  computedTokens?: {
    light: ThemeColors;
    dark?: ThemeColors;
  };
}
