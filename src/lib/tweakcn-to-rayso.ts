import { oklch, rgb, formatHex } from "culori";
import { generateTailwindPalette } from "./palette-generator";
import { RaysoTheme, RaysoBlock } from "@/types/rayso";

type Mode = "light" | "dark";
type TweakcnBlock = Record<string, string>;
type TweakcnTheme = { light: TweakcnBlock; dark: TweakcnBlock };

// Helper to extract chroma and lightness for better color relationships
const toOklch = (hex: string) => {
  const color = oklch(hex);
  return {
    l: color?.l || 0,
    c: color?.c || 0,
    h: color?.h || 0,
  };
};

// Create Flexoki-style continuous scale using your robust palette generator
const createFlexokiScale = (
  bg: string,
  fg: string,
  existingTokens: Record<string, string>,
  mode: Mode
) => {
  // Generate a neutral ramp using your palette generator
  // We'll use the midpoint between bg and fg as seed to get a proper neutral ramp
  const bgOklch = toOklch(bg);
  const fgOklch = toOklch(fg);

  // Create a neutral seed color that's roughly in the middle
  const neutralSeed =
    formatHex(
      rgb({
        mode: "oklch" as const,
        l: (bgOklch.l + fgOklch.l) / 2,
        c: Math.min(bgOklch.c, fgOklch.c) * 0.3, // Low chroma for neutral
        h: bgOklch.h,
      })
    ) || "#808080";

  // Generate the full tailwind palette using your generator
  const neutralPalette = generateTailwindPalette(neutralSeed);

  // Map Flexoki positions to Tailwind stops based on mode
  const flexokiMapping =
    mode === "light"
      ? {
          // Light mode: bg (lightest) → tx (darkest)
          background: neutralPalette[0].value, // 50 (lightest)
          background_2: neutralPalette[1].value, // 100
          interface: neutralPalette[2].value, // 200
          interface_2: neutralPalette[3].value, // 300
          interface_3: neutralPalette[4].value, // 400
          text_3: neutralPalette[6].value, // 600
          text_2: neutralPalette[7].value, // 700
          text: neutralPalette[9].value, // 900 (darkest)
        }
      : {
          // Dark mode: bg (darkest) → tx (lightest) - reversed
          background: neutralPalette[10].value, // 950 (darkest)
          background_2: neutralPalette[9].value, // 900
          interface: neutralPalette[8].value, // 800
          interface_2: neutralPalette[7].value, // 700
          interface_3: neutralPalette[6].value, // 600
          text_3: neutralPalette[4].value, // 400
          text_2: neutralPalette[3].value, // 300
          text: neutralPalette[1].value, // 100 (lightest)
        };

  // Override with existing tokens when available
  return {
    background: bg, // Always use the actual background
    background_2:
      existingTokens.card ||
      existingTokens.popover ||
      flexokiMapping.background_2,
    interface: existingTokens.border || flexokiMapping.interface,
    interface_2: flexokiMapping.interface_2,
    interface_3: existingTokens.input || flexokiMapping.interface_3,
    text_3: flexokiMapping.text_3,
    text_2: existingTokens["muted-foreground"] || flexokiMapping.text_2,
    text: fg, // Always use the actual foreground
  };
};

// Extract distinct accent variations from TweakCN tokens
const extractAccents = (block: TweakcnBlock, mode: Mode) => {
  const primary = block.primary;

  // Get distinct accent colors from different sources
  const accentSources = {
    secondary: block.secondary,
    accent: block.accent,
    destructive: block.destructive,
    chart1: block["chart-1"],
    chart2: block["chart-2"],
    chart3: block["chart-3"],
    chart4: block["chart-4"],
    chart5: block["chart-5"],
  };

  // Find 3 distinct colors that are different from primary
  const distinctColors = Object.values(accentSources)
    .filter(Boolean)
    .filter((color) => color !== primary)
    .slice(0, 3);

  // If we don't have enough distinct colors, generate variations
  const baseAccent = distinctColors[0] || block.secondary || primary;
  const baseOklch = toOklch(baseAccent);

  const accent = baseAccent;

  // accent_2: different hue rotation and lightness
  const accent_2 =
    distinctColors[1] ||
    formatHex(
      rgb({
        mode: "oklch" as const,
        l:
          mode === "light"
            ? Math.max(0.3, Math.min(0.8, baseOklch.l + 0.1))
            : Math.max(0.2, Math.min(0.9, baseOklch.l - 0.1)),
        c: Math.max(0.05, baseOklch.c * 1.1),
        h: (baseOklch.h + 60) % 360, // 60° hue rotation
      })
    ) ||
    accent;

  // accent_3: complementary or destructive color
  const accent_3 =
    distinctColors[2] ||
    block.destructive ||
    formatHex(
      rgb({
        mode: "oklch" as const,
        l:
          mode === "light"
            ? Math.max(0.25, Math.min(0.75, baseOklch.l - 0.05))
            : Math.max(0.25, Math.min(0.85, baseOklch.l + 0.05)),
        c: Math.max(0.08, baseOklch.c * 1.2),
        h: (baseOklch.h + 180) % 360, // Complementary hue
      })
    ) ||
    accent;

  return { accent, accent_2, accent_3 };
};

// This function is now replaced by createFlexokiScale
// Remove the old deriveTextColors function

function mapToRayso(block: TweakcnBlock, mode: Mode): RaysoBlock {
  const bg = block.background || (mode === "light" ? "#ffffff" : "#000000");
  const fg = block.foreground || (mode === "light" ? "#000000" : "#ffffff");
  const primary = block.primary || (mode === "light" ? "#3b82f6" : "#60a5fa");

  // Create Flexoki-style continuous scale from bg to tx
  const flexokiScale = createFlexokiScale(bg, fg, block, mode);

  // Extract accent variations with semantic meaning
  const { accent, accent_2, accent_3 } = extractAccents(block, mode);

  // Secondary color mapping - prefer actual secondary over accent
  const secondary = block.secondary || accent;

  return {
    // Flexoki continuous scale: bg → bg-2 → ui → ui-2 → ui-3 → tx-3 → tx-2 → tx
    background: flexokiScale.background, // bg: Main background (lightest in light, darkest in dark)
    background_2: flexokiScale.background_2, // bg-2: Secondary background (cards, modals)
    interface: flexokiScale.interface, // ui: Borders, separators
    interface_2: flexokiScale.interface_2, // ui-2: Hovered borders
    interface_3: flexokiScale.interface_3, // ui-3: Active borders, input backgrounds
    text_3: flexokiScale.text_3, // tx-3: Faint text (comments, placeholders)
    text_2: flexokiScale.text_2, // tx-2: Muted text (punctuation, operators)
    text: flexokiScale.text, // tx: Primary text (darkest in light, lightest in dark)

    // Accent system: distinct functional colors
    primary, // Primary actions, links
    accent, // Secondary accent, highlights
    accent_2, // Tertiary accent, alternative actions (60° hue rotation)
    accent_3, // Warning/destructive accent (complementary hue)

    // Legacy secondary mapping
    secondary,
  };
}

export function tweakcnToRayso(tweakcn: TweakcnTheme): RaysoTheme {
  return {
    light: mapToRayso(tweakcn.light, "light"),
    dark: mapToRayso(tweakcn.dark, "dark"),
  };
}
