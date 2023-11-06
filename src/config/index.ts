import { NeotericShadesPalette } from "../palettes/neoteric-shades.js";
import { FlexokiPalette } from "../palettes/flexoki.js";
import { OneHunterMaterialPalette } from "../palettes/one-hunter-material.js";
import { Palette } from "../palettes/types.js";
import { MyTheme } from "../types.js";

export const currentTheme: MyTheme = "Neoteric Shades";

const myPalettes: Record<MyTheme, Palette> = {
  Flexoki: FlexokiPalette,
  "One Hunter Material": OneHunterMaterialPalette,
  "One Hunter Flexoki": FlexokiPalette,
  "Neoteric Shades": NeotericShadesPalette,
};

export const currentPalette = myPalettes[currentTheme];
