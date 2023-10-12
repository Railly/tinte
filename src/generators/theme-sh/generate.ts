import { palette } from "../../palette.ts";
import { getThemeName, writeFile } from "../../utils/index.ts";
import { toThemeSH } from "../../utils/format.ts";
import { ThemeType } from "../types.ts";

export const generateThemeSHTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const theme = {
    color0: palette.bg[themeType],
    color1: palette.re[themeType],
    color2: palette.gr[themeType],
    color3: palette.ye[themeType],
    color4: palette.bl[themeType],
    color5: palette.pu[themeType],
    color6: palette.cy[themeType],
    color7: palette["tx-2"][themeType],
    color8: palette["ui"][themeType],
    color9: palette["re-2"][themeType],
    color10: palette["gr-2"][themeType],
    color11: palette["ye-2"][themeType],
    color12: palette["bl-2"][themeType],
    color13: palette["pu-2"][themeType],
    color14: palette["cy-2"][themeType],
    color15: palette["tx-2"][themeType],
    foreground: palette.tx[themeType],
    background: palette.bg[themeType],
    cursor: palette.tx[themeType],
  };

  const filePath = `./_generated/theme-sh/${themeName}`;
  writeFile(filePath, toThemeSH(theme));
};
