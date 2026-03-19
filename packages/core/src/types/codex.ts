export interface CodexThemeBlock {
  accent: string;
  contrast: number;
  fonts: { code: string | null; ui: string | null };
  ink: string;
  opaqueWindows: boolean;
  semanticColors: {
    diffAdded: string;
    diffRemoved: string;
    skill: string;
  };
  surface: string;
}

export interface CodexThemeEntry {
  codeThemeId: string;
  theme: CodexThemeBlock;
  variant: "light" | "dark";
}

export interface CodexTheme {
  light: CodexThemeEntry;
  dark: CodexThemeEntry;
}
