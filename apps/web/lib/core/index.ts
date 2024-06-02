import { getVSCodeColors } from "./colors";
import { generateTokenColors } from "./tokens";
import { ThemeConfig } from "./types";

export function generateVSCodeTheme(themeConfig: ThemeConfig) {
  const { name, palette, tokenColors } = themeConfig;

  const darkTheme = {
    name: `${name}-dark`,
    type: "dark",
    colors: getVSCodeColors(palette.dark),
    tokenColors: generateTokenColors(palette.dark, tokenColors),
  };

  const lightTheme = {
    name: `${name}-light`,
    type: "light",
    colors: getVSCodeColors(palette.light),
    tokenColors: generateTokenColors(palette.light, tokenColors),
  };

  return { darkTheme, lightTheme };
}
