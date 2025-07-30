// ice-theme.ts
// One-file drop-in: Tinte "Ice" → Poline ramp → shadcn theme (light/dark).
// Dependencies: `poline` and `culori`

import { Poline, positionFunctions } from "poline";
import { converter, formatHex, oklch, rgb, type Hsl } from "culori";

/* ──────────────────────────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────────────────────────── */

export type TinteBlock = {
  text: string;
  text_2: string;
  text_3: string;
  interface: string;
  interface_2: string;
  interface_3: string;
  background: string;
  background_2: string;
  primary: string;
  secondary: string;
  accent: string;
  accent_2: string;
  accent_3: string;
};

export type TinteTheme = {
  light: TinteBlock;
  dark: TinteBlock;
};

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
    text: "#1C1B29",
    accent: "#1E3C78",
    text_2: "#25778e",
    text_3: "#49b3d0",
    primary: "#81909D",
    accent_2: "#7CBCD8",
    accent_3: "#00B0E9",
    interface: "#d6f7ff",
    secondary: "#00B0E9",
    background: "#fafeff",
    interface_2: "#c2f3ff",
    interface_3: "#9ed7e6",
    background_2: "#ebfbff",
  },
  dark: {
    text: "#FFFFFF",
    accent: "#778CB7",
    text_2: "#A3A3A3",
    text_3: "#8F8F8F",
    primary: "#BFC4C8",
    accent_2: "#89C3DC",
    accent_3: "#00B0E9",
    interface: "#30353b",
    secondary: "#92DEF6",
    background: "#1F2427",
    interface_2: "#394047",
    interface_3: "#515a61",
    background_2: "#272c30",
  },
} as const as TinteTheme;

/* ──────────────────────────────────────────────────────────────────────────────
   Minimal OKLCH helpers + Tailwind ramp (11 stops) 50..950
   (Self-contained version of your generator)
────────────────────────────────────────────────────────────────────────────── */

type PaletteColor = {
  name: string;
  value: string;
  luminance: number;
  contrast: { white: number; black: number };
  accessibility: {
    level: "AAA" | "AA" | "A" | "Fail";
    textOnWhite: boolean;
    textOnBlack: boolean;
  };
};

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const toOKLCH = (hex: string) => {
  const c = oklch(hex);
  if (!c) {
    // Fallback para colores inválidos - usar un gris medio
    console.warn(`Invalid color: ${hex}, using fallback`);
    return { l: 0.5, c: 0, h: 0 };
  }
  return { l: c.l ?? 0, c: c.c ?? 0, h: c.h ?? 0 };
};

const oklchToHex = (l: number, c: number, h: number) =>
  formatHex(rgb({ mode: "oklch", l: clamp01(l), c: Math.max(0, c), h }))!;

const sRGBLum = (hex: string) => {
  const color = rgb(hex);
  if (!color) {
    console.warn(`Invalid color for luminance: ${hex}, using fallback`);
    return 0.5; // gris medio
  }
  const { r, g, b } = color;
  const lin = (v: number) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  const rl = lin(r),
    gl = lin(g),
    bl = lin(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
};

const contrast = (a: string, b: string) => {
  const L1 = sRGBLum(a),
    L2 = sRGBLum(b);
  const hi = Math.max(L1, L2),
    lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
};

export function generateTailwindPalette(baseHex: string): PaletteColor[] {
  const base = toOKLCH(baseHex);

  // fixed luminance targets aligned to Tailwind stops (empirical)
  const targets = [
    0.985, 0.967, 0.922, 0.87, 0.708, 0.556, 0.439, 0.371, 0.269, 0.205, 0.145,
  ];

  // find nearest slot to the base color
  let baseIndex = 0,
    minDiff = Infinity;
  for (let i = 0; i < targets.length; i++) {
    const d = Math.abs(targets[i] - base.l);
    if (d < minDiff) {
      minDiff = d;
      baseIndex = i;
    }
  }

  const lightEnd = {
    l: targets[0],
    c: Math.max(0.002, base.c * 0.05),
    h: base.h,
  };
  const darkEnd = {
    l: targets[10],
    c: Math.max(0.02, base.c * 0.6),
    h: base.h,
  };

  const ramp: PaletteColor[] = [];

  for (let i = 0; i < targets.length; i++) {
    let l: number,
      c: number,
      h = base.h;

    if (i === baseIndex) {
      l = base.l;
      c = base.c;
    } else if (i < baseIndex) {
      const t = (baseIndex - i) / baseIndex;
      l = base.l + (lightEnd.l - base.l) * t;
      c = base.c + (lightEnd.c - base.c) * (t * 0.8);
    } else {
      const t = (i - baseIndex) / (targets.length - 1 - baseIndex);
      l = base.l + (darkEnd.l - base.l) * t;
      c = base.c + (darkEnd.c - base.c) * (t * 0.9);
    }

    const hex = oklchToHex(l, c, h);
    const cw = contrast(hex, "#ffffff");
    const ck = contrast(hex, "#000000");

    let level: "AAA" | "AA" | "A" | "Fail" = "Fail";
    if (cw >= 7 || ck >= 7) level = "AAA";
    else if (cw >= 4.5 || ck >= 4.5) level = "AA";
    else if (cw >= 3 || ck >= 3) level = "A";

    ramp.push({
      name: String(STOPS[i]),
      value: hex,
      luminance: sRGBLum(hex),
      contrast: { white: cw, black: ck },
      accessibility: {
        level,
        textOnWhite: cw >= 4.5,
        textOnBlack: ck >= 4.5,
      },
    });
  }
  return ramp;
}

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
      hex2hsl(block.accent),
      hex2hsl(block.secondary),
      hex2hsl(block.primary),
      hex2hsl(block.interface_3),
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
  if (!isFinite(L1) || !isFinite(L2)) {
    return 1; // contraste mínimo si hay colores inválidos
  }
  const hi = Math.max(L1, L2),
    lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
};

// Dedup por hue (grados OKLCH) para no meter colores casi iguales
const hueDiff = (a: number, b: number) => {
  let d = Math.abs(a - b);
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
  t: { accent: string; accent_2: string; accent_3: string },
  mode: "light" | "dark",
  bg: string
): string[] {
  const base = dedupByHue([t.accent, t.accent_2, t.accent_3].filter(Boolean));
  while (base.length < 3) base.push(base[base.length - 1] || t.accent);

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
  stop: (typeof STOPS)[number]
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
  const primaryRamp = generateTailwindPalette(t.primary);
  const neutralRamp = generateTailwindPalette(t.interface_2);

  const primary = pickStop(primaryRamp, isLight ? 600 : 400);
  const border = pickStop(neutralRamp, isLight ? 200 : 800);
  const muted = pickStop(neutralRamp, isLight ? 100 : 900);

  // Accent / Secondary from Poline (expressive)
  const poly = makePolineFromTinte(t);
  const polyHex = polineRampHex(poly);
  const accent = polyHex[isLight ? 3 : 7] || t.accent;
  const secondary = polyHex[isLight ? 5 : 4] || t.secondary;

  const bg = t.background;
  const card = tone(bg, isLight ? +0.02 : -0.02);
  const pop = tone(bg, isLight ? +0.02 : -0.02);

  // Charts: usa accents + variantes, con contraste vs background
  const charts = chartColorsFromAccents(
    { accent: t.accent, accent_2: t.accent_2, accent_3: t.accent_3 },
    mode,
    t.background
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
  makePolineFromTinte(ICE_TINTE.light)
);
export const ICE_POLINE_RAMP_DARK = polineRampHex(
  makePolineFromTinte(ICE_TINTE.dark)
);

export const ICE_SHADCN: ShadcnTheme = buildShadcnFromTinte(ICE_TINTE);
