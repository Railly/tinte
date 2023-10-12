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
