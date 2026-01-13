import { GimpPreview } from "@/components/preview/gimp/gimp-preview";
import { GIMPIcon } from "@/components/shared/icons";
import { makePolineFromTinte, polineRampHex } from "@/lib/ice-theme";
import type { TinteTheme } from "@/types/tinte";
import {
  createPolineColorMapping,
  getDisplayName,
  getThemeName,
  hexToInt,
} from "./poline-base";
import type { PreviewableProvider, ProviderOutput } from "./types";

export interface GIMPPalette {
  name: string;
  colors: Array<{
    red: number;
    green: number;
    blue: number;
    name: string;
  }>;
}

function formatAbbreviationToSemantic(key: string): string {
  const mappings: Record<string, string> = {
    // Base tones
    bg: "Background",
    bg2: "Background Secondary",
    ui: "Interface",
    ui2: "Interface Hover",
    ui3: "Interface Active",
    tx: "Text",
    tx2: "Text Muted",
    tx3: "Text Faint",

    // Accent colors
    primary: "Primary",
    secondary: "Secondary",
    accent: "Accent",
    accent2: "Accent 2",
    accent3: "Accent 3",

    // ANSI colors
    red: "Red",
    red2: "Light Red",
    green: "Green",
    green2: "Light Green",
    yellow: "Yellow",
    yellow2: "Light Yellow",
    blue: "Blue",
    blue2: "Light Blue",
    magenta: "Magenta",
    magenta2: "Light Magenta",
    cyan: "Cyan",
    cyan2: "Light Cyan",
  };

  return mappings[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

function generateGIMPPalette(
  theme: TinteTheme,
  mode: "light" | "dark",
): GIMPPalette {
  const block = theme[mode];
  const colorMapping = createPolineColorMapping(block);

  // Create color entries for all mapped colors
  const colors: Array<{
    red: number;
    green: number;
    blue: number;
    name: string;
  }> = [];

  // Add all colors from the mapping
  Object.entries(colorMapping).forEach(([key, hex]) => {
    const rgb = hexToInt(hex);
    colors.push({
      red: rgb.red,
      green: rgb.green,
      blue: rgb.blue,
      name: formatAbbreviationToSemantic(key),
    });
  });

  // Also add the full Poline ramp for extra color options
  const poline = makePolineFromTinte(block);
  const polineRamp = polineRampHex(poline);

  polineRamp.forEach((hex, index) => {
    const rgb = hexToInt(hex);
    colors.push({
      red: rgb.red,
      green: rgb.green,
      blue: rgb.blue,
      name: `Poline ${index + 1}`,
    });
  });

  return {
    name: getDisplayName("Tinte Theme", mode),
    colors,
  };
}

export const gimpProvider: PreviewableProvider<{
  light: GIMPPalette;
  dark: GIMPPalette;
}> = {
  metadata: {
    id: "gimp",
    name: "GIMP",
    description: "GNU Image Manipulation Program color palette",
    category: "design",
    tags: ["design", "graphics", "image-editing", "palette"],
    icon: GIMPIcon,
    website: "https://www.gimp.org/",
    documentation: "https://docs.gimp.org/en/gimp-concepts-palettes.html",
  },

  fileExtension: "gpl",
  mimeType: "text/plain",

  convert: (theme: TinteTheme) => ({
    light: generateGIMPPalette(theme, "light"),
    dark: generateGIMPPalette(theme, "dark"),
  }),

  export: (theme: TinteTheme, filename?: string): ProviderOutput => {
    const converted = gimpProvider.convert(theme);
    const themeName = filename || getThemeName("tinte-theme");

    // Use dark palette by default, but we could generate both
    const palette = converted.dark;

    // Calculate max lengths for padding
    const maxLengths = {
      red: Math.max(...palette.colors.map((c) => c.red.toString().length)),
      green: Math.max(...palette.colors.map((c) => c.green.toString().length)),
      blue: Math.max(...palette.colors.map((c) => c.blue.toString().length)),
    };

    // Generate GIMP palette format
    const gimpContent = [
      "GIMP Palette",
      `Name: ${palette.name}`,
      "Columns: 8",
      "#",
      ...palette.colors.map((color) => {
        const paddedRed = color.red.toString().padStart(maxLengths.red, " ");
        const paddedGreen = color.green
          .toString()
          .padStart(maxLengths.green, " ");
        const paddedBlue = color.blue.toString().padStart(maxLengths.blue, " ");

        return `${paddedRed} ${paddedGreen} ${paddedBlue}  ${color.name}`;
      }),
    ].join("\n");

    return {
      content: gimpContent,
      filename: `${themeName}-gimp.gpl`,
      mimeType: gimpProvider.mimeType,
    };
  },

  validate: (output: { light: GIMPPalette; dark: GIMPPalette }) => {
    const validatePalette = (palette: GIMPPalette) =>
      !!(
        palette.name &&
        palette.colors &&
        palette.colors.length > 0 &&
        palette.colors.every(
          (color) =>
            typeof color.red === "number" &&
            typeof color.green === "number" &&
            typeof color.blue === "number" &&
            typeof color.name === "string" &&
            color.red >= 0 &&
            color.red <= 255 &&
            color.green >= 0 &&
            color.green <= 255 &&
            color.blue >= 0 &&
            color.blue <= 255,
        )
      );

    return validatePalette(output.light) && validatePalette(output.dark);
  },

  preview: {
    component: GimpPreview,
  },
};
