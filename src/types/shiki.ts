export interface ShikiCssTheme {
  name: string;
  variables: Record<string, string>;
}

export interface ShikiTheme {
  light: ShikiCssTheme;
  dark: ShikiCssTheme;
}