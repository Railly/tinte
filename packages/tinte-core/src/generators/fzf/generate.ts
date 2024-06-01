import { mappedPalette } from "../../mapped-palette.ts";
import { toMD } from "../../utils/format.ts";
import { getThemeName, writeFile } from "../../utils/index.ts";
import { ThemeType } from "../types.ts";

export const generateFzFTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const slugifiedName = getThemeName(name);

  const themeLight = {
    name: `${slugifiedName}-light`,
    color: [
      {
        fg: mappedPalette["tx-3"].light,
        bg: mappedPalette.bg.light,
        hl: mappedPalette.tx.light,
      },
      {
        "fg+": mappedPalette["tx-3"].light,
        "bg+": mappedPalette["bg-2"].light,
        "hl+": mappedPalette.tx.light,
      },
      {
        border: mappedPalette.re.light,
        header: mappedPalette.tx.light,
        gutter: mappedPalette.bg.light,
      },
      {
        spinner: mappedPalette["cy-2"][themeType],
        info: mappedPalette["cy-2"][themeType],
        separator: mappedPalette["bg-2"][themeType],
      },
      {
        pointer: mappedPalette["ye-2"][themeType],
        marker: mappedPalette["re-2"][themeType],
        prompt: mappedPalette["ye-2"][themeType],
      },
    ],
  };

  const themeDark = {
    name: `${slugifiedName}-dark`,
    color: [
      {
        fg: mappedPalette["tx-2"].dark,
        bg: mappedPalette.bg.dark,
        hl: mappedPalette.bg.light,
      },
      {
        "fg+": mappedPalette["tx-2"].dark,
        "bg+": mappedPalette["bg-2"].dark,
        "hl+": mappedPalette.bg.light,
      },
      {
        border: mappedPalette["re-2"].dark,
        header: mappedPalette.bg.light,
        gutter: mappedPalette.bg.dark,
      },
      ...themeLight.color.slice(3),
    ],
  };

  const filePath = `./_generated/${slugifiedName}/fzf/theme.md`;

  const content = `${toMD(themeLight)}\n\n ${toMD(themeDark)}`;

  writeFile(filePath, content);
};
