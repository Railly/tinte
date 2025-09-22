// Re-export unified types from theme-types for backwards compatibility
export type {
  Theme,
  ThemeWithMetadata,
  ThemeColors,
  ThemeOverrides,
  VSCodeOverride,
  ThemeTransformOptions,
} from "@/lib/theme-types";

import type { Theme, ThemeWithMetadata } from "@/lib/theme-types";

// Legacy compatibility (deprecated - use Theme instead)
export type DbTheme = Theme;

// Legacy compatibility (deprecated - use ThemeWithMetadata instead)
export type UserThemeData = ThemeWithMetadata;