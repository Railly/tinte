import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  type ShadcnOverrideSchema,
  shadcnOverrideSchema,
  type theme,
} from "@/db/schema/theme";
import type { NormalizedOverrides } from "@tinte/core";
import type { TinteBlock, TinteTheme } from "@tinte/core";

// Base theme types from Drizzle schema (single source of truth)
export type Theme = InferSelectModel<typeof theme>;
export type ThemeInsert = InferInsertModel<typeof theme>;

// VS Code theme override structure
export interface VSCodeOverride {
  colors?: Record<string, string>;
  tokenColors?: Array<{
    name?: string;
    scope: string | string[];
    settings: {
      foreground?: string;
      background?: string;
      fontStyle?: string;
    };
  }>;
}

// Core color palette interface
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

// Extended theme with computed properties and metadata
export interface ThemeWithMetadata extends Theme {
  // Computed properties
  colors: ThemeColors;
  rawTheme: {
    light: TinteBlock;
    dark: TinteBlock;
  };

  // Display metadata
  author: string;
  description: string;
  tags: string[];

  // Provider metadata to match ProviderThemeData
  provider: "tweakcn" | "rayso" | "tinte";
  downloads: number;
  likes: number;
  createdAt: string;

  // User context
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isFavorite?: boolean;

  overrides?: NormalizedOverrides;
}

// Theme transformation options for service layer
export interface ThemeTransformOptions {
  author?: string;
  description?: string;
  tags?: string[];
  isFavorite?: boolean;
  likes?: number;
  downloads?: number;
}

// Provider-specific theme data (for external integrations)
export interface ProviderThemeData {
  id: string;
  slug?: string;
  user_id?: string | null;
  name: string;
  description: string;
  concept?: string | null;
  author: string;
  provider: "tweakcn" | "rayso" | "tinte";
  downloads: number;
  likes: number;
  installs: number;
  createdAt: string;
  colors: ThemeColors;
  tags: string[];
  rawTheme?: TinteTheme;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  overrides?: NormalizedOverrides;
  isFavorite?: boolean;
  is_public?: boolean;
}

// Export schema types for validation
export { shadcnOverrideSchema, type ShadcnOverrideSchema };
