import { TinteTheme } from "@/types/tinte";

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
  icon?: React.ComponentType<{ className?: string }>;
  website?: string;
  documentation?: string;
}

export interface ThemeProvider<TOutput = any> {
  readonly metadata: ProviderMetadata;
  readonly fileExtension: string;
  readonly mimeType: string;

  convert(theme: TinteTheme): TOutput;
  export(theme: TinteTheme, filename?: string): ProviderOutput;
  validate?(output: TOutput): boolean;
}

export interface PreviewableProvider<TOutput = any>
  extends ThemeProvider<TOutput> {
  preview: {
    component: React.ComponentType<{ theme: TOutput; className?: string }>;
    defaultProps?: Record<string, any>;
    showDock?: boolean;
  };
}

export type ThemeMode = "light" | "dark";
