import { oklch } from "culori";
import type { TinteTheme } from "@tinte/core";
import {
  computeShadowVars,
  convertTinteToShadcn,
} from "@tinte/providers";
import type { ThemeSelect } from "@/db/schema/theme";

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

function formatOklch(color: string): string {
  const parsed = oklch(color);
  if (!parsed) return color;
  const l = parsed.l.toFixed(4);
  const c = parsed.c.toFixed(4);
  const h = (parsed.h ?? 0).toFixed(4);
  return `oklch(${l} ${c} ${h})`;
}

export function themeRecordToTinte(record: ThemeSelect): TinteTheme {
  return {
    light: {
      bg: record.light_bg,
      bg_2: record.light_bg_2,
      ui: record.light_ui,
      ui_2: record.light_ui_2,
      ui_3: record.light_ui_3,
      tx: record.light_tx,
      tx_2: record.light_tx_2,
      tx_3: record.light_tx_3,
      pr: record.light_pr,
      sc: record.light_sc,
      ac_1: record.light_ac_1,
      ac_2: record.light_ac_2,
      ac_3: record.light_ac_3,
    },
    dark: {
      bg: record.dark_bg,
      bg_2: record.dark_bg_2,
      ui: record.dark_ui,
      ui_2: record.dark_ui_2,
      ui_3: record.dark_ui_3,
      tx: record.dark_tx,
      tx_2: record.dark_tx_2,
      tx_3: record.dark_tx_3,
      pr: record.dark_pr,
      sc: record.dark_sc,
      ac_1: record.dark_ac_1,
      ac_2: record.dark_ac_2,
      ac_3: record.dark_ac_3,
    },
  };
}

function applyOverrides(
  shadcnTheme: { light: Record<string, string>; dark: Record<string, string> },
  overrides: any,
) {
  if (!overrides) return;

  const fontOverrides = overrides.fonts || {};
  const radiusOverrides = overrides.radius;

  for (const mode of ["light", "dark"] as const) {
    const modePaletteOverrides = overrides.palettes?.[mode] || {};
    const modeShadowOverrides = modePaletteOverrides.shadow;

    for (const [key, value] of Object.entries(modePaletteOverrides)) {
      if (key !== "shadow" && typeof value === "string") {
        shadcnTheme[mode][key] = value;
      }
    }

    if (fontOverrides["font-sans"]) {
      shadcnTheme[mode]["font-sans"] = fontOverrides["font-sans"];
    }
    if (fontOverrides["font-serif"]) {
      shadcnTheme[mode]["font-serif"] = fontOverrides["font-serif"];
    }
    if (fontOverrides["font-mono"]) {
      shadcnTheme[mode]["font-mono"] = fontOverrides["font-mono"];
    }

    if (modeShadowOverrides) {
      if (modeShadowOverrides.color)
        shadcnTheme[mode]["shadow-color"] = modeShadowOverrides.color;
      if (modeShadowOverrides.opacity)
        shadcnTheme[mode]["shadow-opacity"] = modeShadowOverrides.opacity;
      if (modeShadowOverrides.blur)
        shadcnTheme[mode]["shadow-blur"] = modeShadowOverrides.blur;
      if (modeShadowOverrides.spread)
        shadcnTheme[mode]["shadow-spread"] = modeShadowOverrides.spread;
      if (modeShadowOverrides.offset_x)
        shadcnTheme[mode]["shadow-x"] = modeShadowOverrides.offset_x;
      if (modeShadowOverrides.offset_y)
        shadcnTheme[mode]["shadow-y"] = modeShadowOverrides.offset_y;
    }

    if (radiusOverrides) {
      if (typeof radiusOverrides === "object") {
        if (radiusOverrides.sm)
          shadcnTheme[mode]["radius-sm"] = radiusOverrides.sm;
        if (radiusOverrides.md)
          shadcnTheme[mode]["radius-md"] = radiusOverrides.md;
        if (radiusOverrides.lg)
          shadcnTheme[mode]["radius-lg"] = radiusOverrides.lg;
        if (radiusOverrides.xl)
          shadcnTheme[mode]["radius-xl"] = radiusOverrides.xl;
        shadcnTheme[mode].radius =
          radiusOverrides.md || radiusOverrides.lg || "0.5rem";
      } else {
        shadcnTheme[mode].radius = radiusOverrides;
      }
    }
  }
}

function formatTokens(
  tokens: Record<string, string>,
  shadowVars: Record<string, string>,
): Record<string, string> {
  const result: Record<string, string> = {};
  const allTokens = { ...tokens, ...shadowVars };

  for (const [key, value] of Object.entries(allTokens)) {
    if (typeof value !== "string") continue;
    if (COLOR_TOKENS.has(key)) {
      if (
        value.startsWith("#") ||
        value.startsWith("hsl") ||
        value.startsWith("rgb")
      ) {
        result[key] = formatOklch(value);
        continue;
      }
    }
    result[key] = value;
  }

  return result;
}

export type RegistryItemType = "registry:theme" | "registry:base";

export function buildRegistryItem(
  record: ThemeSelect,
  type: RegistryItemType = "registry:theme",
) {
  const tinteTheme = themeRecordToTinte(record);
  const shadcnBase = convertTinteToShadcn(tinteTheme);
  const shadcnTheme = {
    light: { ...shadcnBase.light } as Record<string, string>,
    dark: { ...shadcnBase.dark } as Record<string, string>,
  };

  applyOverrides(shadcnTheme, record.shadcn_override);

  const lightShadowVars = computeShadowVars(shadcnTheme.light);
  const darkShadowVars = computeShadowVars(shadcnTheme.dark);

  const slug =
    record.slug ||
    record.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: slug,
    type,
    title: record.name,
    description: record.concept || `${record.name} - A design system created with Tinte`,
    author: "tinte.dev",
    cssVars: {
      light: formatTokens(shadcnTheme.light, lightShadowVars),
      dark: formatTokens(shadcnTheme.dark, darkShadowVars),
    },
  };
}

export function buildFontRegistryItem(
  family: string,
  variable: "--font-sans" | "--font-serif" | "--font-mono" = "--font-sans",
) {
  const slug = family
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: `font-${slug}`,
    type: "registry:font" as const,
    title: `${family} Font`,
    description: `${family} font from Google Fonts`,
    font: {
      family: `'${family}', sans-serif`,
      provider: "google",
      import: family,
      variable,
      subsets: ["latin"],
    },
    files: [],
  };
}
