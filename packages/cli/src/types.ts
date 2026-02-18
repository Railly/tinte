export interface TinteTheme {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export interface EditorInstallOptions {
  autoClose?: boolean;
  variant?: "light" | "dark";
  timeout?: number;
  editor?: "code" | "cursor" | "zed";
}
