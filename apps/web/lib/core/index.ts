import { getVSCodeColors } from "./colors";
import { generateTokenColors } from "./tokens";
import { ThemeConfig } from "./types";

export function generateVSCodeTheme(themeConfig: ThemeConfig) {
  const { displayName, palette, tokenColors } = themeConfig;

  const darkTheme = {
    name: "one-hunter-dark",
    displayName,
    type: "dark",
    colors: getVSCodeColors(palette.dark),
    tokenColors: generateTokenColors(palette.dark, tokenColors),
  };

  const lightTheme = {
    name: "one-hunter-light",
    displayName,
    type: "light",
    colors: getVSCodeColors(palette.light),
    tokenColors: generateTokenColors(palette.light, tokenColors),
  };

  return { darkTheme, lightTheme };
}
