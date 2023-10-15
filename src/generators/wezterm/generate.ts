import { mappedPalette } from "../../mapped-palette.ts";
import { Color } from "../../utils/color.ts";
import { toTOML } from "../../utils/format.ts";
import { getThemeName, writeFile } from "../../utils/index.ts";
import { ThemeType } from "../types.ts";

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
      indexed: {},
    },
  };

  const themeLight = {
    colors: {
      ansi: [
        Color.fromHex(mappedPalette.re.light).asHexRGB,
        Color.fromHex(mappedPalette.or.light).asHexRGB,
        Color.fromHex(mappedPalette.ye.light).asHexRGB,
        Color.fromHex(mappedPalette.gr.light).asHexRGB,
        Color.fromHex(mappedPalette.cy.light).asHexRGB,
        Color.fromHex(mappedPalette.bl.light).asHexRGB,
        Color.fromHex(mappedPalette.pu.light).asHexRGB,
        Color.fromHex(mappedPalette.ma.light).asHexRGB,
      ],
      brights: [
        Color.fromHex(mappedPalette.re.dark).asHexRGB,
        Color.fromHex(mappedPalette.or.dark).asHexRGB,
        Color.fromHex(mappedPalette.ye.dark).asHexRGB,
        Color.fromHex(mappedPalette.gr.dark).asHexRGB,
        Color.fromHex(mappedPalette.cy.dark).asHexRGB,
        Color.fromHex(mappedPalette.bl.dark).asHexRGB,
        Color.fromHex(mappedPalette.pu.dark).asHexRGB,
        Color.fromHex(mappedPalette.ma.dark).asHexRGB,
      ],
      foreground: Color.fromHex(mappedPalette["tx"].light).asHexRGB,
      background: Color.fromHex(mappedPalette.bg.light).asHexRGB,
      cursor_bg: Color.fromHex(mappedPalette["tx"].light).asHexRGB,
      cursor_border: Color.fromHex(mappedPalette["tx"].light).asHexRGB,
      cursor_fg: Color.fromHex(mappedPalette.bg.light).asHexRGB,
      selection_bg: Color.fromHex(mappedPalette["ui-3"].light).asHexRGB,
      selection_fg: Color.fromHex(mappedPalette["tx"].light).asHexRGB,
      indexed: {},
    },
  };
  const theme = isDark ? themeDark : themeLight;

  const filePath = `./_generated/${slugifiedName}/wezterm/${themeName}.toml`;

  writeFile(filePath, toTOML(theme));
};
