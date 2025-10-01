export interface FontOverrides {
  sans?: string;
  serif?: string;
  mono?: string;
}

export interface RadiusOverrides {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}

export interface ShadowOverrides {
  color?: string;
  opacity?: string;
  blur?: string;
  spread?: string;
  offsetX?: string;
  offsetY?: string;
}

export interface PaletteOverrides {
  [key: string]: string;
}

export interface ProviderOverride {
  light?: PaletteOverrides;
  dark?: PaletteOverrides;
  fonts?: FontOverrides;
  radius?: RadiusOverrides | string;
  shadows?: ShadowOverrides;
  letter_spacing?: string;
}

export interface NormalizedOverrides {
  shadcn?: ProviderOverride;
  vscode?: ProviderOverride;
  shiki?: ProviderOverride;
}

export type OverrideKey =
  | `${string}-font-${"sans" | "serif" | "mono"}`
  | `${string}-radius${"-sm" | "-md" | "-lg" | "-xl" | ""}`
  | `${string}-shadow-${"color" | "opacity" | "blur" | "spread" | "offsetX" | "offsetY"}`
  | `${string}-letter-spacing`
  | `${string}-${string}`;

export const PALETTE_COLOR_PATTERNS = [
  "color", "background", "foreground", "border", "ring",
  "primary", "secondary", "accent", "destructive", "muted",
  "card", "popover", "sidebar", "chart"
] as const;

export function isPaletteColor(key: string): boolean {
  return PALETTE_COLOR_PATTERNS.some(pattern => key.includes(pattern));
}

export function getOverrideCategory(key: string): "palette" | "font" | "radius" | "shadow" | "spacing" {
  if (key.includes("font")) return "font";
  if (key.includes("radius")) return "radius";
  if (key.includes("shadow")) return "shadow";
  if (key === "letter-spacing") return "spacing";
  return "palette";
}
