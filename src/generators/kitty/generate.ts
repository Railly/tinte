import { mappedPalette } from "../../mapped-palette.js";
import { toConf } from "../../utils/format.js";
import { getThemeName, writeFile } from "../../utils/index.js";
import { ThemeType } from "../types.js";

export const generateKittyTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const slugifiedName = getThemeName(name);
  const theme = {
    "basic colors": {
      foreground: mappedPalette.tx[themeType],
      background: mappedPalette.bg[themeType],
      selection_foreground: mappedPalette.tx[themeType],
      selection_background: mappedPalette["ui-3"][themeType],
    },
    "cursor colors": {
      cursor: mappedPalette.tx[themeType],
      cursor_text_color: mappedPalette.bg[themeType],
    },
    "window border colors": {
      active_border_color: mappedPalette.re[themeType],
      inactive_border_color: mappedPalette["ui-3"][themeType],
    },
    "tab bar colors": {
      active_tab_foreground: mappedPalette.tx[themeType],
      active_tab_background: mappedPalette["ui-3"][themeType],
      inactive_tab_foreground: mappedPalette["tx-2"][themeType],
      inactive_tab_background: mappedPalette["ui"][themeType],
    },

    black: {
      color0: mappedPalette.bg["dark"],
      color8: mappedPalette["tx-2"][themeType],
    },
    red: {
      color1: mappedPalette.re[themeType],
      color9: mappedPalette["re-2"][themeType],
    },
    green: {
      color2: mappedPalette.gr[themeType],
      color10: mappedPalette["gr-2"][themeType],
    },

    yellow: {
      color3: mappedPalette.ye[themeType],
      color11: mappedPalette["ye-2"][themeType],
    },
    blue: {
      color4: mappedPalette.bl[themeType],
      color12: mappedPalette["bl-2"][themeType],
    },

    magenta: {
      color5: mappedPalette.pu[themeType],
      color13: mappedPalette["pu-2"][themeType],
    },
    cyan: {
      color6: mappedPalette.cy[themeType],
      color14: mappedPalette["cy-2"][themeType],
    },
    white: {
      color7: mappedPalette.tx[themeType],
      color15: mappedPalette.bg["light"],
    },
  };

  const filePath = `./_generated/${slugifiedName}/kitty/${themeName}.conf`;
  writeFile(filePath, toConf(theme));
};
