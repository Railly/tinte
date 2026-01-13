import { AlacrittyIcon } from "@/components/shared/icons";
import type { TinteTheme } from "@/types/tinte";
import {
  createPolineColorMapping,
  getDisplayName,
  getThemeName,
  toYAML,
} from "./poline-base";
import type { PreviewableProvider, ProviderOutput } from "./types";

export interface AlacrittyTheme {
  colors: {
    primary: {
      background: string;
      foreground: string;
      dim_foreground?: string;
      bright_foreground?: string;
    };
    cursor: {
      text: string;
      cursor: string;
    };
    normal: {
      black: string;
      red: string;
      green: string;
      yellow: string;
      blue: string;
      magenta: string;
      cyan: string;
      white: string;
    };
    bright: {
      black: string;
      red: string;
      green: string;
      yellow: string;
      blue: string;
      magenta: string;
      cyan: string;
      white: string;
    };
    dim?: {
      black: string;
      red: string;
      green: string;
      yellow: string;
      blue: string;
      magenta: string;
      cyan: string;
      white: string;
    };
  };
}

function generateAlacrittyTheme(
  theme: TinteTheme,
  mode: "light" | "dark",
): AlacrittyTheme {
  const block = theme[mode];
  const colorMapping = createPolineColorMapping(block);

  // Use opposite mode for some contrast colors
  const oppositeBlock = theme[mode === "light" ? "dark" : "light"];
  const oppositeMapping = createPolineColorMapping(oppositeBlock);

  return {
    colors: {
      primary: {
        background: colorMapping.bg,
        foreground: colorMapping.tx,
        dim_foreground: colorMapping.tx2,
        bright_foreground: colorMapping.tx,
      },
      cursor: {
        text: colorMapping.tx2,
        cursor: colorMapping.accent,
      },
      normal: {
        black: oppositeMapping.bg, // Use opposite mode for black
        red: colorMapping.red2,
        green: colorMapping.green2,
        yellow: colorMapping.yellow2,
        blue: colorMapping.blue2,
        magenta: colorMapping.magenta2,
        cyan: colorMapping.cyan2,
        white: colorMapping.tx,
      },
      bright: {
        black: colorMapping.tx3,
        red: colorMapping.red,
        green: colorMapping.green,
        yellow: colorMapping.yellow,
        blue: colorMapping.blue,
        magenta: colorMapping.magenta,
        cyan: colorMapping.cyan,
        white: oppositeMapping.bg, // Use opposite mode for bright white
      },
      dim: {
        black: oppositeMapping.bg,
        red: colorMapping.red2,
        green: colorMapping.green2,
        yellow: colorMapping.yellow2,
        blue: colorMapping.blue2,
        magenta: colorMapping.magenta2,
        cyan: colorMapping.cyan2,
        white: colorMapping.tx2,
      },
    },
  };
}

import { AlacrittyPreview } from "@/components/preview/alacritty/alacritty-preview";

export const alacrittyProvider: PreviewableProvider<{
  light: AlacrittyTheme;
  dark: AlacrittyTheme;
}> = {
  metadata: {
    id: "alacritty",
    name: "Alacritty",
    description: "Cross-platform, OpenGL terminal emulator",
    category: "terminal",
    tags: ["terminal", "opengl", "cross-platform"],
    icon: AlacrittyIcon,
    website: "https://alacritty.org/",
    documentation: "https://alacritty.org/config.html",
  },

  fileExtension: "yml",
  mimeType: "application/x-yaml",

  convert: (theme: TinteTheme) => ({
    light: generateAlacrittyTheme(theme, "light"),
    dark: generateAlacrittyTheme(theme, "dark"),
  }),

  export: (theme: TinteTheme, filename?: string): ProviderOutput => {
    const converted = alacrittyProvider.convert(theme);
    const themeName = filename || getThemeName("tinte-theme");

    const output = {
      ...converted.dark,
      "# Theme": getDisplayName("Tinte Theme"),
      "# Generator": "Tinte Theme Converter",
      "# Light mode available":
        "Switch colors.primary.background and colors.primary.foreground",
    };

    return {
      content: toYAML(output),
      filename: `${themeName}-alacritty.yml`,
      mimeType: alacrittyProvider.mimeType,
    };
  },

  validate: (output) => {
    const validateTheme = (theme: AlacrittyTheme) =>
      !!(
        theme.colors?.primary?.background &&
        theme.colors?.primary?.foreground &&
        theme.colors?.normal?.red &&
        theme.colors?.bright?.blue
      );

    return validateTheme(output.light) && validateTheme(output.dark);
  },

  preview: {
    component: AlacrittyPreview,
  },
};
