import { mappedPalette } from "../../mapped-palette.js";
import { getThemeName, writeFile } from "../../utils/index.js";
import { toThemeSH } from "../../utils/format.js";
import { ThemeType } from "../types.js";

export const generateThemeSHTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const slugifiedName = getThemeName(name);

  const theme = {
    color0: mappedPalette.bg[themeType],
    color1: mappedPalette.re[themeType],
    color2: mappedPalette.gr[themeType],
    color3: mappedPalette.ye[themeType],
    color4: mappedPalette.bl[themeType],
    color5: mappedPalette.pu[themeType],
    color6: mappedPalette.cy[themeType],
    color7: mappedPalette["tx-2"][themeType],
    color8: mappedPalette["ui"][themeType],
    color9: mappedPalette["re-2"][themeType],
    color10: mappedPalette["gr-2"][themeType],
    color11: mappedPalette["ye-2"][themeType],
    color12: mappedPalette["bl-2"][themeType],
    color13: mappedPalette["pu-2"][themeType],
    color14: mappedPalette["cy-2"][themeType],
    color15: mappedPalette["tx-2"][themeType],
    foreground: mappedPalette.tx[themeType],
    background: mappedPalette.bg[themeType],
    cursor: mappedPalette.tx[themeType],
  };

  const filePath = `./_generated/${slugifiedName}/theme-sh/${themeName}`;
  writeFile(filePath, toThemeSH(theme));
};
