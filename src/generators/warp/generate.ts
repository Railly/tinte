import { mappedPalette } from "../../mapped-palette.js";
import { toYAML } from "../../utils/format.js";
import { getThemeName, writeFile } from "../../utils/index.js";
import { ThemeType } from "../types.js";

export const generateWarpTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const slugifiedName = getThemeName(name);

  const theme = {
    accent: mappedPalette.or[themeType],
    background: mappedPalette.bg[themeType],
    details: themeType === "light" ? "lighter" : "darker",
    foreground: mappedPalette.tx[themeType],
    terminal_colors: {
      bright: {
        black: mappedPalette.bg["dark"],
        blue: mappedPalette.bl[themeType],
        cyan: mappedPalette.cy[themeType],
        green: mappedPalette.gr[themeType],
        magenta: mappedPalette.ma[themeType],
        red: mappedPalette.re[themeType],
        white: mappedPalette.tx[themeType],
        yellow: mappedPalette.ye[themeType],
      },
      normal: {
        black: mappedPalette.bg["dark"],
        blue: mappedPalette["bl-2"][themeType],
        cyan: mappedPalette["cy-2"][themeType],
        green: mappedPalette["gr-2"][themeType],
        magenta: mappedPalette["ma-2"][themeType],
        red: mappedPalette["re-2"][themeType],
        white: mappedPalette.tx[themeType],
        yellow: mappedPalette["ye-2"][themeType],
      },
    },
  };

  const filePath = `./_generated/${slugifiedName}/warp/${themeName}.yaml`;
  writeFile(filePath, toYAML(theme));
};
