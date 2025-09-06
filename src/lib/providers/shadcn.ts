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

function mapBlock(block: TinteBlock, mode: ThemeMode): ShadcnBlock {
  const bg = block.bg || (mode === "light" ? "#ffffff" : "#0b0b0f");
  const fg = block.tx || bestTextFor(bg);

  const neutralRamp = buildNeutralRamp(block);
  const primaryRamp = buildRamp(block.sc);
  const accentRamp = buildRamp(block.pr || block.ac_2 || block.sc);

  const A = ANCHORS[mode];
  const primary = pick(primaryRamp, A.primary);
  const secondary = pick(accentRamp, mode === "light" ? 500 : 400);
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

  return {
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
    input: border,
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
    ...DEFAULT_FONTS,
    ...DEFAULT_SHADOWS,
  };
}

function convertTinteToShadcn(tinte: TinteTheme): ShadcnTheme {
  return {
    light: mapBlock(tinte.light, "light"),
    dark: mapBlock(tinte.dark, "dark"),
  };
}

function generateCSSVariables(theme: ShadcnTheme): string {
  const lightVars = Object.entries(theme.light)
    .map(([key, value]) => `    --${key}: ${value};`)
    .join("\n");

  const darkVars = Object.entries(theme.dark)
    .map(([key, value]) => `    --${key}: ${value};`)
    .join("\n");

  return `:root {
${lightVars}
}

.dark {
${darkVars}
}`;
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
    content: generateCSSVariables(convertTinteToShadcn(theme)),
    filename: filename || "shadcn-theme.css",
    mimeType: "text/css",
  }),

  validate: (output: ShadcnTheme) => !!(output.light && output.dark),

  preview: {
    component: ShadcnPreview,
  },
};
