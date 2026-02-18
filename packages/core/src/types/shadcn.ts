export type ColorToken =
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "muted"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "destructive-foreground"
  | "border"
  | "input"
  | "ring"
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "sidebar"
  | "sidebar-foreground"
  | "sidebar-primary"
  | "sidebar-primary-foreground"
  | "sidebar-accent"
  | "sidebar-accent-foreground"
  | "sidebar-border"
  | "sidebar-ring";

export type FontToken = "font-sans" | "font-mono" | "font-serif";
export type BaseVarToken = "radius" | "letter-spacing";

export type ShadcnBlock = Record<ColorToken, string>;
export type FontBlock = Record<FontToken, string>;

export type ShadcnTheme = {
  light: ShadcnBlock;
  dark: ShadcnBlock;
};

export const DEFAULT_FONTS: FontBlock = {
  "font-sans": "Inter, ui-sans-serif, system-ui, sans-serif",
  "font-mono": "JetBrains Mono, ui-monospace, SFMono-Regular, monospace",
  "font-serif": 'Georgia, Cambria, "Times New Roman", serif',
};

export const DEFAULT_BASE: Record<BaseVarToken, string> = {
  radius: "10px",
  "letter-spacing": "0em",
};
