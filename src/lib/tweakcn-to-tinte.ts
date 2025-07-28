// Only need generateTailwindPalette - no complex color manipulation needed
import { generateTailwindPalette } from "./palette-generator";
import { TinteTheme, TinteBlock } from "@/types/tinte";

type Mode = "light" | "dark";
type TweakcnBlock = Record<string, string>;
type TweakcnTheme = { light: TweakcnBlock; dark: TweakcnBlock };

// Similar to rayso-to-shadcn's buildRamp approach
function buildNeutralRamp(block: TweakcnBlock): string[] {
  const seed = block.border || block.input || block.background || "#808080";
  return generateTailwindPalette(seed).map((s) => s.value);
}

function buildRamp(seed?: string): string[] {
  const base = seed || "#64748b";
  return generateTailwindPalette(base).map((s) => s.value);
}

// Direct mapping similar to rayso-to-shadcn's pick function
const pick = (ramp: string[], step: number) => {
  const idx = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].indexOf(
    step
  );
  return ramp[Math.max(0, idx)];
};

// Simple Flexoki-style mapping using the same pattern as rayso-to-shadcn
const FLEXOKI_ANCHORS = {
  light: {
    bg: 50,
    bg2: 100,
    ui: 200,
    ui2: 300,
    ui3: 400,
    tx3: 600,
    tx2: 700,
    tx: 900,
  },
  dark: {
    bg: 950,
    bg2: 900,
    ui: 800,
    ui2: 700,
    ui3: 600,
    tx3: 400,
    tx2: 300,
    tx: 100,
  },
} as const;

function mapToTinte(block: TweakcnBlock, mode: Mode): TinteBlock {
  const bg = block.background || (mode === "light" ? "#ffffff" : "#000000");
  const fg = block.foreground || (mode === "light" ? "#000000" : "#ffffff");
  const primary = block.primary || (mode === "light" ? "#3b82f6" : "#60a5fa");

  // Build ramps like rayso-to-shadcn (this is the key difference!)
  const neutralRamp = buildNeutralRamp(block);
  const primaryRamp = buildRamp(block.primary);

  // Build accent ramp from chart colors or fallbacks (same priority as rayso-to-shadcn)
  const accentRamp = buildRamp(
    block["chart-2"] || block.accent || block.secondary || primary
  );

  // Get anchors for current mode
  const A = FLEXOKI_ANCHORS[mode];

  // Generate colors from ramps like rayso-to-shadcn does
  const accent = pick(accentRamp, A.ui3); // Similar to accent anchor in rayso-to-shadcn
  const accent_2 =
    block["chart-4"] || pick(accentRamp, mode === "light" ? 300 : 600);
  const accent_3 =
    block["chart-3"] ||
    block.destructive ||
    pick(accentRamp, mode === "light" ? 700 : 300);

  // Secondary follows rayso-to-shadcn pattern: pick from accentRamp, NOT original token
  const secondary = pick(accentRamp, mode === "light" ? 500 : 400);

  return {
    // Flexoki continuous scale using direct token mapping
    background: bg,
    background_2: block.card || block.popover || pick(neutralRamp, A.bg2),
    interface: block.border || pick(neutralRamp, A.ui),
    interface_2: pick(neutralRamp, A.ui2),
    interface_3: block.input || pick(neutralRamp, A.ui3),
    text_3: pick(neutralRamp, A.tx3),
    text_2: block["muted-foreground"] || pick(neutralRamp, A.tx2),
    text: fg,

    // Accent system - now uses ramp-generated colors like rayso-to-shadcn
    primary: pick(primaryRamp, mode === "light" ? 600 : 400), // Match rayso-to-shadcn anchors
    accent, // Generated from accentRamp
    accent_2, // chart-4 or generated
    accent_3, // chart-3 or generated
    secondary, // Generated from accentRamp (NOT original token!)
  };
}

export function tweakcnToTinte(tweakcn: TweakcnTheme): TinteTheme {
  return {
    light: mapToTinte(tweakcn.light, "light"),
    dark: mapToTinte(tweakcn.dark, "dark"),
  };
}
