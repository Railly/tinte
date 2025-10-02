import { formatHex, rgb, oklch } from "culori";
import { convertTheme } from "./providers";
import { computeShadowVars } from "./providers/shadcn";
import type { ThemeData } from "./theme-tokens";
import type { TinteTheme } from "@/types/tinte";
import type { ShadcnTheme } from "@/types/shadcn";
import type { NormalizedOverrides, ProviderOverride } from "@/types/overrides";
import { isPaletteColor } from "@/types/overrides";

type ThemeMode = "light" | "dark";

function convertColorToHex(color: string): string {
  if (!color || color.startsWith("#")) return color;

  if (color.startsWith("oklch(") || color.startsWith("hsl(")) {
    try {
      const parsed = oklch(color);
      if (parsed) {
        return formatHex(rgb(parsed)) || color;
      }
    } catch {
      return color;
    }
  }

  return color;
}

function extractTinteTheme(theme: ThemeData): TinteTheme {
  if (theme?.rawTheme && typeof theme.rawTheme === "object") {
    if ("light" in theme.rawTheme && "dark" in theme.rawTheme) {
      const possibleTinte = theme.rawTheme as TinteTheme;
      if (possibleTinte.light.tx && possibleTinte.light.ui) {
        return possibleTinte;
      }
    }
  }

  if (theme && "light_bg" in theme && "dark_bg" in theme) {
    const flatTheme = theme as any;
    return {
      light: {
        bg: flatTheme.light_bg,
        bg_2: flatTheme.light_bg_2,
        ui: flatTheme.light_ui,
        ui_2: flatTheme.light_ui_2,
        ui_3: flatTheme.light_ui_3,
        tx: flatTheme.light_tx,
        tx_2: flatTheme.light_tx_2,
        tx_3: flatTheme.light_tx_3,
        pr: flatTheme.light_pr,
        sc: flatTheme.light_sc,
        ac_1: flatTheme.light_ac_1,
        ac_2: flatTheme.light_ac_2,
        ac_3: flatTheme.light_ac_3,
      },
      dark: {
        bg: flatTheme.dark_bg,
        bg_2: flatTheme.dark_bg_2,
        ui: flatTheme.dark_ui,
        ui_2: flatTheme.dark_ui_2,
        ui_3: flatTheme.dark_ui_3,
        tx: flatTheme.dark_tx,
        tx_2: flatTheme.dark_tx_2,
        tx_3: flatTheme.dark_tx_3,
        pr: flatTheme.dark_pr,
        sc: flatTheme.dark_sc,
        ac_1: flatTheme.dark_ac_1,
        ac_2: flatTheme.dark_ac_2,
        ac_3: flatTheme.dark_ac_3,
      },
    };
  }

  throw new Error("Unable to extract TinteTheme from theme data");
}

function computeBaseTokens(tinteTheme: TinteTheme, mode: ThemeMode): Record<string, string> {
  const shadcnTheme = convertTheme("shadcn", tinteTheme) as ShadcnTheme;
  const modeData = shadcnTheme[mode];

  const tokens: Record<string, string> = {};

  for (const [key, value] of Object.entries(modeData)) {
    if (typeof value === "string") {
      tokens[key] = convertColorToHex(value);
    }
  }

  return tokens;
}

function applyProviderOverride(
  tokens: Record<string, string>,
  override: ProviderOverride | undefined,
  mode: ThemeMode
): void {
  if (!override) return;

  const modeOverrides = override[mode];
  if (modeOverrides) {
    for (const [key, value] of Object.entries(modeOverrides)) {
      if (typeof value === "string") {
        tokens[key] = isPaletteColor(key) ? convertColorToHex(value) : value;
      }
    }
  }

  if (override.fonts) {
    if (override.fonts.sans) tokens["font-sans"] = override.fonts.sans;
    if (override.fonts.serif) tokens["font-serif"] = override.fonts.serif;
    if (override.fonts.mono) tokens["font-mono"] = override.fonts.mono;
  }

  if (override.radius) {
    if (typeof override.radius === "object") {
      Object.entries(override.radius).forEach(([key, value]) => {
        tokens[`radius-${key}`] = value;
      });
      tokens["radius"] = override.radius.md || override.radius.lg || "0.5rem";
    } else {
      tokens["radius"] = override.radius;
    }
  }

  if (override.letter_spacing) {
    tokens["letter-spacing"] = override.letter_spacing;
  }

  if (override.shadows) {
    const modeShadows = override.shadows[mode];
    console.log("🔧 [applyProviderOverride] Applying shadows for mode:", mode, modeShadows);
    if (modeShadows) {
      if (modeShadows.color) tokens["shadow-color"] = modeShadows.color;
      if (modeShadows.opacity) tokens["shadow-opacity"] = modeShadows.opacity;
      if (modeShadows.blur) tokens["shadow-blur"] = modeShadows.blur;
      if (modeShadows.spread) tokens["shadow-spread"] = modeShadows.spread;
      if (modeShadows.offsetX) tokens["shadow-offset-x"] = modeShadows.offsetX;
      if (modeShadows.offsetY) tokens["shadow-offset-y"] = modeShadows.offsetY;
      console.log("🔧 [applyProviderOverride] Shadow tokens applied:", {
        "shadow-color": tokens["shadow-color"],
        "shadow-opacity": tokens["shadow-opacity"],
        "shadow-blur": tokens["shadow-blur"],
        "shadow-spread": tokens["shadow-spread"],
        "shadow-offset-x": tokens["shadow-offset-x"],
        "shadow-offset-y": tokens["shadow-offset-y"],
      });
    }
  }
}

export function computeFinalTokens(
  theme: ThemeData,
  mode: ThemeMode,
  overrides: NormalizedOverrides,
  editedTokens: Record<string, string> = {}
): Record<string, string> {
  const tinteTheme = extractTinteTheme(theme);
  const tokens = computeBaseTokens(tinteTheme, mode);

  applyProviderOverride(tokens, overrides.shadcn, mode);
  applyProviderOverride(tokens, overrides.vscode, mode);
  applyProviderOverride(tokens, overrides.shiki, mode);

  Object.assign(tokens, editedTokens);

  const hasShadowProps = Object.keys(tokens).some(key => key.startsWith("shadow-"));
  if (hasShadowProps) {
    const shadowVars = computeShadowVars(tokens);
    Object.assign(tokens, shadowVars);
  }

  return tokens;
}

export { extractTinteTheme, convertColorToHex };
