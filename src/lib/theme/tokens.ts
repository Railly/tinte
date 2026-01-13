// Re-export unified types from types
export type {
  ProviderThemeData,
  Theme,
  ThemeColors,
  ThemeTransformOptions,
  ThemeWithMetadata,
} from "./types";

import type { ProviderThemeData, ThemeColors } from "./types";

// Legacy compatibility (deprecated - use ProviderThemeData instead)
export type ThemeData = ProviderThemeData;

// Legacy compatibility (deprecated - use ThemeWithMetadata instead)
export interface TinteThemeData extends ProviderThemeData {
  computedTokens?: {
    light: ThemeColors;
    dark?: ThemeColors;
  };
}
