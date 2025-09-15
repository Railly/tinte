export type ThemeMode = "light" | "dark";
export type ProviderType = "shadcn" | "vscode" | "shiki";

export interface ThemeOverrides {
  shadcn?: Record<string, any>;
  vscode?: Record<string, any>;
  shiki?: Record<string, any>;
}

export interface ThemeOwnershipInfo {
  isOwnTheme: boolean;
  isUserOwnedTheme: boolean;
  shouldCreateCustomTheme: boolean;
}

export interface ProcessedThemeUpdate {
  updatedTheme: any;
  processedTokens: Record<string, string>;
  overrides: ThemeOverrides;
}