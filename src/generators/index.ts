import { generateAlacrittyTheme } from "./alacritty/generate.ts";
import { generateGimpTheme } from "./gimp/generate.ts";
import { generateITerm2Theme } from "./iterm2/generate.ts";
import { generateKittyTheme } from "./kitty/generate.ts";
import { generateLiteXLTheme } from "./lite-xl/generate.ts";
import { generateThemeSHTheme } from "./theme-sh/generate.ts";
import { generateVanillaCSSTheme } from "./vanilla-css/generate.ts";
import { generateVSCodeTheme } from "./vscode/generate.ts";
import { generateWarpTheme } from "./warp/generate.ts";
import { generateWeztermTheme } from "./wezterm/generate.ts";
import { generateWindowsTerminalTheme } from "./windows-terminal/generate.ts";
import { generateXResourcesTheme } from "./xresources/generate.ts";
import { ThemeType } from "./types.ts";

type Provider = keyof typeof generators;

export const generators = {
  vscode: generateVSCodeTheme,
  "windows-terminal": generateWindowsTerminalTheme,
  iterm2: generateITerm2Theme,
  alacritty: generateAlacrittyTheme,
  "vanilla-css": generateVanillaCSSTheme,
  gimp: generateGimpTheme,
  kitty: generateKittyTheme,
  "lite-xl": generateLiteXLTheme,
  "theme-sh": generateThemeSHTheme,
  xresources: generateXResourcesTheme,
  warp: generateWarpTheme,
  wezterm: generateWeztermTheme,
} as const;

export const providers: Array<{
  name: Provider;
  themes: ThemeType[];
}> = [
  {
    name: "vscode",
    themes: ["light", "dark"],
  },
  {
    name: "windows-terminal",
    themes: ["light", "dark"],
  },
  {
    name: "iterm2",
    themes: ["light", "dark"],
  },
  {
    name: "alacritty",
    themes: ["light", "dark"],
  },
  {
    name: "vanilla-css",
    themes: ["light"],
  },
  {
    name: "gimp",
    themes: ["dark"],
  },
  {
    name: "kitty",
    themes: ["light", "dark"],
  },
  {
    name: "lite-xl",
    themes: ["light", "dark"],
  },
  {
    name: "theme-sh",
    themes: ["light", "dark"],
  },
  {
    name: "xresources",
    themes: ["light", "dark"],
  },
  {
    name: "warp",
    themes: ["light", "dark"],
  },
  {
    name: "wezterm",
    themes: ["light", "dark"],
  },
];
