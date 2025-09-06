export type Step =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;
export const STEPS: Step[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

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

// Shadows are direct vars (you may compute them elsewhere if you want)
export type ShadowToken =
  | "shadow-2xs"
  | "shadow-xs"
  | "shadow-sm"
  | "shadow"
  | "shadow-md"
  | "shadow-lg"
  | "shadow-xl"
  | "shadow-2xl";

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
    label: "Surface",
    keys: [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "border",
      "input",
      "ring",
    ] as ColorToken[],
  },
  { label: "Primary", keys: ["primary", "primary-foreground"] as ColorToken[] },
  {
    label: "Secondary",
    keys: [
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "destructive-foreground",
    ] as ColorToken[],
  },
  { label: "Text", keys: ["muted", "muted-foreground"] as ColorToken[] },
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
    "shadow-2xs",
    "shadow-xs",
    "shadow-sm",
    "shadow",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "shadow-2xl",
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
  "shadow-2xs": "0 1px 1px rgba(0,0,0,.05)",
  "shadow-xs": "0 1px 2px rgba(0,0,0,.06)",
  "shadow-sm": "0 1px 3px rgba(0,0,0,.1)",
  shadow: "0 1px 4px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.08)",
  "shadow-md": "0 2px 8px rgba(0,0,0,.15)",
  "shadow-lg": "0 4px 16px rgba(0,0,0,.18)",
  "shadow-xl": "0 8px 24px rgba(0,0,0,.22)",
  "shadow-2xl": "0 12px 40px rgba(0,0,0,.28)",
};
