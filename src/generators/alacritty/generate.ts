import { palette } from "../../palette.ts";
import {
  getThemeName,
  processPaletteHexToInt,
  toYAML,
  writeFile,
} from "../../utils/index.ts";
import { ThemeType } from "../types.ts";

export const generateAlacrittyTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const theme = {
    colors: {
      primary: processPaletteHexToInt({
        background: palette.bg[themeType],
        foreground: palette.tx[themeType],
        dim_foreground: palette.tx[themeType],
        bright_foreground: palette.tx[themeType],
        dim_background: palette.bg["dark"],
        bright_background: palette.bg["light"],
      }),
      cursor: processPaletteHexToInt({
        text: palette["tx-2"][themeType],
        cursor: palette["tx-2"][themeType],
      }),
      normal: processPaletteHexToInt({
        black: palette.bg["dark"],
        red: palette["re-2"][themeType],
        green: palette["gr-2"][themeType],
        yellow: palette["ye-2"][themeType],
        blue: palette["bl-2"][themeType],
        magenta: palette["pu-2"][themeType],
        cyan: palette["bl-2"][themeType],
        white: palette.tx[themeType],
      }),
      bright: processPaletteHexToInt({
        black: palette["tx-3"]["dark"],
        red: palette.re[themeType],
        green: palette.gr[themeType],
        yellow: palette.ye[themeType],
        blue: palette.bl[themeType],
        magenta: palette.pu[themeType],
        cyan: palette.cy[themeType],
        white: palette.bg["light"],
      }),
      dim: processPaletteHexToInt({
        black: palette.bg["dark"],
        red: palette["re-2"][themeType],
        green: palette["gr-2"][themeType],
        yellow: palette["ye-2"][themeType],
        blue: palette["bl-2"][themeType],
        magenta: palette["pu-2"][themeType],
        cyan: palette["bl-2"][themeType],
        white: palette.tx[themeType],
      }),
    },
  };

  const filePath = `./_generated/alacritty/${themeName}.yaml`;
  writeFile(filePath, toYAML(theme));
};
