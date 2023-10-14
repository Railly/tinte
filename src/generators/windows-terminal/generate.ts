import { mappedPalette } from "../../mapped-palette.ts";
import { toJSON } from "../../utils/format.ts";
import { getThemeName, writeFile } from "../../utils/index.ts";
import { ThemeType } from "../types.ts";

export const generateWindowsTerminalTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const slugifiedName = getThemeName(name);

  const theme = {
    // General
    name: themeName,
    background: mappedPalette.bg[themeType],
    foreground: mappedPalette.tx[themeType],

    // Black & White
    black: mappedPalette.bg["dark"],
    white: mappedPalette["bg-2"]["light"],

    // Bright colors
    brightBlack: mappedPalette["tx-3"]["dark"],
    brightWhite: mappedPalette.bg["light"],
    brightBlue: mappedPalette.bl[themeType],
    brightCyan: mappedPalette.cy[themeType],
    brightGreen: mappedPalette.gr[themeType],
    brightPurple: mappedPalette.pu[themeType],
    brightRed: mappedPalette.re[themeType],
    brightYellow: mappedPalette.ye[themeType],

    // Normal colors
    blue: mappedPalette["bl-2"][themeType],
    cyan: mappedPalette["bl-2"][themeType],
    green: mappedPalette["gr-2"][themeType],
    purple: mappedPalette["pu-2"][themeType],
    red: mappedPalette["re-2"][themeType],
    yellow: mappedPalette["ye-2"][themeType],

    // Selection colors
    selectionBackground: mappedPalette["tx-2"][themeType],

    // Cursor colors
    cursorColor: mappedPalette["tx-2"][themeType],
  };

  const filePath = `./_generated/${slugifiedName}/windows-terminal/${themeName}-wt.json`;
  writeFile(filePath, toJSON(theme));
};
