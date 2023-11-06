import { ThemeType } from "../types.js";
import { entries, getThemeName, writeFile } from "../../utils/index.js";
import { mappedPalette } from "../../mapped-palette.js";
import { toCSS } from "../../utils/format.js";
import { formatAbbreviationToSemantic } from "./mappers.js";

export const generateVanillaCSSTheme = ({
  name,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name);
  const lowercaseName = name.toLocaleLowerCase();
  const theme: Record<string, any> = {
    ":root": {},
    ".dark": {},
  };

  for (const [key, color] of entries(mappedPalette)) {
    const semanticKey = formatAbbreviationToSemantic(key);
    theme[":root"][`--${lowercaseName}-${semanticKey}`] = color["light"];
    theme[".dark"][`--${lowercaseName}-${semanticKey}`] = color["dark"];
  }

  const filePath = `./_generated/${themeName}/vanilla-css/${themeName}-vanilla.css`;
  writeFile(filePath, toCSS(theme));
};
