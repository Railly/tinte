export const STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export type Step = (typeof STEPS)[number];

// ---- Colors (semantic)
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

// ---- Non-color tokens
export type FontToken = "font-sans" | "font-mono" | "font-serif";

// Base vars that produce computed tokens in your @theme inline block
export type BaseVarToken = "radius" | "letter-spacing";

// Shadow properties (replacing old shadow tokens)
export type ShadowToken =
  | "shadow-color"
  | "shadow-opacity"
  | "shadow-blur"
  | "shadow-spread"
  | "shadow-offset-x"
  | "shadow-offset-y";

// Read-only computed names (shown in UI, not stored)
export type RadiusComputed =
  | "radius-sm"
  | "radius-md"
  | "radius-lg"
  | "radius-xl";
export type TrackingComputed =
  | "tracking-tighter"
  | "tracking-tight"
  | "tracking-normal"
  | "tracking-wide"
  | "tracking-wider"
  | "tracking-widest";

// ---- Blocks by kind
export type ShadcnBlock = Record<ColorToken, string>;
export type FontBlock = Record<FontToken, string>;
export type ShadowBlock = Record<ShadowToken, string>;
export type BaseVars = Record<BaseVarToken, string>; // e.g. { radius: '10px', 'letter-spacing': '0em' }

// Everything per mode (light/dark) so theming can diverge if needed
export type ModeBundle = {
  colors: ShadcnBlock;
  fonts: FontBlock;
  base: BaseVars; // feeds radius-* and tracking-* via @theme inline
  shadows: ShadowBlock;
};

export type FullTheme = {
  light: ModeBundle;
  dark: ModeBundle;
};

// Backward compatibility - keep existing ShadcnTheme as is for now
export type ShadcnTheme = {
  light: ShadcnBlock;
  dark: ShadcnBlock;
};

// Token groups for UI organization
export const TOKEN_GROUPS = [
  {
    label: "Background & Text",
    keys: [
      "background",
      "foreground",
      "muted",
      "muted-foreground",
    ] as ColorToken[],
  },
  {
    label: "Surfaces",
    keys: [
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
    ] as ColorToken[],
  },
  {
    label: "Interactive",
    keys: [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
    ] as ColorToken[],
  },
  {
    label: "Forms & States",
    keys: [
      "border",
      "input",
      "ring",
      "destructive",
      "destructive-foreground",
    ] as ColorToken[],
  },
  {
    label: "Charts",
    keys: [
      "chart-1",
      "chart-2",
      "chart-3",
      "chart-4",
      "chart-5",
    ] as ColorToken[],
  },
  {
    label: "Sidebar",
    keys: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ] as ColorToken[],
  },
] as const;

export const NON_COLOR_GROUPS = {
  Fonts: ["font-sans", "font-mono", "font-serif"] as FontToken[],
  Radius: {
    editable: ["radius" as const],
    computed: [
      "radius-sm",
      "radius-md",
      "radius-lg",
      "radius-xl",
    ] as RadiusComputed[],
  },
  Shadows: [
    "shadow-color",
    "shadow-opacity",
    "shadow-blur",
    "shadow-spread",
    "shadow-offset-x",
    "shadow-offset-y",
  ] as ShadowToken[],
  Tracking: {
    editable: ["letter-spacing" as const],
    computed: [
      "tracking-tighter",
      "tracking-tight",
      "tracking-normal",
      "tracking-wide",
      "tracking-wider",
      "tracking-widest",
    ] as TrackingComputed[],
  },
};

// Default values for new token types
export const DEFAULT_FONTS: FontBlock = {
  "font-sans": "Inter, ui-sans-serif, system-ui, sans-serif",
  "font-mono": "JetBrains Mono, ui-monospace, SFMono-Regular, monospace",
  "font-serif": 'Georgia, Cambria, "Times New Roman", serif',
};

export const DEFAULT_BASE: BaseVars = {
  radius: "10px", // feeds radius-sm/md/lg/xl in @theme inline
  "letter-spacing": "0em", // feeds tracking-*
};

export const DEFAULT_SHADOWS: ShadowBlock = {
  "shadow-color": "hsl(0 0% 0%)",
  "shadow-opacity": "0.1",
  "shadow-blur": "4px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "2px",
};
