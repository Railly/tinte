import { mappedPalette } from "../../mapped-palette.ts";
import { processPaletteHexToInt, toYAML } from "../../utils/format.ts";
import { getThemeName, writeFile } from "../../utils/index.ts";
import { ThemeType } from "../types.ts";

export const generateAlacrittyTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const slugifiedName = getThemeName(name);
  const theme = {
    colors: {
      primary: processPaletteHexToInt({
        background: mappedPalette.bg[themeType],
        foreground: mappedPalette.tx[themeType],
        dim_foreground: mappedPalette.tx[themeType],
        bright_foreground: mappedPalette.tx[themeType],
        dim_background: mappedPalette.bg["dark"],
        bright_background: mappedPalette.bg["light"],
      }),
      cursor: processPaletteHexToInt({
        text: mappedPalette["tx-2"][themeType],
        cursor: mappedPalette["tx-2"][themeType],
      }),
      normal: processPaletteHexToInt({
        black: mappedPalette.bg["dark"],
        red: mappedPalette["re-2"][themeType],
        green: mappedPalette["gr-2"][themeType],
        yellow: mappedPalette["ye-2"][themeType],
        blue: mappedPalette["bl-2"][themeType],
        magenta: mappedPalette["pu-2"][themeType],
        cyan: mappedPalette["bl-2"][themeType],
        white: mappedPalette.tx[themeType],
      }),
      bright: processPaletteHexToInt({
        black: mappedPalette["tx-3"]["dark"],
        red: mappedPalette.re[themeType],
        green: mappedPalette.gr[themeType],
        yellow: mappedPalette.ye[themeType],
        blue: mappedPalette.bl[themeType],
        magenta: mappedPalette.pu[themeType],
        cyan: mappedPalette.cy[themeType],
        white: mappedPalette.bg["light"],
      }),
      dim: processPaletteHexToInt({
        black: mappedPalette.bg["dark"],
        red: mappedPalette["re-2"][themeType],
        green: mappedPalette["gr-2"][themeType],
        yellow: mappedPalette["ye-2"][themeType],
        blue: mappedPalette["bl-2"][themeType],
        magenta: mappedPalette["pu-2"][themeType],
        cyan: mappedPalette["bl-2"][themeType],
        white: mappedPalette.tx[themeType],
      }),
    },
  };

  const filePath = `./_generated/${slugifiedName}/alacritty/${themeName}.yaml`;
  writeFile(filePath, toYAML(theme));
};
