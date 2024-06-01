import { getVSCodeColors } from "./colors";
import { generateTokenColors } from "./tokens";
import { ThemeConfig } from "./types";

export function generateVSCodeTheme(themeConfig: ThemeConfig) {
  const { name, type, palette, tokenColors } = themeConfig;

  const vsCodeTheme = {
    name,
    type,
    colors: getVSCodeColors(palette),
    tokenColors: generateTokenColors(palette, tokenColors),
  };

  return vsCodeTheme;
}
