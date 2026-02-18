// ice-theme.ts
// One-file drop-in: Tinte "Ice" → Poline ramp → shadcn theme (light/dark).
// Dependencies: `poline` and `culori`

import { converter, formatHex, type Hsl, oklch, rgb } from "culori";
import { Poline, positionFunctions } from "poline";
import { generateTailwindPalette } from "@tinte/core";

/* ──────────────────────────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────────────────────────── */

import type { TinteBlock, TinteTheme } from "@tinte/core";

// Re-export types for backward compatibility
export type { TinteBlock, TinteTheme };

export type ShadcnBlock = {
  accent: string;
  "accent-foreground": string;
  background: string;
  border: string;
  card: string;
  "card-foreground": string;
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
  destructive: string;
  "destructive-foreground": string;
  foreground: string;
  input: string;
  muted: string;
  "muted-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  ring: string;
  secondary: string;
  "secondary-foreground": string;
  sidebar: string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-ring": string;
};

export type ShadcnTheme = {
  light: ShadcnBlock;
  dark: ShadcnBlock;
};

/* ──────────────────────────────────────────────────────────────────────────────
   Canonical Tinte: ICE
────────────────────────────────────────────────────────────────────────────── */

export const ICE_TINTE: TinteTheme = {
  name: "Ice" as any, // optional
  light: {
    tx: "#1C1B29",
    pr: "#1E3C78",
    tx_2: "#25778e",
    tx_3: "#49b3d0",
    sc: "#81909D",
    ac_2: "#7CBCD8",
    ac_3: "#00B0E9",
    ui: "#d6f7ff",
    ac_1: "#00B0E9",
    bg: "#fafeff",
    ui_2: "#c2f3ff",
    ui_3: "#9ed7e6",
    bg_2: "#ebfbff",
  },
  dark: {
    tx: "#FFFFFF",
    pr: "#778CB7",
    tx_2: "#A3A3A3",
    tx_3: "#8F8F8F",
    sc: "#BFC4C8",
    ac_2: "#89C3DC",
    ac_3: "#00B0E9",
    ui: "#30353b",
    ac_1: "#92DEF6",
    bg: "#1F2427",
    ui_2: "#394047",
    ui_3: "#515a61",
    bg_2: "#272c30",
  },
} as const as TinteTheme;

/* ──────────────────────────────────────────────────────────────────────────────
   OKLCH helpers (used by chart generation and shadcn builder)
────────────────────────────────────────────────────────────────────────────── */

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const toOKLCH = (hex: string) => {
  const c = oklch(hex);
  if (!c) {
    console.warn(`Invalid color: ${hex}, using fallback`);
    return { l: 0.5, c: 0, h: 0 };
  }
  return { l: c.l ?? 0, c: c.c ?? 0, h: c.h ?? 0 };
};

const sRGBLum = (hex: string) => {
  const color = rgb(hex);
  if (!color) {
    console.warn(`Invalid color for luminance: ${hex}, using fallback`);
    return 0.5;
  }
  const { r, g, b } = color;
  const lin = (v: number) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  const rl = lin(r),
    gl = lin(g),
    bl = lin(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
};

/* ──────────────────────────────────────────────────────────────────────────────
   Poline ramp from Tinte (for accent / charts)
────────────────────────────────────────────────────────────────────────────── */

const toHsl = converter("hsl") as (hex: string) => Hsl | undefined;
const hex2hsl = (hex: string) => {
  const c = toHsl(hex);
  if (!c) {
    console.warn(`Invalid color for HSL conversion: ${hex}, using fallback`);
    return [0, 0, 0.5] as [number, number, number]; // gris medio
  }
  return [c.h ?? 0, c.s ?? 0, c.l ?? 0] as [number, number, number];
};

export function makePolineFromTinte(block: TinteBlock) {
  return new Poline({
    numPoints: 11, // Tailwind stops
    closedLoop: false,
    positionFunctionX: positionFunctions.sinusoidalPosition,
    positionFunctionY: positionFunctions.quadraticPosition,
    positionFunctionZ: positionFunctions.linearPosition,
    anchorColors: [
      hex2hsl(block.pr),
      hex2hsl(block.sc),
      hex2hsl(block.ac_1),
      hex2hsl(block.ui_3),
    ],
  });
}

export const polineRampHex = (p: Poline): string[] =>
  p.colorsCSS.map(formatHex).filter((hex): hex is string => Boolean(hex));

/* ──────────────────────────────────────────────────────────────────────────────
   Charts desde accents (OKLCH helpers)
────────────────────────────────────────────────────────────────────────────── */

const withL = (hex: string, l: number) => {
  const oklch = toOKLCH(hex);
  const result = rgb({ mode: "oklch", l: clamp01(l), c: oklch.c, h: oklch.h });
  if (!result) {
    console.warn(`Failed to convert color withL: ${hex}, using fallback`);
    return "#808080"; // gris medio como fallback
  }
  return formatHex(result);
};
const adjustL = (hex: string, dL: number) => {
  const oklch = toOKLCH(hex);
  return withL(hex, clamp01((oklch.l ?? 0.5) + dL));
};

const ratio = (a: string, b: string) => {
  const L1 = sRGBLum(a),
    L2 = sRGBLum(b);
  if (!Number.isFinite(L1) || !Number.isFinite(L2)) {
    return 1; // contraste mínimo si hay colores inválidos
  }
  const hi = Math.max(L1, L2),
    lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
};

// Dedup por hue (grados OKLCH) para no meter colores casi iguales
const hueDiff = (a: number, b: number) => {
  const d = Math.abs(a - b);
  return d > 180 ? 360 - d : d;
};
function dedupByHue(colors: string[], tol = 8) {
  const out: string[] = [];
  const seen: number[] = [];
  for (const hex of colors) {
    const oklch = toOKLCH(hex);
    const h = oklch?.h ?? 0;
    if (!seen.some((s) => hueDiff(s, h) < tol)) {
      out.push(hex);
      seen.push(h);
    }
  }
  return out;
}

// Sube/baja L hasta alcanzar contraste mínimo vs bg (para barras sobre cards)
function ensureContrast(hex: string, bg: string, min = 2.6, step = 0.02) {
  if (ratio(hex, bg) >= min) return hex;
  let cur = hex;
  // si el fondo es claro, oscurece; si es oscuro, aclara
  const bgOklch = toOKLCH(bg);
  const bgL = bgOklch?.l ?? 0.5;
  const dir = bgL > 0.6 ? -1 : +1;
  for (let i = 0; i < 12; i++) {
    cur = adjustL(cur, dir * step);
    if (ratio(cur, bg) >= min) break;
  }
  return cur;
}

/**
 * 5 colores para charts desde accents:
 * [accent, accent_2, accent_3, accent±ΔL, accent_2∓ΔL]
 */
export function chartColorsFromAccents(
  t: { pr: string; ac_2: string; ac_3: string },
  mode: "light" | "dark",
  bg: string,
): string[] {
  const base = dedupByHue([t.pr, t.ac_2, t.ac_3].filter(Boolean));
  while (base.length < 3) base.push(base[base.length - 1] || t.pr);

  const dlA = mode === "light" ? -0.12 : +0.12;
  const dlB = mode === "light" ? +0.1 : -0.1;

  const v1 = adjustL(base[0], dlA);
  const v2 = adjustL(base[1], dlB);

  const raw = [base[0], base[1], base[2], v1, v2].slice(0, 5);
  return raw.map((c) => ensureContrast(c, bg));
}

/* ──────────────────────────────────────────────────────────────────────────────
   Shadcn builder (from Tinte + Poline)
────────────────────────────────────────────────────────────────────────────── */

const tone = (hex: string, dL: number) => {
  const c = oklch(hex)!;
  const out = rgb({
    mode: "oklch",
    l: clamp01(c.l + dL),
    c: Math.max(0, c.c),
    h: c.h,
  })!;
  return formatHex(out);
};
const pickStop = <T extends { value: string } | string>(
  ramp: T[],
  stop: (typeof STOPS)[number],
) => {
  const idx = {
    50: 0,
    100: 1,
    200: 2,
    300: 3,
    400: 4,
    500: 5,
    600: 6,
    700: 7,
    800: 8,
    900: 9,
    950: 10,
  }[stop];
  const v = ramp[idx] as any;
  return typeof v === "string" ? v : v.value;
};
const bestTextFor = (bg: string) => {
  const w = "#ffffff",
    k = "#000000";
  const L1 = sRGBLum(bg);
  const cw = (Math.max(L1, 1) + 0.05) / (Math.min(L1, 1) + 0.05); // vs white
  const ck = (Math.max(L1, 0) + 0.05) / (Math.min(L1, 0) + 0.05); // vs black
  return cw >= ck ? w : k;
};

function buildShadcnBlock(t: TinteBlock, mode: "light" | "dark"): ShadcnBlock {
  const isLight = mode === "light";

  // Primary / Neutral ramps from OKLCH (brand-coherent)
  const primaryRamp = generateTailwindPalette(t.sc);
  const neutralRamp = generateTailwindPalette(t.ui_2);

  const primary = pickStop(primaryRamp, isLight ? 600 : 400);
  const border = pickStop(neutralRamp, isLight ? 200 : 800);
  const muted = pickStop(neutralRamp, isLight ? 100 : 900);

  // Accent / Secondary from Poline (expressive)
  const poly = makePolineFromTinte(t);
  const polyHex = polineRampHex(poly);
  const accent = polyHex[isLight ? 3 : 7] || t.pr;
  const secondary = polyHex[isLight ? 5 : 4] || t.sc;

  const bg = t.bg;
  const card = tone(bg, isLight ? +0.02 : -0.02);
  const pop = tone(bg, isLight ? +0.02 : -0.02);

  // Charts: usa accents + variantes, con contraste vs background
  const charts = chartColorsFromAccents(
    { pr: t.pr, ac_2: t.ac_2, ac_3: t.ac_3 },
    mode,
    t.bg,
  );

  return {
    background: bg,
    foreground: bestTextFor(bg),

    card,
    "card-foreground": bestTextFor(card),
    popover: pop,
    "popover-foreground": bestTextFor(pop),

    primary,
    "primary-foreground": bestTextFor(primary),
    secondary,
    "secondary-foreground": bestTextFor(secondary),

    accent,
    "accent-foreground": bestTextFor(accent),

    muted,
    "muted-foreground": isLight
      ? pickStop(neutralRamp, 600)
      : pickStop(neutralRamp, 300),

    border,
    input: border,
    ring: tone(primary, isLight ? +0.1 : -0.1),

    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",

    // Charts: spaced across Poline ramp
    "chart-1": charts[0],
    "chart-2": charts[1],
    "chart-3": charts[2],
    "chart-4": charts[3],
    "chart-5": charts[4],

    // Sidebar aligned with surfaces
    sidebar: bg,
    "sidebar-foreground": bestTextFor(bg),
    "sidebar-primary": primary,
    "sidebar-primary-foreground": bestTextFor(primary),
    "sidebar-accent": tone(bg, isLight ? +0.03 : -0.03),
    "sidebar-accent-foreground": bestTextFor(tone(bg, isLight ? +0.03 : -0.03)),
    "sidebar-border": border,
    "sidebar-ring": tone(primary, isLight ? +0.1 : -0.1),
  };
}

export function buildShadcnFromTinte(theme: TinteTheme): ShadcnTheme {
  return {
    light: buildShadcnBlock(theme.light, "light"),
    dark: buildShadcnBlock(theme.dark, "dark"),
  };
}

/* ──────────────────────────────────────────────────────────────────────────────
   Ready-made exports for ICE
────────────────────────────────────────────────────────────────────────────── */

export const ICE_POLINE_RAMP_LIGHT = polineRampHex(
  makePolineFromTinte(ICE_TINTE.light),
);
export const ICE_POLINE_RAMP_DARK = polineRampHex(
  makePolineFromTinte(ICE_TINTE.dark),
);

export const ICE_SHADCN: ShadcnTheme = buildShadcnFromTinte(ICE_TINTE);
