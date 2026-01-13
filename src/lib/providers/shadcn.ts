import { formatHex, oklch } from "culori";
import { ShadcnPreview } from "@/components/preview/shadcn/shadcn-preview";
import { ShadcnIcon } from "@/components/shared/icons/shadcn";
import {
  DEFAULT_BASE,
  DEFAULT_FONTS,
  type ShadcnBlock,
  type ShadcnTheme,
} from "@/types/shadcn";
import type { TinteBlock, TinteTheme } from "@/types/tinte";
import { getBestTextColor } from "../color-utils";
import { generateTailwindPalette } from "../palette-generator";
import type { PreviewableProvider, ProviderOutput } from "./types";

type ThemeMode = "light" | "dark";

interface ExtendedThemeInput {
  fonts?: {
    sans?: string;
    serif?: string;
    mono?: string;
  };
  radius?:
    | string
    | {
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
      };
  shadows?: {
    offsetX?: string;
    offsetY?: string;
    blur?: string;
    spread?: string;
    opacity?: string;
    color?: string;
  };
}

interface ColorRamps {
  neutral: string[];
  primary: string[];
  secondary: string[];
  accent: string[];
  destructive: string[];
}

type FullShadcnBlock = ShadcnBlock & Record<string, string>;

const ANCHORS = {
  light: { primary: 600, border: 200, muted: 100, mutedFg: 600, accent: 300 },
  dark: { primary: 400, border: 800, muted: 900, mutedFg: 300, accent: 700 },
} as const;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const bestTextFor = getBestTextColor;

const tweakL = (hex: string, dL: number) => {
  const c = oklch(hex);
  if (!c) return hex;
  return formatHex({
    mode: "oklch" as const,
    l: clamp01(c.l + dL),
    c: Math.max(0, c.c),
    h: c.h ?? 0,
  });
};

function formatOklch(color: string): string {
  const parsed = oklch(color);
  if (!parsed) return color;
  const l = parsed.l.toFixed(4);
  const c = parsed.c.toFixed(4);
  const h = (parsed.h ?? 0).toFixed(4);
  return `oklch(${l} ${c} ${h})`;
}

function buildNeutralRamp(block: TinteBlock): string[] {
  const seed = block.ui || block.ui_2 || block.ui_3 || block.bg || "#808080";
  return generateTailwindPalette(seed).map((s) => s.value);
}

function buildRamp(seed?: string): string[] {
  return generateTailwindPalette(seed || "#64748b").map((s) => s.value);
}

const pick = (ramp: string[], step: number) => {
  const idx = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].indexOf(
    step,
  );
  return ramp[Math.max(0, idx)];
};

const surface = (bg: string, mode: ThemeMode, delta = 0.02) => {
  return tweakL(bg, mode === "light" ? +delta : -delta);
};

function buildColorRamps(block: TinteBlock): ColorRamps {
  return {
    neutral: buildNeutralRamp(block),
    primary: buildRamp(block.pr),
    secondary: buildRamp(block.sc),
    accent: buildRamp(block.ac_1 || block.ac_2 || block.pr),
    destructive: buildRamp(block.ac_3 || "#ef4444"),
  };
}

function generateCoreColors(
  block: TinteBlock,
  mode: ThemeMode,
  ramps: ColorRamps,
): Record<string, string> {
  const bg = block.bg || (mode === "light" ? "#ffffff" : "#0b0b0f");
  const fg = block.tx || bestTextFor(bg);
  const A = ANCHORS[mode];

  const primary = pick(ramps.primary, A.primary);
  const secondary = pick(ramps.secondary, mode === "light" ? 500 : 400);
  const accent = pick(ramps.accent, A.accent);
  const muted = pick(ramps.neutral, A.muted);
  const border = pick(ramps.neutral, A.border);
  const destructive = pick(ramps.destructive, mode === "light" ? 500 : 400);

  const card = surface(bg, mode, 0.03);
  const popover = surface(bg, mode, 0.03);
  const ring = tweakL(primary, mode === "light" ? +0.1 : -0.1);
  const sidebar = bg;
  const sidebarAccent = surface(bg, mode, 0.04);

  return {
    background: bg,
    foreground: fg,
    card,
    "card-foreground": bestTextFor(card),
    popover,
    "popover-foreground": bestTextFor(popover),
    primary,
    "primary-foreground": bestTextFor(primary),
    secondary,
    "secondary-foreground": bestTextFor(secondary),
    muted,
    "muted-foreground": pick(ramps.neutral, A.mutedFg),
    accent,
    "accent-foreground": bestTextFor(accent),
    destructive,
    "destructive-foreground": bestTextFor(destructive),
    border,
    input: tweakL(border, mode === "light" ? -0.1 : +0.1),
    ring,
    sidebar,
    "sidebar-foreground": bestTextFor(sidebar),
    "sidebar-primary": primary,
    "sidebar-primary-foreground": bestTextFor(primary),
    "sidebar-accent": sidebarAccent,
    "sidebar-accent-foreground": bestTextFor(sidebarAccent),
    "sidebar-border": border,
    "sidebar-ring": ring,
  };
}

function generateChartColors(ramps: ColorRamps): Record<string, string> {
  return {
    "chart-1": pick(ramps.primary, 500),
    "chart-2": pick(ramps.accent, 500),
    "chart-3": pick(ramps.primary, 300),
    "chart-4": pick(ramps.accent, 700),
    "chart-5": pick(ramps.primary, 700),
  };
}

function applyFonts(
  result: Record<string, string>,
  extendedTheme?: ExtendedThemeInput,
): void {
  if (extendedTheme?.fonts) {
    result["font-sans"] = extendedTheme.fonts.sans
      ? `"${extendedTheme.fonts.sans}", ${DEFAULT_FONTS["font-sans"]}`
      : DEFAULT_FONTS["font-sans"];
    result["font-serif"] = extendedTheme.fonts.serif
      ? `"${extendedTheme.fonts.serif}", ${DEFAULT_FONTS["font-serif"]}`
      : DEFAULT_FONTS["font-serif"];
    result["font-mono"] = extendedTheme.fonts.mono
      ? `"${extendedTheme.fonts.mono}", ${DEFAULT_FONTS["font-mono"]}`
      : DEFAULT_FONTS["font-mono"];
  } else {
    Object.assign(result, DEFAULT_FONTS);
  }
}

function applyRadius(
  result: Record<string, string>,
  extendedTheme?: ExtendedThemeInput,
): void {
  if (!extendedTheme?.radius) return;

  if (typeof extendedTheme.radius === "object") {
    const r = extendedTheme.radius;
    if (r.sm) result["radius-sm"] = r.sm;
    if (r.md) result["radius-md"] = r.md;
    if (r.lg) result["radius-lg"] = r.lg;
    if (r.xl) result["radius-xl"] = r.xl;
    result.radius = r.md || "0.5rem";
  } else {
    const baseRadius = extendedTheme.radius;
    const numMatch = baseRadius.match(/^([\d.]+)(.*)$/);
    if (numMatch) {
      const num = Number.parseFloat(numMatch[1]);
      const unit = numMatch[2] || "rem";
      result["radius-sm"] = `${(num * 0.75).toFixed(3)}${unit}`;
      result["radius-md"] = baseRadius;
      result["radius-lg"] = `${(num * 1.5).toFixed(3)}${unit}`;
      result["radius-xl"] = `${(num * 2).toFixed(3)}${unit}`;
    }
    result.radius = baseRadius;
  }
}

function applyShadows(
  result: Record<string, string>,
  extendedTheme?: ExtendedThemeInput,
): void {
  if (extendedTheme?.shadows) {
    const s = extendedTheme.shadows;
    result["shadow-x"] = s.offsetX || "0px";
    result["shadow-y"] = s.offsetY || "2px";
    result["shadow-blur"] = s.blur || "4px";
    result["shadow-spread"] = s.spread || "0px";
    result["shadow-opacity"] = s.opacity || "0.1";
    result["shadow-color"] = s.color || "hsl(0 0% 0%)";
  } else {
    result["shadow-x"] = "0px";
    result["shadow-y"] = "2px";
    result["shadow-blur"] = "4px";
    result["shadow-spread"] = "0px";
    result["shadow-opacity"] = "0.1";
    result["shadow-color"] = "hsl(0 0% 0%)";
  }
}

function mapBlock(
  block: TinteBlock,
  mode: ThemeMode,
  extendedTheme?: ExtendedThemeInput,
): FullShadcnBlock {
  const ramps = buildColorRamps(block);

  const result: Record<string, string> = {
    ...generateCoreColors(block, mode, ramps),
    ...generateChartColors(ramps),
    ...DEFAULT_BASE,
  };

  applyFonts(result, extendedTheme);
  applyRadius(result, extendedTheme);
  applyShadows(result, extendedTheme);

  result["tracking-normal"] = "0em";
  result.spacing = "0.25rem";

  return result as FullShadcnBlock;
}

type TinteThemeWithExtras = TinteTheme & Partial<ExtendedThemeInput>;

function extractExtendedTheme(
  tinte: TinteThemeWithExtras,
): ExtendedThemeInput | undefined {
  if (tinte.fonts || tinte.radius || tinte.shadows) {
    return {
      fonts: tinte.fonts,
      radius: tinte.radius,
      shadows: tinte.shadows,
    };
  }
  return undefined;
}

export function convertTinteToShadcn(tinte: TinteThemeWithExtras): ShadcnTheme {
  const extendedTheme = extractExtendedTheme(tinte);

  const lightBlock = mapBlock(tinte.light, "light", extendedTheme);
  const darkBlock = mapBlock(tinte.dark, "dark", extendedTheme);

  return {
    light: lightBlock,
    dark: darkBlock,
  };
}

export function convertTinteToShadcnWithShadows(
  tinte: TinteThemeWithExtras,
): ShadcnTheme {
  const extendedTheme = extractExtendedTheme(tinte);

  const lightBlock = mapBlock(tinte.light, "light", extendedTheme);
  const darkBlock = mapBlock(tinte.dark, "dark", extendedTheme);

  // Add computed shadow variables to each block
  const lightShadowVars = computeShadowVars(lightBlock);
  const darkShadowVars = computeShadowVars(darkBlock);

  return {
    light: { ...lightBlock, ...lightShadowVars },
    dark: { ...darkBlock, ...darkShadowVars },
  };
}

export function computeShadowVars(
  tokens: Record<string, string>,
): Record<string, string> {
  const shadowColor = tokens["shadow-color"] || "hsl(0 0% 0%)";
  const opacity = parseFloat(tokens["shadow-opacity"] || "0.1");
  const offsetX = tokens["shadow-x"] || "0px";
  const offsetY = tokens["shadow-y"] || "2px";
  const blur = tokens["shadow-blur"] || "4px";
  const spread = tokens["shadow-spread"] || "0px";

  const parsed = oklch(shadowColor);
  const l = parsed ? parsed.l.toFixed(4) : "0";
  const c = parsed ? parsed.c.toFixed(4) : "0";
  const h = parsed ? (parsed.h ?? 0).toFixed(4) : "0";

  const colorWithOpacity = (opacityMultiplier: number) =>
    `oklch(${l} ${c} ${h} / ${(opacity * opacityMultiplier).toFixed(2)})`;

  const secondLayer = (fixedOffsetY: string, fixedBlur: string): string => {
    const spread2 = `${(
      parseFloat(spread.replace("px", "") || "0") - 1
    ).toString()}px`;
    return `${offsetX} ${fixedOffsetY} ${fixedBlur} ${spread2} ${colorWithOpacity(
      1.0,
    )}`;
  };

  return {
    "shadow-2xs": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      0.5,
    )}`,
    "shadow-xs": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      0.5,
    )}`,
    "shadow-sm": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      1.0,
    )}, ${secondLayer("1px", "2px")}`,
    shadow: `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      1.0,
    )}, ${secondLayer("1px", "2px")}`,
    "shadow-md": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      1.0,
    )}, ${secondLayer("2px", "4px")}`,
    "shadow-lg": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      1.0,
    )}, ${secondLayer("4px", "6px")}`,
    "shadow-xl": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      1.0,
    )}, ${secondLayer("8px", "10px")}`,
    "shadow-2xl": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      2.5,
    )}`,
  };
}

const COLOR_TOKENS = new Set([
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  "shadow-color",
]);

const THEME_INLINE_BLOCK = `@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}`;

function generateCSSVariables(theme: ShadcnTheme): string {
  const formatValue = (key: string, value: unknown): string | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === "object") return null;

    const strValue = String(value);
    if (strValue === "undefined" || strValue === "[object Object]") return null;

    if (COLOR_TOKENS.has(key)) {
      if (
        strValue.startsWith("#") ||
        strValue.startsWith("hsl") ||
        strValue.startsWith("rgb")
      ) {
        return formatOklch(strValue);
      }
    }

    return strValue;
  };

  const lightVars = Object.entries(theme.light)
    .map(([key, value]) => {
      const formatted = formatValue(key, value);
      return formatted !== null ? `  --${key}: ${formatted};` : null;
    })
    .filter(Boolean)
    .join("\n");

  const darkVars = Object.entries(theme.dark)
    .map(([key, value]) => {
      const formatted = formatValue(key, value);
      return formatted !== null ? `  --${key}: ${formatted};` : null;
    })
    .filter(Boolean)
    .join("\n");

  return `:root {\n${lightVars}\n}\n\n.dark {\n${darkVars}\n}\n\n${THEME_INLINE_BLOCK}`;
}

export const shadcnProvider: PreviewableProvider<ShadcnTheme> = {
  metadata: {
    id: "shadcn",
    name: "shadcn/ui",
    description:
      "Beautifully designed components built on Radix UI and Tailwind CSS",
    category: "ui",
    tags: ["react", "tailwind", "components", "ui"],
    icon: ShadcnIcon,
    website: "https://ui.shadcn.com/",
    documentation: "https://ui.shadcn.com/docs",
  },

  fileExtension: "css",
  mimeType: "text/css",
  convert: convertTinteToShadcn,

  export: (theme: TinteTheme, filename?: string): ProviderOutput => ({
    content: generateCSSVariables(convertTinteToShadcnWithShadows(theme)),
    filename: filename || "shadcn-theme.css",
    mimeType: "text/css",
  }),

  validate: (output: ShadcnTheme) => !!(output.light && output.dark),

  preview: {
    component: ShadcnPreview,
  },
};
