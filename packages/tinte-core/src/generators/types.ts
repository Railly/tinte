import { Color } from "../utils/color";

export type ThemeType = "light" | "dark";

export type VSCodeTokenColor = {
  name: string;
  scope: string | string[];
  settings: {
    foreground: string;
    fontStyle?: string;
  };
};

export type VSCodeTheme = {
  name: string;
  type: string;
  colors: {
    [key: string]: string;
  };
  tokenColors: VSCodeTokenColor[];
};

export type ITerm2Key =
  | "Ansi 0 Color"
  | "Ansi 1 Color"
  | "Ansi 2 Color"
  | "Ansi 3 Color"
  | "Ansi 4 Color"
  | "Ansi 5 Color"
  | "Ansi 6 Color"
  | "Ansi 7 Color"
  | "Ansi 8 Color"
  | "Ansi 9 Color"
  | "Ansi 10 Color"
  | "Ansi 11 Color"
  | "Ansi 12 Color"
  | "Ansi 13 Color"
  | "Ansi 14 Color"
  | "Ansi 15 Color"
  | "Background Color"
  | "Bold Color"
  | "Cursor Color"
  | "Cursor Text Color"
  | "Foreground Color"
  | "Link Color"
  | "Selected Text Color"
  | "Selection Color";

export type iTerm2Theme = Record<ITerm2Key, Color>;
