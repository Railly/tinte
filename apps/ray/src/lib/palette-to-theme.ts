import type { TinteBlock } from "@tinte/core";
import { formatHex, oklch, interpolate, parse } from "culori";

interface Swatch {
  hex: string;
  population: number;
}

interface Palette {
  vibrant?: Swatch;
  darkVibrant?: Swatch;
  lightVibrant?: Swatch;
  muted?: Swatch;
  darkMuted?: Swatch;
  lightMuted?: Swatch;
}

function toHex(color: ReturnType<typeof oklch>): string {
  return formatHex(color) ?? "#000000";
}

function adjustLightness(hex: string, delta: number): string {
  const c = oklch(parse(hex));
  if (!c) return hex;
  c.l = Math.max(0, Math.min(1, (c.l ?? 0) + delta));
  return toHex(c);
}

function mixColors(hex1: string, hex2: string, t: number): string {
  const mixer = interpolate([hex1, hex2], "oklch");
  return formatHex(mixer(t)) ?? hex1;
}

function ensureContrast(fg: string, bg: string, minRatio: number): string {
  const fgC = oklch(parse(fg));
  const bgC = oklch(parse(bg));
  if (!fgC || !bgC) return fg;

  const bgL = bgC.l ?? 0;
  let fgL = fgC.l ?? 0;

  for (let i = 0; i < 20; i++) {
    const lighter = Math.max(fgL, bgL);
    const darker = Math.min(fgL, bgL);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    if (ratio >= minRatio) break;

    if (bgL < 0.5) {
      fgL = Math.min(1, fgL + 0.04);
    } else {
      fgL = Math.max(0, fgL - 0.04);
    }
  }

  fgC.l = fgL;
  return toHex(fgC);
}

export function paletteToTheme(palette: Palette): { dark: TinteBlock; light: TinteBlock } {
  const darkest = palette.darkMuted?.hex ?? palette.darkVibrant?.hex ?? "#0a0a0f";
  const lightest = palette.lightVibrant?.hex ?? palette.lightMuted?.hex ?? "#e0e0e0";
  const primary = palette.vibrant?.hex ?? "#3b82f6";
  const secondary = palette.darkVibrant?.hex ?? palette.muted?.hex ?? "#6366f1";
  const accent1 = palette.lightVibrant?.hex ?? "#22d3ee";
  const accent2 = palette.muted?.hex ?? "#8b5cf6";
  const accent3 = palette.lightMuted?.hex ?? palette.darkMuted?.hex ?? "#94a3b8";

  const dark: TinteBlock = {
    bg: adjustLightness(darkest, -0.05),
    bg_2: adjustLightness(darkest, -0.02),
    ui: mixColors(darkest, lightest, 0.08),
    ui_2: mixColors(darkest, lightest, 0.12),
    ui_3: mixColors(darkest, lightest, 0.16),
    tx: ensureContrast(adjustLightness(lightest, 0.05), darkest, 4.5),
    tx_2: ensureContrast(adjustLightness(lightest, -0.1), darkest, 3.5),
    tx_3: ensureContrast(adjustLightness(lightest, -0.2), darkest, 2.5),
    pr: ensureContrast(primary, darkest, 3),
    sc: ensureContrast(secondary, darkest, 3),
    ac_1: ensureContrast(accent1, darkest, 3),
    ac_2: ensureContrast(accent2, darkest, 3),
    ac_3: ensureContrast(accent3, darkest, 2.5),
  };

  const lightBg = adjustLightness(lightest, 0.1);

  const light: TinteBlock = {
    bg: lightBg,
    bg_2: adjustLightness(lightBg, -0.03),
    ui: mixColors(lightBg, darkest, 0.06),
    ui_2: mixColors(lightBg, darkest, 0.1),
    ui_3: mixColors(lightBg, darkest, 0.14),
    tx: ensureContrast(adjustLightness(darkest, -0.05), lightBg, 4.5),
    tx_2: ensureContrast(adjustLightness(darkest, 0.1), lightBg, 3.5),
    tx_3: ensureContrast(adjustLightness(darkest, 0.2), lightBg, 2.5),
    pr: ensureContrast(adjustLightness(primary, -0.1), lightBg, 3),
    sc: ensureContrast(adjustLightness(secondary, -0.1), lightBg, 3),
    ac_1: ensureContrast(adjustLightness(accent1, -0.15), lightBg, 3),
    ac_2: ensureContrast(adjustLightness(accent2, -0.1), lightBg, 3),
    ac_3: ensureContrast(adjustLightness(accent3, -0.05), lightBg, 2.5),
  };

  return { dark, light };
}

export function deriveGradientFromPalette(palette: Palette): string {
  const base = palette.darkMuted?.hex ?? palette.darkVibrant?.hex ?? "#0a0a1a";
  const accent = palette.vibrant?.hex ?? palette.muted?.hex ?? "#3b82f6";
  const dark = adjustLightness(base, -0.08);
  const mid = mixColors(base, accent, 0.3);
  return `linear-gradient(145deg, ${dark} 0%, ${mid} 100%)`;
}

export function nameFromPalette(palette: Palette): string {
  const primary = palette.vibrant?.hex ?? palette.muted?.hex ?? "#808080";
  const c = oklch(parse(primary));
  if (!c) return "Custom Theme";

  const hue = c.h ?? 0;
  const chroma = c.c ?? 0;

  if (chroma < 0.03) return "Monochrome";
  if (hue >= 0 && hue < 30) return "Crimson";
  if (hue >= 30 && hue < 60) return "Amber";
  if (hue >= 60 && hue < 90) return "Gold";
  if (hue >= 90 && hue < 150) return "Emerald";
  if (hue >= 150 && hue < 210) return "Cyan";
  if (hue >= 210 && hue < 270) return "Sapphire";
  if (hue >= 270 && hue < 330) return "Violet";
  return "Ruby";
}
