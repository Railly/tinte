import { oklch } from "culori";
import {
  computeShadowVars,
  convertTinteToShadcn,
} from "../providers/shadcn";
import type { TinteTheme } from "@tinte/core";

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

function formatValue(key: string, value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "object") return null;

  const strValue = String(value);
  if (strValue === "undefined" || strValue === "[object Object]") return null;

  if (COLOR_TOKENS.has(key)) {
    if (
      strValue.startsWith("#") ||
      strValue.startsWith("hsl") ||
      strValue.startsWith("rgb")
    ) {
      return formatOklch(strValue);
    }
  }

  return strValue;
}

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

export function getShadcnPaletteWithOverrides(
  tinteTheme: TinteTheme,
  mode: "light" | "dark",
  shadcnOverride?: any,
): Record<string, string> {
  if (!tinteTheme) return {};

  const overrides = shadcnOverride || {};
  const modePaletteOverrides = overrides?.palettes?.[mode] || {};
  const modeShadowOverrides = modePaletteOverrides?.shadow;
  const fontOverrides = overrides?.fonts || {};
  const radiusOverrides = overrides?.radius;

  const fontsForConversion =
    fontOverrides["font-sans"] ||
    fontOverrides["font-serif"] ||
    fontOverrides["font-mono"]
      ? {
          sans:
            fontOverrides["font-sans"]
              ?.split(",")[0]
              ?.replace(/['"]/g, "")
              .trim() || undefined,
          serif:
            fontOverrides["font-serif"]
              ?.split(",")[0]
              ?.replace(/['"]/g, "")
              .trim() || undefined,
          mono:
            fontOverrides["font-mono"]
              ?.split(",")[0]
              ?.replace(/['"]/g, "")
              .trim() || undefined,
        }
      : undefined;

  const themeWithOverrides = {
    ...tinteTheme,
    ...(fontsForConversion && { fonts: fontsForConversion }),
    ...(radiusOverrides && { radius: radiusOverrides }),
  };

  const converted = convertTinteToShadcn(themeWithOverrides);
  const palette: Record<string, string> = {
    ...converted[mode],
  };

  Object.entries(modePaletteOverrides).forEach(([key, value]) => {
    if (key !== "shadow" && typeof value === "string") {
      palette[key] = value;
    }
  });

  if (fontOverrides["font-sans"]) {
    palette["font-sans"] = fontOverrides["font-sans"];
  }
  if (fontOverrides["font-serif"]) {
    palette["font-serif"] = fontOverrides["font-serif"];
  }
  if (fontOverrides["font-mono"]) {
    palette["font-mono"] = fontOverrides["font-mono"];
  }

  if (modeShadowOverrides) {
    if (modeShadowOverrides.color) {
      palette["shadow-color"] = modeShadowOverrides.color;
    }
    if (modeShadowOverrides.opacity) {
      palette["shadow-opacity"] = modeShadowOverrides.opacity;
    }
    if (modeShadowOverrides.blur) {
      palette["shadow-blur"] = modeShadowOverrides.blur;
    }
    if (modeShadowOverrides.spread) {
      palette["shadow-spread"] = modeShadowOverrides.spread;
    }
    if (modeShadowOverrides.offset_x) {
      palette["shadow-x"] = modeShadowOverrides.offset_x;
    }
    if (modeShadowOverrides.offset_y) {
      palette["shadow-y"] = modeShadowOverrides.offset_y;
    }
  }

  if (radiusOverrides) {
    if (typeof radiusOverrides === "object") {
      if (radiusOverrides.sm) palette["radius-sm"] = radiusOverrides.sm;
      if (radiusOverrides.md) palette["radius-md"] = radiusOverrides.md;
      if (radiusOverrides.lg) palette["radius-lg"] = radiusOverrides.lg;
      if (radiusOverrides.xl) palette["radius-xl"] = radiusOverrides.xl;
      palette.radius = radiusOverrides.md || radiusOverrides.lg || "0.5rem";
    } else {
      palette.radius = radiusOverrides;
    }
  }

  return palette;
}

export function getShadcnThemeCSS(
  tinteTheme: TinteTheme,
  shadcnOverride?: any,
): string {
  if (!tinteTheme) return "";

  const lightPalette = getShadcnPaletteWithOverrides(
    tinteTheme,
    "light",
    shadcnOverride,
  );
  const darkPalette = getShadcnPaletteWithOverrides(
    tinteTheme,
    "dark",
    shadcnOverride,
  );

  const lightShadowVars = computeShadowVars(lightPalette);
  const darkShadowVars = computeShadowVars(darkPalette);

  const lightWithShadows = { ...lightPalette, ...lightShadowVars };
  const darkWithShadows = { ...darkPalette, ...darkShadowVars };

  const lightVars = Object.entries(lightWithShadows)
    .map(([key, value]) => {
      const formatted = formatValue(key, value);
      return formatted !== null ? `  --${key}: ${formatted};` : null;
    })
    .filter(Boolean)
    .join("\n");

  const darkVars = Object.entries(darkWithShadows)
    .map(([key, value]) => {
      const formatted = formatValue(key, value);
      return formatted !== null ? `  --${key}: ${formatted};` : null;
    })
    .filter(Boolean)
    .join("\n");

  return `:root {\n${lightVars}\n}\n\n.dark {\n${darkVars}\n}\n\n${THEME_INLINE_BLOCK}`;
}
