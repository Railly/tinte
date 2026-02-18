export interface ThemeColors {
  background: string;
  foreground: string;
  editorBackground: string;
  editorForeground: string;
  lineNumberForeground: string;
  selectionBackground: string;
  editorGroupHeaderBackground: string;
  titleBarBackground: string;
  titleBarForeground: string;
  progressBarBackground: string;
  cursorColor: string;
}

export interface AnimatedIdeSettings {
  theme: string;
  mode: "light" | "dark";
}

export interface AnimatedIdeStep {
  code: string;
  fileName: string;
  filePath: string[];
  lang: string;
  meta?: string;
}

export interface AnimatedIdeProps {
  steps: AnimatedIdeStep[];
  settings: AnimatedIdeSettings;
  durationPerStep: number;
  transitionDuration: number;
}
