import { oklch, rgb, formatHex } from 'culori';
import { generateTailwindPalette } from './palette-generator';

type Mode = 'light' | 'dark';
type RaysoBlock = Record<string, string>;
type ShadcnBlock = Record<string, string>;
type RaysoTheme = { light: RaysoBlock; dark: RaysoBlock };

const ANCHORS = {
  light: { primary: 600, border: 200, muted: 100, mutedFg: 600, accent: 300 },
  dark: { primary: 400, border: 800, muted: 900, mutedFg: 300, accent: 700 },
} as const;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const L = (hex: string) => {
  const c = rgb(hex) as any;
  if (!c) return 0;
  const lin = (x: number) => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
};

const contrast = (a: string, b: string) => {
  const la = L(a), lb = L(b);
  const lighter = Math.max(la, lb), darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
};

const bestTextFor = (bg: string) => {
  const w = '#ffffff', k = '#000000';
  return contrast(w, bg) >= contrast(k, bg) ? w : k;
};

const tweakL = (hex: string, dL: number) => {
  const c = oklch(hex) as any;
  if (!c) return hex;
  const out = { mode: 'oklch', l: clamp01(c.l + dL), c: Math.max(0, c.c), h: c.h };
  return formatHex(out);
};

function buildNeutralRamp(block: RaysoBlock): string[] {
  const seed = block.interface || block.interface_2 || block.interface_3 || block.background || '#808080';
  return generateTailwindPalette(seed).map(s => s.value);
}

function buildRamp(seed?: string): string[] {
  const base = seed || '#64748b';
  return generateTailwindPalette(base).map(s => s.value);
}

const pick = (ramp: string[], step: number) => {
  const idx = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].indexOf(step);
  return ramp[Math.max(0, idx)];
};

const surface = (bg: string, mode: Mode, delta = 0.02) => {
  return tweakL(bg, mode === 'light' ? +delta : -delta);
};

function mapBlock(block: RaysoBlock, mode: Mode): ShadcnBlock {
  const bg = block.background || (mode === 'light' ? '#ffffff' : '#0b0b0f');
  const fg = block.text || bestTextFor(bg);

  const neutralRamp = buildNeutralRamp(block);
  const primaryRamp = buildRamp(block.primary);
  const accentRamp = buildRamp(block.accent || block.accent_2 || block.secondary);

  const A = ANCHORS[mode];

  const primary = pick(primaryRamp, A.primary);
  const secondary = pick(accentRamp, mode === 'light' ? 500 : 400);
  const accent = pick(accentRamp, A.accent);
  const muted = pick(neutralRamp, A.muted);
  const border = pick(neutralRamp, A.border);

  const ensureFg = (on: string) => bestTextFor(on);
  const ring = tweakL(primary, mode === 'light' ? +0.10 : -0.10);

  const card = surface(bg, mode, 0.03);
  const popover = surface(bg, mode, 0.03);

  const destructiveSeed = block.accent_3 || block.destructive || '#ef4444';
  const destructiveRamp = buildRamp(destructiveSeed);
  const destructive = pick(destructiveRamp, mode === 'light' ? 500 : 400);

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
    'card-foreground': ensureFg(card),
    popover,
    'popover-foreground': ensureFg(popover),

    primary,
    'primary-foreground': ensureFg(primary),
    secondary,
    'secondary-foreground': ensureFg(secondary),

    muted,
    'muted-foreground': pick(neutralRamp, A.mutedFg),

    accent,
    'accent-foreground': ensureFg(accent),

    destructive,
    'destructive-foreground': ensureFg(destructive),

    border,
    input: border,
    ring,

    'chart-1': chart1,
    'chart-2': chart2,
    'chart-3': chart3,
    'chart-4': chart4,
    'chart-5': chart5,

    sidebar,
    'sidebar-foreground': ensureFg(sidebar),
    'sidebar-primary': primary,
    'sidebar-primary-foreground': ensureFg(primary),
    'sidebar-accent': sidebarAccent,
    'sidebar-accent-foreground': ensureFg(sidebarAccent),
    'sidebar-border': border,
    'sidebar-ring': ring,
  };
}

export function raysoToShadcn(rayso: RaysoTheme) {
  return {
    light: mapBlock(rayso.light, 'light'),
    dark: mapBlock(rayso.dark, 'dark'),
  };
}