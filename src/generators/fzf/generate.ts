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
  const themeName = getThemeName(name, themeType);
  const slugifiedName = getThemeName(name);

  const isDark = themeType === "dark";

  const themeLight = {
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

  //   const themeDark = {
  //     color: [
  //       {
  //         fg: mappedPalette["tx-2"].dark,
  //         bg: mappedPalette.bg.dark,
  //         hl: mappedPalette.bg.light,
  //       },
  //       {
  //         "fg+": mappedPalette["tx-2"].dark,
  //         "bg+": mappedPalette["bg-2"].dark,
  //         "hl+": mappedPalette.bg.light,
  //       },
  //       {
  //         border: mappedPalette["re-2"].dark, //go
  //         header: mappedPalette.bg.light,
  //         gutter: mappedPalette.bg.dark,
  //       },
  //       {
  //         spinner: mappedPalette["cy-2"].dark, //go
  //         info: mappedPalette["cy-2"].dark, //go
  //         separator: mappedPalette["bg-2"].dark, //go
  //       },
  //       {
  //         pointer: mappedPalette["ye-2"].dark, //go
  //         marker: mappedPalette["re-2"].light, //go
  //         point: mappedPalette["ye-2"].light, //go
  //       },
  //     ],
  //   };
  const themeDark = {
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

  const theme = isDark ? themeDark : themeLight;

  const filePath = `./_generated/${slugifiedName}/fzf/${themeName}.md`;

  writeFile(filePath, toMD(theme));
};
