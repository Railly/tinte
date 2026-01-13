// Re-export unified types from theme-types for backwards compatibility
export type {
  Theme,
  ThemeColors,
  ThemeTransformOptions,
  ThemeWithMetadata,
  VSCodeOverride,
} from "@/lib/theme";

import type { Theme, ThemeWithMetadata } from "@/lib/theme";

// Legacy compatibility (deprecated - use Theme instead)
export type DbTheme = Theme;

// Legacy compatibility (deprecated - use ThemeWithMetadata instead)
export type UserThemeData = ThemeWithMetadata;
