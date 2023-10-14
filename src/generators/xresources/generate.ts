import { mappedPalette } from "../../mapped-palette.ts";
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
  const slugifiedName = getThemeName(name);

  const defines = {
    "dark-colors": {
      yellow: mappedPalette["ye-2"][themeType],
      blue: mappedPalette["bl-2"][themeType],
      orange: mappedPalette["or-2"][themeType],
      cyan: mappedPalette["cy-2"][themeType],
      red: mappedPalette["re-2"][themeType],
      green: mappedPalette["gr-2"][themeType],
      magenta: mappedPalette["ma-2"][themeType],
      violet: mappedPalette["pu-2"][themeType],
      white: mappedPalette["bg"]["light"],
      black: mappedPalette["bg"]["dark"],
    },
    "light-colors": {
      bryellow: mappedPalette["ye"][themeType],
      brblue: mappedPalette["bl"][themeType],
      brorange: mappedPalette["or"][themeType],
      brcyan: mappedPalette["cy"][themeType],
      brred: mappedPalette["re"][themeType],
      brgreen: mappedPalette["gr"][themeType],
      brmagenta: mappedPalette["ma"][themeType],
      brviolet: mappedPalette["pu"][themeType],
      brwhite: mappedPalette["bg"]["light"],
      brblack: mappedPalette["bg"]["dark"],
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
  const filePath = `./_generated/${slugifiedName}/xresources/${themeName}`;
  writeFile(filePath, toXResources(defines, body));
};
