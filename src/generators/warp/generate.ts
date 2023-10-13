import { palette } from "../../palette.ts";
import { toYAML } from "../../utils/format.ts";
import { getThemeName, writeFile } from "../../utils/index.ts";
import { ThemeType } from "../types.ts";

export const generateWarpTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const theme = {
    accent: palette.or[themeType],
    background: palette.bg[themeType],
    details: themeType === "light" ? "lighter" : "darker",
    foreground: palette.tx[themeType],
    terminal_colors: {
      bright: {
        black: palette.bg["dark"],
        blue: palette.bl[themeType],
        cyan: palette.cy[themeType],
        green: palette.gr[themeType],
        magenta: palette.ma[themeType],
        red: palette.re[themeType],
        white: palette.tx[themeType],
        yellow: palette.ye[themeType],
      },
      normal: {
        black: palette.bg["dark"],
        blue: palette["bl-2"][themeType],
        cyan: palette["cy-2"][themeType],
        green: palette["gr-2"][themeType],
        magenta: palette["ma-2"][themeType],
        red: palette["re-2"][themeType],
        white: palette.tx[themeType],
        yellow: palette["ye-2"][themeType],
      },
    },
  };

  const filePath = `./_generated/warp/${themeName}.yaml`;
  writeFile(filePath, toYAML(theme));
};
