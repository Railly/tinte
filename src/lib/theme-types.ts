import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import {
  theme,
  shadcnOverrideSchema,
  type ShadcnOverrideSchema,
} from "@/db/schema/theme";
import type { TinteBlock } from "@/types/tinte";
import type { ShikiCssTheme } from "@/types/shiki";

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

export interface ThemeOverrides {
  shadcn?: {
    light?: Partial<ShadcnOverrideSchema>;
    dark?: Partial<ShadcnOverrideSchema>;
  };
  vscode?: {
    light?: VSCodeOverride;
    dark?: VSCodeOverride;
  };
  shiki?: {
    light?: ShikiCssTheme;
    dark?: ShikiCssTheme;
  };
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

  // Structured overrides
  overrides?: ThemeOverrides;
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
  rawTheme?: any;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  overrides?: ThemeOverrides;
  isFavorite?: boolean;
  is_public?: boolean;
}

// Export schema types for validation
export { shadcnOverrideSchema, type ShadcnOverrideSchema };
