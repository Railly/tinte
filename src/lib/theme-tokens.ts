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
}
