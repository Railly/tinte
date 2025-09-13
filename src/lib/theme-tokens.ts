export interface ThemeData {
  id: string;
  name: string;
  description: string;
  author: string;
  provider: "tweakcn" | "rayso" | "tinte";
  downloads: number;
  likes: number;
  views: number;
  createdAt: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  tags: string[];
  rawTheme?: any;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

export interface TinteThemeData extends ThemeData {
  computedTokens?: {
    light: ThemeColors;
    dark?: ThemeColors;
  };
}
