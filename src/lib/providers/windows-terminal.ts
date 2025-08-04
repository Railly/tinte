import { TinteTheme } from "@/types/tinte";
import { ThemeProvider, ProviderOutput } from "./types";
import { WindowsTerminalIcon } from "@/components/shared/icons/windows-terminal";
import {
  createPolineColorMapping,
  toJSON,
  getThemeName,
  getDisplayName,
} from "./poline-base";

export interface WindowsTerminalTheme {
  name: string;
  background: string;
  foreground: string;

  // Basic colors
  black: string;
  white: string;

  // Normal colors
  blue: string;
  cyan: string;
  green: string;
  purple: string;
  red: string;
  yellow: string;

  // Bright colors
  brightBlack: string;
  brightWhite: string;
  brightBlue: string;
  brightCyan: string;
  brightGreen: string;
  brightPurple: string;
  brightRed: string;
  brightYellow: string;

  // Selection and cursor colors
  selectionBackground: string;
  cursorColor: string;
}

function generateWindowsTerminalTheme(
  theme: TinteTheme,
  mode: "light" | "dark"
): WindowsTerminalTheme {
  const block = theme[mode];
  const colorMapping = createPolineColorMapping(block);

  // Use opposite mode for contrast colors
  const oppositeBlock = theme[mode === "light" ? "dark" : "light"];
  const oppositeMapping = createPolineColorMapping(oppositeBlock);

  return {
    name: getDisplayName("Tinte Theme", mode),
    background: colorMapping.bg,
    foreground: colorMapping.tx,

    // Basic colors
    black: oppositeMapping.bg,
    white: colorMapping.bg2,

    // Normal colors
    blue: colorMapping.blue2,
    cyan: colorMapping.cyan2,
    green: colorMapping.green2,
    purple: colorMapping.magenta2,
    red: colorMapping.red2,
    yellow: colorMapping.yellow2,

    // Bright colors
    brightBlack: colorMapping.tx3,
    brightWhite: oppositeMapping.bg,
    brightBlue: colorMapping.blue,
    brightCyan: colorMapping.cyan,
    brightGreen: colorMapping.green,
    brightPurple: colorMapping.magenta,
    brightRed: colorMapping.red,
    brightYellow: colorMapping.yellow,

    // Selection and cursor colors
    selectionBackground: colorMapping.ui3,
    cursorColor: colorMapping.accent,
  };
}

export const windowsTerminalProvider: ThemeProvider<{ light: WindowsTerminalTheme; dark: WindowsTerminalTheme }> = {
  metadata: {
    id: "windows-terminal",
    name: "Windows Terminal",
    description: "Modern terminal application for Windows",
    category: "terminal",
    tags: ["terminal", "windows", "microsoft", "powershell"],
    icon: WindowsTerminalIcon,
    website: "https://aka.ms/terminal",
    documentation: "https://docs.microsoft.com/en-us/windows/terminal/customize-settings/color-schemes",
  },

  fileExtension: "json",
  mimeType: "application/json",

  convert: (theme: TinteTheme) => ({
    light: generateWindowsTerminalTheme(theme, "light"),
    dark: generateWindowsTerminalTheme(theme, "dark"),
  }),

  export: (theme: TinteTheme, filename?: string): ProviderOutput => {
    const converted = windowsTerminalProvider.convert(theme);
    const themeName = filename || getThemeName("tinte-theme");

    // Create both light and dark themes in the Windows Terminal format
    const colorSchemes = [
      {
        ...converted.light,
        name: `${getDisplayName("Tinte Theme")} Light`,
      },
      {
        ...converted.dark,
        name: `${getDisplayName("Tinte Theme")} Dark`,
      },
    ];

    // Windows Terminal expects a specific structure
    const windowsTerminalConfig = {
      $help: "https://aka.ms/terminal-documentation",
      $schema: "https://aka.ms/terminal-profiles-schema",
      schemes: colorSchemes,
    };

    return {
      content: toJSON(windowsTerminalConfig),
      filename: `${themeName}-windows-terminal.json`,
      mimeType: windowsTerminalProvider.mimeType,
    };
  },

  validate: (output: { light: WindowsTerminalTheme; dark: WindowsTerminalTheme }) => {
    const validateTheme = (theme: WindowsTerminalTheme) => !!(
      theme.name &&
      theme.background &&
      theme.foreground &&
      theme.black &&
      theme.white &&
      theme.red &&
      theme.green &&
      theme.blue &&
      theme.brightRed &&
      theme.brightGreen &&
      theme.brightBlue
    );

    return validateTheme(output.light) && validateTheme(output.dark);
  },
};
