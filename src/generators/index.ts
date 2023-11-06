import { generateAlacrittyTheme } from "./alacritty/generate.js";
import { generateGimpTheme } from "./gimp/generate.js";
import { generateITerm2Theme } from "./iterm2/generate.js";
import { generateKittyTheme } from "./kitty/generate.js";
import { generateLiteXLTheme } from "./lite-xl/generate.js";
import { generateThemeSHTheme } from "./theme-sh/generate.js";
import { generateVanillaCSSTheme } from "./vanilla-css/generate.js";
import { generateVSCodeTheme } from "./vscode/generate.js";
import { generateWarpTheme } from "./warp/generate.js";
import { generateWeztermTheme } from "./wezterm/generate.js";
import { generateWindowsTerminalTheme } from "./windows-terminal/generate.js";
import { generateXResourcesTheme } from "./xresources/generate.js";
import { ThemeType } from "./types.js";
import { generateFzFTheme } from "./fzf/generate.js";

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
  fzf: generateFzFTheme,
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
  {
    name: "fzf",
    themes: ["light", "dark"],
  },
];
