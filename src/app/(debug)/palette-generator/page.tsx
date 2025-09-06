"use client";

import { formatHex, oklch } from "culori";
import { useMemo, useState } from "react";
import { ThemeSelector } from "@/components/shared/theme-selector";
import { generateTailwindPalette } from "@/lib/palette-generator";
import type { ThemeData } from "@/lib/theme-tokens";
import type { TinteTheme } from "@/types/tinte";
import { extractTinteThemeData } from "@/utils/tinte-presets";

const colorCategories = [
  { name: "red", hueRange: [355, 10] }, // narrower red range: 355-360, 0-10
  { name: "orange", hueRange: [10, 50] }, // wider orange range to catch 45°
  { name: "yellow", hueRange: [50, 80] }, // narrower yellow
  { name: "green", hueRange: [80, 165] },
  { name: "cyan", hueRange: [165, 200] },
  { name: "blue", hueRange: [200, 260] }, // wider blue range to catch 255°
  { name: "purple", hueRange: [260, 300] },
  { name: "magenta", hueRange: [300, 355] }, // wider magenta to catch 350°
];

function getHueCategory(hue: number) {
  if (hue === undefined || hue === null) return null;

  for (const category of colorCategories) {
    const [min, max] = category.hueRange;
    if (min > max) {
      // wraps around (red case: 350-10)
      if (hue >= min || hue <= max) return category.name;
    } else {
      if (hue >= min && hue < max) return category.name; // use < instead of <= to avoid overlap
    }
  }
  return null;
}

function isGrayscale(oklchColor: { c?: number } | undefined) {
  return !oklchColor?.c || oklchColor.c < 0.02; // very low chroma = grayscale
}

function extractExistingColors(theme: TinteTheme, isDark: boolean) {
  const mode = isDark ? theme.dark : theme.light;
  const relevantColors = [
    { key: "primary", color: mode.sc },
    { key: "accent", color: mode.pr },
    { key: "accent_2", color: mode.ac_2 },
    { key: "accent_3", color: mode.ac_3 },
    { key: "secondary", color: mode.ac_1 },
  ];

  // First pass: collect all colors by category
  const colorsByCategory = new Map<
    string,
    { color: string; chroma: number; lightness: number; key: string }[]
  >();

  for (const { key, color } of relevantColors) {
    const oklchColor = oklch(color);
    if (!oklchColor || isGrayscale(oklchColor)) continue;

    const category = getHueCategory(oklchColor.h || 0);
    if (!category) continue;

    if (!colorsByCategory.has(category)) {
      colorsByCategory.set(category, []);
    }

    colorsByCategory.get(category)?.push({
      color,
      chroma: oklchColor.c,
      lightness: oklchColor.l,
      key,
    });
  }

  // Second pass: select the best color for each category
  const finalColors = new Map<
    string,
    { color: string; chroma: number; lightness: number }
  >();

  for (const [category, colors] of colorsByCategory) {
    if (colors.length === 1) {
      // Only one color in this category, use it
      const color = colors[0];
      finalColors.set(category, {
        color: color.color,
        chroma: color.chroma,
        lightness: color.lightness,
      });
    } else {
      // Multiple colors in same category - prioritize by key importance, then chroma
      const priorityOrder = [
        "primary",
        "accent",
        "secondary",
        "accent_2",
        "accent_3",
      ];

      // Sort by priority first, then by chroma
      colors.sort((a, b) => {
        const aPriority = priorityOrder.indexOf(a.key);
        const bPriority = priorityOrder.indexOf(b.key);

        // If different priorities, use priority
        if (aPriority !== bPriority) {
          return (
            (aPriority === -1 ? 999 : aPriority) -
            (bPriority === -1 ? 999 : bPriority)
          );
        }

        // Same priority, use chroma
        return b.chroma - a.chroma;
      });

      const bestColor = colors[0];
      finalColors.set(category, {
        color: bestColor.color,
        chroma: bestColor.chroma,
        lightness: bestColor.lightness,
      });
    }
  }

  return finalColors;
}

function createIntelligentColorRamp(
  targetHue: number,
  theme: TinteTheme,
  isDark: boolean,
) {
  const mode = isDark ? theme.dark : theme.light;
  const allColors = [mode.sc, mode.pr, mode.ac_2, mode.ac_3, mode.ac_1];

  // Find the most chromatic color to use as chroma reference
  let bestChroma = 0.05; // minimum chroma for visible color
  for (const color of allColors) {
    const oklchColor = oklch(color);
    if (oklchColor && !isGrayscale(oklchColor)) {
      bestChroma = Math.max(bestChroma, oklchColor.c);
    }
  }

  // Create a color at the target hue with appropriate chroma and lightness
  const baseColor = formatHex({
    mode: "oklch",
    l: 0.55, // Start at 600 equivalent
    c: Math.min(0.15, bestChroma * 0.8), // Use theme's chroma intensity but capped
    h: targetHue,
  });

  return baseColor;
}

function generateColorPalette(theme: TinteTheme, isDark: boolean) {
  const existingColors = extractExistingColors(theme, isDark);
  const mode = isDark ? theme.dark : theme.light;

  // Calculate best chroma and average lightness from theme
  const allColors = [mode.sc, mode.pr, mode.ac_2, mode.ac_3, mode.ac_1];
  let bestChroma = 0.05;
  let totalLightness = 0;
  let lightColorsCount = 0;

  for (const color of allColors) {
    const oklchColor = oklch(color);
    if (oklchColor && !isGrayscale(oklchColor)) {
      bestChroma = Math.max(bestChroma, oklchColor.c);
      totalLightness += oklchColor.l;
      lightColorsCount++;
    }
  }

  // Use average lightness from existing colors, fallback to standard values
  const avgLightness =
    lightColorsCount > 0 ? totalLightness / lightColorsCount : 0.55;
  const lightness600 = avgLightness;
  const lightness400 = Math.min(0.85, avgLightness + 0.15); // slightly lighter for 400

  return colorCategories.map(({ name, hueRange }) => {
    const existing = existingColors.get(name);

    if (existing) {
      // Use existing color, but normalize to 600/400 values
      const existingOklch = oklch(existing.color);
      if (!existingOklch) {
        // Fallback to intelligent ramp if invalid color
        const targetHue = hueRange[0] + (hueRange[1] - hueRange[0]) / 2;
        const rampBase = createIntelligentColorRamp(targetHue, theme, isDark);
        const color600 = formatHex({
          mode: "oklch",
          l: 0.55,
          c: 0.1,
          h: targetHue,
        });
        const color400 = formatHex({
          mode: "oklch",
          l: 0.7,
          c: 0.08,
          h: targetHue,
        });
        return {
          name,
          light: color600,
          dark: color400,
          palette: generateTailwindPalette(rampBase),
          source: "ramp",
        };
      }

      // Keep original lightness for existing colors, just normalize the structure
      const color600 = formatHex({
        mode: "oklch",
        l: existingOklch.l, // preserve original lightness
        c: existingOklch.c,
        h: existingOklch.h,
      });

      const color400 = formatHex({
        mode: "oklch",
        l: Math.min(0.9, existingOklch.l + 0.15), // slightly lighter version
        c: existingOklch.c * 0.9,
        h: existingOklch.h,
      });

      return {
        name,
        light: color600,
        dark: color400,
        palette: generateTailwindPalette(existing.color),
        source: "existing",
      };
    } else {
      // Create color ramp for missing colors using specific hue
      // Calculate target hue (handle wrap-around for red)
      const targetHue =
        hueRange[0] > hueRange[1]
          ? ((hueRange[0] + hueRange[1] + 360) / 2) % 360
          : // red case: (355 + 10 + 360) / 2 % 360 = 2.5°
            (hueRange[0] + hueRange[1]) / 2;

      const color600 = formatHex({
        mode: "oklch",
        l: lightness600, // use theme's average lightness
        c: Math.min(0.12, bestChroma * 0.8),
        h: targetHue,
      });

      const color400 = formatHex({
        mode: "oklch",
        l: lightness400, // use theme's lighter variant
        c: Math.min(0.1, bestChroma * 0.7),
        h: targetHue,
      });

      return {
        name,
        light: color600,
        dark: color400,
        palette: generateTailwindPalette(color600),
        source: "ramp",
      };
    }
  });
}

export default function PaletteGeneratorPage() {
  const themes = extractTinteThemeData() as ThemeData[];
  const [selectedTheme, setSelectedTheme] = useState<ThemeData>(themes[0]);
  const [isDark, setIsDark] = useState(false);

  const themeColors = selectedTheme.rawTheme as TinteTheme;

  const colorPalette = useMemo(
    () => generateColorPalette(themeColors, isDark),
    [themeColors, isDark],
  );

  if (!colorPalette) return <div>Error generating colors</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Palette Generator Test</h1>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="px-3 py-1 rounded border text-sm"
          >
            {isDark ? "Dark" : "Light"} Mode
          </button>
          <ThemeSelector
            themes={themes}
            activeId={selectedTheme.id}
            onSelect={setSelectedTheme}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Extracted Color Palette
          </h2>

          {/* Debug info */}
          <div className="mb-4 p-3 bg-gray-50 rounded text-xs">
            <div className="font-semibold mb-2">Theme Analysis:</div>
            <div className="grid grid-cols-1 gap-2 mb-3">
              {(() => {
                const mode = themeColors[isDark ? "dark" : "light"];
                const colors = [
                  { key: "Primary", color: mode.sc },
                  { key: "Accent", color: mode.pr },
                  { key: "Accent 2", color: mode.ac_2 },
                  { key: "Accent 3", color: mode.ac_3 },
                  { key: "Secondary", color: mode.ac_1 },
                ];

                return colors.map(({ key, color }) => {
                  const oklchColor = oklch(color);
                  const hue = oklchColor?.h;
                  const chroma = oklchColor?.c;
                  const category =
                    hue !== undefined ? getHueCategory(hue) : "N/A";
                  const isGray = oklchColor ? isGrayscale(oklchColor) : true;

                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium">{key}:</span>
                      <span>{color}</span>
                      <span className="text-gray-600">
                        H:{hue?.toFixed(0) || "N/A"}° L:
                        {oklchColor?.l?.toFixed(2) || "N/A"}
                        C:{chroma?.toFixed(2) || "N/A"}→{" "}
                        {isGray ? "GRAY" : category || "NONE"}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="mt-3 pt-2 border-t text-xs text-gray-600">
              <strong>Calculated Values:</strong>
              Avg Lightness: {(() => {
                const mode = themeColors[isDark ? "dark" : "light"];
                const allColors = [
                  mode.sc,
                  mode.pr,
                  mode.ac_2,
                  mode.ac_3,
                  mode.ac_1,
                ];
                let totalLightness = 0;
                let lightColorsCount = 0;

                for (const color of allColors) {
                  const oklchColor = oklch(color);
                  if (oklchColor && !isGrayscale(oklchColor)) {
                    totalLightness += oklchColor.l;
                    lightColorsCount++;
                  }
                }

                const avgLightness =
                  lightColorsCount > 0
                    ? totalLightness / lightColorsCount
                    : 0.55;
                return avgLightness.toFixed(2);
              })()}| Best Chroma: {(() => {
                const mode = themeColors[isDark ? "dark" : "light"];
                const allColors = [
                  mode.sc,
                  mode.pr,
                  mode.ac_2,
                  mode.ac_3,
                  mode.ac_1,
                ];
                let bestChroma = 0.05;

                for (const color of allColors) {
                  const oklchColor = oklch(color);
                  if (oklchColor && !isGrayscale(oklchColor)) {
                    bestChroma = Math.max(bestChroma, oklchColor.c);
                  }
                }

                return bestChroma.toFixed(2);
              })()}
            </div>
          </div>

          <div className="grid grid-cols-8 gap-4">
            {colorPalette.map((color) => (
              <div key={color.name} className="space-y-2">
                <div className="text-center">
                  <div className="text-sm font-medium">{color.name}</div>
                  <div className="text-xs text-gray-500">
                    {isDark ? color.dark : color.light}
                  </div>
                  <div className="text-[10px] text-blue-600 font-mono">
                    {color.source}
                  </div>
                </div>
                <div className="space-y-1">
                  <div
                    className="w-full h-16 rounded border"
                    style={{ backgroundColor: color.light }}
                    title={`600 (light): ${color.light}`}
                  />
                  <div
                    className="w-full h-16 rounded border"
                    style={{ backgroundColor: color.dark }}
                    title={`400 (dark): ${color.dark}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Full Palettes</h2>
          <div className="space-y-6">
            {colorPalette.map((color) => (
              <div key={color.name} className="space-y-2">
                <h3 className="font-medium capitalize flex items-center gap-2">
                  {color.name}
                  <span className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded">
                    {color.source}
                  </span>
                </h3>
                <div className="grid grid-cols-11 gap-1">
                  {color.palette.map((shade) => (
                    <div key={shade.name} className="space-y-1">
                      <div
                        className="w-full h-12 rounded border text-xs flex items-end justify-center pb-1"
                        style={{ backgroundColor: shade.value }}
                        title={shade.value}
                      >
                        <span className="text-white drop-shadow text-[10px]">
                          {shade.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-center text-gray-500">
                        {shade.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
