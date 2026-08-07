import type { TinteBlock } from "@tinte/core";

export interface TinteTheme {
  light: TinteBlock;
  dark: TinteBlock;
}

export interface EditorInstallOptions {
  autoClose?: boolean;
  variant?: "light" | "dark";
  timeout?: number;
  editor?: "code" | "cursor" | "zed";
}
