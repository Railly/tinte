import { formatHex, oklch, rgb } from "culori";
import { ShadcnPreview } from "@/components/preview/shadcn/shadcn-preview";
import { ShadcnIcon } from "@/components/shared/icons/shadcn";
import {
  DEFAULT_BASE,
  DEFAULT_FONTS,
  DEFAULT_SHADOWS,
  type ShadcnBlock,
  type ShadcnTheme,
} from "@/types/shadcn";
import type { TinteBlock, TinteTheme } from "@/types/tinte";
import { generateTailwindPalette } from "../palette-generator";
import type { PreviewableProvider, ProviderOutput } from "./types";

type ThemeMode = "light" | "dark";

const ANCHORS = {
  light: { primary: 600, border: 200, muted: 100, mutedFg: 600, accent: 300 },
  dark: { primary: 400, border: 800, muted: 900, mutedFg: 300, accent: 700 },
} as const;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const L = (hex: string) => {
  const c = rgb(hex) as any;
  if (!c) return 0;
  const lin = (x: number) =>
    x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
};

const contrast = (a: string, b: string) => {
  const la = L(a),
    lb = L(b);
  const lighter = Math.max(la, lb),
    darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
};

const bestTextFor = (bg: string) => {
  const w = "#ffffff",
    k = "#000000";
  return contrast(w, bg) >= contrast(k, bg) ? w : k;
};

const tweakL = (hex: string, dL: number) => {
  const c = oklch(hex) as any;
  if (!c) return hex;
  return formatHex({
    mode: "oklch" as const,
    l: clamp01(c.l + dL),
    c: Math.max(0, c.c),
    h: c.h,
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

function mapBlock(
  block: TinteBlock,
  mode: ThemeMode,
  extendedTheme?: any,
): ShadcnBlock {
  const bg = block.bg || (mode === "light" ? "#ffffff" : "#0b0b0f");
  const fg = block.tx || bestTextFor(bg);

  const neutralRamp = buildNeutralRamp(block);
  const primaryRamp = buildRamp(block.pr);
  const secondaryRamp = buildRamp(block.sc);
  const accentRamp = buildRamp(block.ac_1 || block.ac_2 || block.pr);

  const A = ANCHORS[mode];
  const primary = pick(primaryRamp, A.primary);
  const secondary = pick(secondaryRamp, mode === "light" ? 500 : 400);
  const accent = pick(accentRamp, A.accent);
  const muted = pick(neutralRamp, A.muted);
  const border = pick(neutralRamp, A.border);

  const ensureFg = (on: string) => bestTextFor(on);
  const ring = tweakL(primary, mode === "light" ? +0.1 : -0.1);
  const card = surface(bg, mode, 0.03);
  const popover = surface(bg, mode, 0.03);

  const destructiveSeed = block.ac_3 || "#ef4444";
  const destructiveRamp = buildRamp(destructiveSeed);
  const destructive = pick(destructiveRamp, mode === "light" ? 500 : 400);

  const chart1 = pick(primaryRamp, 500);
  const chart2 = pick(accentRamp, 500);
  const chart3 = pick(primaryRamp, 300);
  const chart4 = pick(accentRamp, 700);
  const chart5 = pick(primaryRamp, 700);

  const sidebar = bg;
  const sidebarAccent = surface(bg, mode, 0.04);

  // Build the base result
  const result: any = {
    background: bg,
    foreground: fg,
    card,
    "card-foreground": ensureFg(card),
    popover,
    "popover-foreground": ensureFg(popover),
    primary,
    "primary-foreground": ensureFg(primary),
    secondary,
    "secondary-foreground": ensureFg(secondary),
    muted,
    "muted-foreground": pick(neutralRamp, A.mutedFg),
    accent,
    "accent-foreground": ensureFg(accent),
    destructive,
    "destructive-foreground": ensureFg(destructive),
    border,
    input: tweakL(border, mode === "light" ? -0.1 : +0.1),
    ring,
    "chart-1": chart1,
    "chart-2": chart2,
    "chart-3": chart3,
    "chart-4": chart4,
    "chart-5": chart5,
    sidebar,
    "sidebar-foreground": ensureFg(sidebar),
    "sidebar-primary": primary,
    "sidebar-primary-foreground": ensureFg(primary),
    "sidebar-accent": sidebarAccent,
    "sidebar-accent-foreground": ensureFg(sidebarAccent),
    "sidebar-border": border,
    "sidebar-ring": ring,
    ...DEFAULT_BASE,
  };

  // Add fonts if available
  if (extendedTheme?.fonts) {
    result["font-sans"] =
      `"${extendedTheme.fonts.sans}", ${DEFAULT_FONTS["font-sans"]}`;
    result["font-serif"] =
      `"${extendedTheme.fonts.serif}", ${DEFAULT_FONTS["font-serif"]}`;
    result["font-mono"] =
      `"${extendedTheme.fonts.mono}", ${DEFAULT_FONTS["font-mono"]}`;
  } else {
    Object.assign(result, DEFAULT_FONTS);
  }

  if (extendedTheme?.radius) {
    if (typeof extendedTheme.radius === "object") {
      result["radius-sm"] = extendedTheme.radius.sm;
      result["radius-md"] = extendedTheme.radius.md;
      result["radius-lg"] = extendedTheme.radius.lg;
      result["radius-xl"] = extendedTheme.radius.xl;
      result.radius = extendedTheme.radius.md || "0.5rem";
    } else {
      const baseRadius = extendedTheme.radius;
      const numMatch = baseRadius.match(/^([\d.]+)(.*)$/);
      if (numMatch) {
        const num = parseFloat(numMatch[1]);
        const unit = numMatch[2] || "rem";
        result["radius-sm"] = `${(num * 0.75).toFixed(3)}${unit}`;
        result["radius-md"] = baseRadius;
        result["radius-lg"] = `${(num * 1.5).toFixed(3)}${unit}`;
        result["radius-xl"] = `${(num * 2).toFixed(3)}${unit}`;
      }
      result.radius = baseRadius;
    }
  }

  if (extendedTheme?.shadows) {
    result["shadow-x"] = extendedTheme.shadows.offsetX;
    result["shadow-y"] = extendedTheme.shadows.offsetY;
    result["shadow-blur"] = extendedTheme.shadows.blur;
    result["shadow-spread"] = extendedTheme.shadows.spread;
    result["shadow-opacity"] = extendedTheme.shadows.opacity;
    result["shadow-color"] = extendedTheme.shadows.color;
  } else {
    result["shadow-x"] = "0px";
    result["shadow-y"] = "2px";
    result["shadow-blur"] = "4px";
    result["shadow-spread"] = "0px";
    result["shadow-opacity"] = "0.1";
    result["shadow-color"] = "hsl(0 0% 0%)";
  }

  result["tracking-normal"] = "0em";
  result["spacing"] = "0.25rem";

  return result;
}

export function convertTinteToShadcn(tinte: TinteTheme | any): ShadcnTheme {
  // Check if we have extended theme data (fonts, radius, shadows)
  const extendedTheme =
    (tinte as any).fonts || (tinte as any).radius || (tinte as any).shadows
      ? (tinte as any)
      : null;

  const lightBlock = mapBlock(tinte.light, "light", extendedTheme);
  const darkBlock = mapBlock(tinte.dark, "dark", extendedTheme);

  return {
    light: lightBlock,
    dark: darkBlock,
  };
}

export function convertTinteToShadcnWithShadows(
  tinte: TinteTheme | any,
): ShadcnTheme {
  // Check if we have extended theme data (fonts, radius, shadows)
  const extendedTheme =
    (tinte as any).fonts || (tinte as any).radius || (tinte as any).shadows
      ? (tinte as any)
      : null;

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
  "background", "foreground", "card", "card-foreground",
  "popover", "popover-foreground", "primary", "primary-foreground",
  "secondary", "secondary-foreground", "muted", "muted-foreground",
  "accent", "accent-foreground", "destructive", "destructive-foreground",
  "border", "input", "ring",
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
  "sidebar", "sidebar-foreground", "sidebar-primary",
  "sidebar-primary-foreground", "sidebar-accent",
  "sidebar-accent-foreground", "sidebar-border", "sidebar-ring",
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
      if (strValue.startsWith("#") || strValue.startsWith("hsl") || strValue.startsWith("rgb")) {
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
