import { mappedPalette } from "../../mapped-palette.js";
import { Color } from "../../utils/color.js";
import { toTOML } from "../../utils/format.js";
import { getThemeName, writeFile } from "../../utils/index.js";
import { ThemeType } from "../types.js";

export const generateWeztermTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name, themeType);
  const slugifiedName = getThemeName(name);

  const isDark = themeType === "dark";

  const themeDark = {
    colors: {
      ansi: [
        Color.fromHex(mappedPalette.bg.dark).asRGB,
        Color.fromHex(mappedPalette.re.light).asRGB,
        Color.fromHex(mappedPalette.gr.light).asRGB,
        Color.fromHex(mappedPalette.ye.light).asRGB,
        Color.fromHex(mappedPalette.bl.light).asRGB,
        Color.fromHex(mappedPalette.pu.light).asRGB,
        Color.fromHex(mappedPalette.cy.light).asRGB,
        Color.fromHex(mappedPalette["tx-2"].dark).asRGB,
      ],
      brights: [
        Color.fromHex(mappedPalette["bg-2"].dark).asRGB,
        Color.fromHex(mappedPalette.re.dark).asRGB,
        Color.fromHex(mappedPalette.gr.dark).asRGB,
        Color.fromHex(mappedPalette.ye.dark).asRGB,
        Color.fromHex(mappedPalette.bl.dark).asRGB,
        Color.fromHex(mappedPalette.pu.dark).asRGB,
        Color.fromHex(mappedPalette.cy.dark).asRGB,
        Color.fromHex(mappedPalette["ui-3"].light).asRGB,
      ],
      foreground: Color.fromHex(mappedPalette["ui-3"].light).asRGB,
      background: Color.fromHex(mappedPalette.bg.dark).asRGB,
      cursor_bg: Color.fromHex(mappedPalette["ui-3"].light).asRGB,
      cursor_border: Color.fromHex(mappedPalette["ui-3"].light).asRGB,
      cursor_fg: Color.fromHex(mappedPalette.bg.dark).asRGB,
      selection_bg: Color.fromHex(mappedPalette["ui-3"].dark).asRGB,
      selection_fg: Color.fromHex(mappedPalette["ui-3"].light).asRGB,
    },
    "colors.indexed": {},
  };

  const themeLight = {
    colors: {
      ansi: [
        mappedPalette.re.light,
        mappedPalette.or.light,
        mappedPalette.ye.light,
        mappedPalette.gr.light,
        mappedPalette.cy.light,
        mappedPalette.bl.light,
        mappedPalette.pu.light,
        mappedPalette.ma.light,
      ],
      brights: [
        mappedPalette.re.dark,
        mappedPalette.or.dark,
        mappedPalette.ye.dark,
        mappedPalette.gr.dark,
        mappedPalette.cy.dark,
        mappedPalette.bl.dark,
        mappedPalette.pu.dark,
        mappedPalette.ma.dark,
      ],
      foreground: mappedPalette["tx"].light,
      background: mappedPalette.bg.light,
      cursor_bg: mappedPalette["tx"].light,
      cursor_border: mappedPalette["tx"].light,
      cursor_fg: mappedPalette.bg.light,
      selection_bg: mappedPalette["ui-3"].light,
      selection_fg: mappedPalette["tx"].light,
    },
    "colors.indexed": {},
  };
  const theme = isDark ? themeDark : themeLight;

  const filePath = `./_generated/${slugifiedName}/wezterm/${themeName}.toml`;

  writeFile(filePath, toTOML(theme));
};
