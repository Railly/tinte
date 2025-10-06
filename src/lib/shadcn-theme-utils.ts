import { convertTinteToShadcn } from "@/lib/providers/shadcn";
import type { ShadcnTheme } from "@/types/shadcn";
import type { TinteTheme } from "@/types/tinte";

export function getShadcnPaletteWithOverrides(
  tinteTheme: TinteTheme,
  mode: "light" | "dark",
  shadcnOverride?: any,
): Record<string, string> {
  if (!tinteTheme) return {};

  const overrides = shadcnOverride || {};
  const modeShadows = overrides?.shadows?.[mode];

  // Get mode-specific color overrides - support both structures:
  // 1. DB format: overrides.palettes.{mode}
  // 2. Direct format: overrides.{mode}
  const modeColorOverrides =
    overrides?.palettes?.[mode] || overrides?.[mode] || {};

  const themeWithOverrides = {
    ...tinteTheme,
    ...(overrides?.fonts && { fonts: overrides.fonts }),
    ...(overrides?.radius && { radius: overrides.radius }),
    ...(modeShadows && { shadows: modeShadows }),
  };

  const converted = convertTinteToShadcn(themeWithOverrides);
  const palette = {
    ...converted[mode],
    ...modeColorOverrides,
  };

  // Add radius if available from overrides or converted theme
  if (overrides?.radius) {
    palette.radius = overrides.radius;
  } else if (converted[mode]?.radius) {
    palette.radius = converted[mode].radius;
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

  const lightVars = Object.entries(lightPalette)
    .map(([key, value]) => `    --${key}: ${value};`)
    .join("\n");

  const darkVars = Object.entries(darkPalette)
    .map(([key, value]) => `    --${key}: ${value};`)
    .join("\n");

  return `:root {\n${lightVars}\n}\n\n.dark {\n${darkVars}\n}`;
}
