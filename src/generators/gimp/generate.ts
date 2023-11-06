import { mappedPalette } from "../../mapped-palette.js";
import { Color } from "../../utils/color.js";
import { entries, getThemeName, writeFile } from "../../utils/index.js";
import { ThemeType } from "../types.js";
import { formatAbbreviationToSemantic } from "./mappers.js";

export const generateGimpTheme = ({
  name,
  themeType,
}: {
  name: string;
  themeType: ThemeType;
}) => {
  const themeName = getThemeName(name);

  const maxLengths = {
    red: Math.max(
      ...Object.values(mappedPalette).map(
        (color) => Color.fromHex(color[themeType]).asInt.red.toString().length
      )
    ),
    green: Math.max(
      ...Object.values(mappedPalette).map(
        (color) => Color.fromHex(color[themeType]).asInt.green.toString().length
      )
    ),
    blue: Math.max(
      ...Object.values(mappedPalette).map(
        (color) => Color.fromHex(color[themeType]).asInt.blue.toString().length
      )
    ),
  };

  const theme = `GIMP Palette
Name: ${themeName}
Columns: 8
${entries(mappedPalette).map(([key, color]) => {
  const rgbaColor = Color.fromHex(color[themeType]);

  const paddedRed = rgbaColor.asInt.red
    .toString()
    .padStart(maxLengths.red, " ");
  const paddedGreen = rgbaColor.asInt.green
    .toString()
    .padStart(maxLengths.green, " ");
  const paddedBlue = rgbaColor.asInt.blue
    .toString()
    .padStart(maxLengths.blue, " ");

  return `${paddedRed}  ${paddedGreen}  ${paddedBlue}  ${formatAbbreviationToSemantic(
    key
  )}`;
}).join(`
`)}`;

  const filePath = `./_generated/${themeName}/gimp/${themeName}.gpl`;
  writeFile(filePath, theme);
};
