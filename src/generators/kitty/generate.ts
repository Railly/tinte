import { palette } from "../../palette.ts";
import { toConf } from "../../utils/format.ts";
import { getThemeName, writeFile } from "../../utils/index.ts";
import { ThemeType } from "../types.ts";

export const generateKittyTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const theme = {
    "basic colors": {
      foreground: palette.tx[themeType],
      background: palette.bg[themeType],
      selection_foreground: palette.tx[themeType],
      selection_background: palette["ui-3"][themeType],
    },
    "cursor colors": {
      cursor: palette.tx[themeType],
      cursor_text_color: palette.bg[themeType],
    },
    "window border colors": {
      active_border_color: palette.re[themeType],
      inactive_border_color: palette["ui-3"][themeType],
    },
    "tab bar colors": {
      active_tab_foreground: palette.tx[themeType],
      active_tab_background: palette["ui-3"][themeType],
      inactive_tab_foreground: palette["tx-2"][themeType],
      inactive_tab_background: palette["ui"][themeType],
    },

    black: {
      color0: palette.bg["dark"],
      color8: palette["tx-2"][themeType],
    },
    red: {
      color1: palette.re[themeType],
      color9: palette["re-2"][themeType],
    },
    green: {
      color2: palette.gr[themeType],
      color10: palette["gr-2"][themeType],
    },

    yellow: {
      color3: palette.ye[themeType],
      color11: palette["ye-2"][themeType],
    },
    blue: {
      color4: palette.bl[themeType],
      color12: palette["bl-2"][themeType],
    },

    magenta: {
      color5: palette.pu[themeType],
      color13: palette["pu-2"][themeType],
    },
    cyan: {
      color6: palette.cy[themeType],
      color14: palette["cy-2"][themeType],
    },
    white: {
      color7: palette.tx[themeType],
      color15: palette.bg["light"],
    },
  };

  const filePath = `./_generated/kitty/${themeName}.conf`;
  writeFile(filePath, toConf(theme));
};
