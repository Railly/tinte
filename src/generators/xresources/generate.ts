import { palette } from "../../palette.ts";
import { toXResources } from "../../utils/format.ts";
import { getThemeName, writeFile } from "../../utils/index.ts";
import { ThemeType } from "../types.ts";

export const generateXResourcesTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const defines = {
    "dark-colors": {
      yellow: palette["ye-2"][themeType],
      blue: palette["bl-2"][themeType],
      orange: palette["or-2"][themeType],
      cyan: palette["cy-2"][themeType],
      red: palette["re-2"][themeType],
      green: palette["gr-2"][themeType],
      magenta: palette["ma-2"][themeType],
      violet: palette["pu-2"][themeType],
      white: palette["bg"]["light"],
      black: palette["bg"]["dark"],
    },
    "light-colors": {
      bryellow: palette["ye"][themeType],
      brblue: palette["bl"][themeType],
      brorange: palette["or"][themeType],
      brcyan: palette["cy"][themeType],
      brred: palette["re"][themeType],
      brgreen: palette["gr"][themeType],
      brmagenta: palette["ma"][themeType],
      brviolet: palette["pu"][themeType],
      brwhite: palette["bg"]["light"],
      brblack: palette["bg"]["dark"],
    },
  };
  const body = {
    base: {
      "*background": "black",
      "*foreground": "brwhite",
      "*fading": "40",
      "*fadeColor": "black",
      "*cursorColor": "brwhite",
      "*pointerColorBackground": "brblack",
      "*pointerColorForeground": "black",
    },
    black: {
      "*color0": "black",
      "*color8": "brblack",
    },
    red: {
      "*color1": "red",
      "*color9": "brred",
    },
    green: {
      "*color2": "green",
      "*color10": "brgreen",
    },
    yellow: {
      "*color3": "yellow",
      "*color11": "bryellow",
    },
    blue: {
      "*color4": "blue",
      "*color12": "brblue",
    },
    magenta: {
      "*color5": "magenta",
      "*color13": "brmagenta",
    },
    cyan: {
      "*color6": "cyan",
      "*color14": "brcyan",
    },
    white: {
      "*color7": "white",
      "*color15": "brwhite",
    },
  };
  const filePath = `./_generated/xresources/${themeName}`;
  writeFile(filePath, toXResources(defines, body));
};
