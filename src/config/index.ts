import { FlexokiPalette } from "../palettes/flexoki.ts";
import { OneHunterMaterialPalette } from "../palettes/one-hunter-material.ts";
import { Palette } from "../palettes/types.ts";
import { MyTheme } from "../types.ts";

export const currentTheme: MyTheme = "Flexoki";

const myPalettes: Record<MyTheme, Palette> = {
  Flexoki: FlexokiPalette,
  "One Hunter Material": OneHunterMaterialPalette,
  "One Hunter Flexoki": FlexokiPalette,
};

export const currentPalette = myPalettes[currentTheme];
