import { KittyPreview } from "@/components/preview/kitty/kitty-preview";
import { KittyIcon } from "@/components/shared/icons";
import type { TinteTheme } from "@/types/tinte";
import {
  createPolineColorMapping,
  getDisplayName,
  getThemeName,
} from "./poline-base";
import type { PreviewableProvider, ProviderOutput } from "./types";

export interface KittyTheme {
  // Basic colors
  foreground: string;
  background: string;
  selection_foreground: string;
  selection_background: string;

  // Cursor colors
  cursor: string;
  cursor_text_color: string;

  // Window border colors
  active_border_color: string;
  inactive_border_color: string;

  // Tab bar colors
  active_tab_foreground: string;
  active_tab_background: string;
  inactive_tab_foreground: string;
  inactive_tab_background: string;

  // Terminal colors (16 colors)
  color0: string; // black
  color1: string; // red
  color2: string; // green
  color3: string; // yellow
  color4: string; // blue
  color5: string; // magenta
  color6: string; // cyan
  color7: string; // white
  color8: string; // bright black
  color9: string; // bright red
  color10: string; // bright green
  color11: string; // bright yellow
  color12: string; // bright blue
  color13: string; // bright magenta
  color14: string; // bright cyan
  color15: string; // bright white
}

function generateKittyTheme(
  theme: TinteTheme,
  mode: "light" | "dark",
): KittyTheme {
  const block = theme[mode];
  const colorMapping = createPolineColorMapping(block);

  // Use opposite mode for contrast colors
  const oppositeBlock = theme[mode === "light" ? "dark" : "light"];
  const oppositeMapping = createPolineColorMapping(oppositeBlock);

  return {
    // Basic colors
    foreground: colorMapping.tx,
    background: colorMapping.bg,
    selection_foreground: colorMapping.tx,
    selection_background: colorMapping.ui3,

    // Cursor colors
    cursor: colorMapping.accent,
    cursor_text_color: colorMapping.bg,

    // Window border colors
    active_border_color: colorMapping.primary,
    inactive_border_color: colorMapping.ui2,

    // Tab bar colors
    active_tab_foreground: colorMapping.tx,
    active_tab_background: colorMapping.ui3,
    inactive_tab_foreground: colorMapping.tx2,
    inactive_tab_background: colorMapping.ui,

    // Terminal colors (0-7: normal, 8-15: bright)
    color0: oppositeMapping.bg, // black
    color1: colorMapping.red2, // red
    color2: colorMapping.green2, // green
    color3: colorMapping.yellow2, // yellow
    color4: colorMapping.blue2, // blue
    color5: colorMapping.magenta2, // magenta
    color6: colorMapping.cyan2, // cyan
    color7: colorMapping.tx, // white
    color8: colorMapping.tx2, // bright black
    color9: colorMapping.red, // bright red
    color10: colorMapping.green, // bright green
    color11: colorMapping.yellow, // bright yellow
    color12: colorMapping.blue, // bright blue
    color13: colorMapping.magenta, // bright magenta
    color14: colorMapping.cyan, // bright cyan
    color15: oppositeMapping.bg, // bright white
  };
}

export const kittyProvider: PreviewableProvider<{
  light: KittyTheme;
  dark: KittyTheme;
}> = {
  metadata: {
    id: "kitty",
    name: "Kitty",
    description: "Fast, feature-rich, GPU based terminal emulator",
    category: "terminal",
    tags: ["terminal", "gpu", "fast", "python"],
    icon: KittyIcon,
    website: "https://sw.kovidgoyal.net/kitty/",
    documentation: "https://sw.kovidgoyal.net/kitty/conf/",
  },

  fileExtension: "conf",
  mimeType: "text/plain",

  convert: (theme: TinteTheme) => ({
    light: generateKittyTheme(theme, "light"),
    dark: generateKittyTheme(theme, "dark"),
  }),

  export: (theme: TinteTheme, filename?: string): ProviderOutput => {
    const converted = kittyProvider.convert(theme);
    const themeName = filename || getThemeName("tinte-theme");

    const kittyTheme = converted.dark;

    const structuredTheme: Record<string, string> = {
      "# Theme": getDisplayName("Tinte Theme"),
      "# Generator": "Tinte Theme Converter with Poline",
      "# URL": "https://github.com/your-repo/tinte",
      comment1: "",

      "# Basic colors": "",
      foreground: kittyTheme.foreground,
      background: kittyTheme.background,
      selection_foreground: kittyTheme.selection_foreground,
      selection_background: kittyTheme.selection_background,
      comment2: "",

      "# Cursor colors": "",
      cursor: kittyTheme.cursor,
      cursor_text_color: kittyTheme.cursor_text_color,
      comment3: "",

      "# Window border colors": "",
      active_border_color: kittyTheme.active_border_color,
      inactive_border_color: kittyTheme.inactive_border_color,
      comment4: "",

      "# Tab bar colors": "",
      active_tab_foreground: kittyTheme.active_tab_foreground,
      active_tab_background: kittyTheme.active_tab_background,
      inactive_tab_foreground: kittyTheme.inactive_tab_foreground,
      inactive_tab_background: kittyTheme.inactive_tab_background,
      comment5: "",

      "# Colors for terminal applications (0-15)": "",
      "# Black": "",
      color0: kittyTheme.color0,
      color8: kittyTheme.color8,
      comment6: "",
      "# Red": "",
      color1: kittyTheme.color1,
      color9: kittyTheme.color9,
      comment7: "",
      "# Green": "",
      color2: kittyTheme.color2,
      color10: kittyTheme.color10,
      comment8: "",
      "# Yellow": "",
      color3: kittyTheme.color3,
      color11: kittyTheme.color11,
      comment9: "",
      "# Blue": "",
      color4: kittyTheme.color4,
      color12: kittyTheme.color12,
      comment10: "",
      "# Magenta": "",
      color5: kittyTheme.color5,
      color13: kittyTheme.color13,
      comment11: "",
      "# Cyan": "",
      color6: kittyTheme.color6,
      color14: kittyTheme.color14,
      comment12: "",
      "# White": "",
      color7: kittyTheme.color7,
      color15: kittyTheme.color15,
    };

    const confContent = Object.entries(structuredTheme)
      .map(([key, value]) => {
        if (key.startsWith("#")) {
          return key;
        }
        if (key.startsWith("comment") || value === "") {
          return "";
        }
        return `${key} ${value}`;
      })
      .join("\n");

    return {
      content: confContent,
      filename: `${themeName}-kitty.conf`,
      mimeType: kittyProvider.mimeType,
    };
  },

  validate: (output: { light: KittyTheme; dark: KittyTheme }) => {
    const validateTheme = (theme: KittyTheme) =>
      !!(
        theme.foreground &&
        theme.background &&
        theme.color0 &&
        theme.color1 &&
        theme.color2 &&
        theme.color3 &&
        theme.color4 &&
        theme.color5 &&
        theme.color6 &&
        theme.color7 &&
        theme.color8 &&
        theme.color9 &&
        theme.color10 &&
        theme.color11 &&
        theme.color12 &&
        theme.color13 &&
        theme.color14 &&
        theme.color15
      );

    return validateTheme(output.light) && validateTheme(output.dark);
  },

  preview: {
    component: KittyPreview,
  },
};
