import { palette } from "../../palette.ts";
import { getThemeName, toJSON, writeFile } from "../../utils/index.ts";
import { ThemeType } from "../types.ts";

export const generateWindowsTerminalTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const theme = {
    // General
    name: themeName,
    background: palette.bg[themeType],
    foreground: palette.tx[themeType],

    // Black & White
    black: palette.bg["dark"],
    white: palette["bg-2"]["light"],

    // Bright colors
    brightBlack: palette["tx-3"]["dark"],
    brightWhite: palette.bg["light"],
    brightBlue: palette.bl[themeType],
    brightCyan: palette.cy[themeType],
    brightGreen: palette.gr[themeType],
    brightPurple: palette.pu[themeType],
    brightRed: palette.re[themeType],
    brightYellow: palette.ye[themeType],

    // Normal colors
    blue: palette["bl-2"][themeType],
    cyan: palette["bl-2"][themeType],
    green: palette["gr-2"][themeType],
    purple: palette["pu-2"][themeType],
    red: palette["re-2"][themeType],
    yellow: palette["ye-2"][themeType],

    // Selection colors
    selectionBackground: palette["tx-2"][themeType],

    // Cursor colors
    cursorColor: palette["tx-2"][themeType],
  };

  const filePath = `./_generated/windows-terminal/${themeName}-wt.json`;
  writeFile(filePath, toJSON(theme));
};
