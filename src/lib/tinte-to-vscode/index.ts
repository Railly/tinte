import { getVSCodeColors } from "./colors";
import { generateTokenColors } from "./tokens";
import { defaultTokenColorMap } from "./config";
import { TinteTheme, VSCodeTheme, TokenColorMap } from "./types";

export function tinteToVSCode(
  tinteTheme: TinteTheme,
  name: string = "Tinte Theme",
  tokenColorMap: TokenColorMap = defaultTokenColorMap
): { light: VSCodeTheme; dark: VSCodeTheme } {
  const lightTheme: VSCodeTheme = {
    name: `${name} Light`,
    displayName: `${name} (Light)`,
    type: "light",
    colors: getVSCodeColors(tinteTheme.light, "light"),
    tokenColors: generateTokenColors(tinteTheme.light, tokenColorMap),
  };

  const darkTheme: VSCodeTheme = {
    name: `${name} Dark`,
    displayName: `${name} (Dark)`,
    type: "dark",
    colors: getVSCodeColors(tinteTheme.dark, "dark"),
    tokenColors: generateTokenColors(tinteTheme.dark, tokenColorMap),
  };

  return { light: lightTheme, dark: darkTheme };
}

export * from "./types";
export * from "./config";
export { getVSCodeColors } from "./colors";
export { generateTokenColors } from "./tokens";
