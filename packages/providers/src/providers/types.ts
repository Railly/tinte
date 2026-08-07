import type { TinteTheme } from "@tinte/core";

export interface ProviderOutput {
  content: string;
  filename: string;
  mimeType: string;
}

export interface ProviderMetadata {
  id: string;
  name: string;
  description?: string;
  category: "editor" | "terminal" | "ui" | "design" | "other";
  tags: string[];
  website?: string;
  documentation?: string;
  experimental?: boolean;
}

export interface ThemeProvider<TOutput = any> {
  readonly metadata: ProviderMetadata;
  readonly fileExtension: string;
  readonly mimeType: string;

  convert(theme: TinteTheme): TOutput;
  export(theme: TinteTheme, filename?: string): ProviderOutput;
  validate?(output: TOutput): boolean;
}

/**
 * A provider plus the React surface the web app renders for it.
 *
 * Everything visual lives here and nowhere else. `ThemeProvider` and the
 * modules under `./providers/` must stay importable from Node without React,
 * so the CLI can bundle them. Import this only from the web app.
 */
export interface PreviewableProvider<TOutput = any>
  extends ThemeProvider<TOutput> {
  icon?: React.ComponentType<{ className?: string }>;
  preview: {
    component: React.ComponentType<{ theme: TOutput; className?: string }>;
    defaultProps?: Record<string, any>;
  };
}

export type ThemeMode = "light" | "dark";
