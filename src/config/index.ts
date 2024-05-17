import { FlexokiPalette } from "../palettes/flexoki.ts";
import { OneHunterMaterialPalette } from "../palettes/one-hunter-material.ts";
import { Palette } from "../palettes/types.ts";
import { Vercel2024Palette } from "../palettes/vercel-2024.ts";
import { MyTheme } from "../types.ts";

export const currentTheme: MyTheme = "Vercel 2024";

const myPalettes: Record<MyTheme, Palette> = {
  Flexoki: FlexokiPalette,
  "One Hunter Material": OneHunterMaterialPalette,
  "One Hunter Flexoki": FlexokiPalette,
  "Vercel 2024": Vercel2024Palette,
};

export const currentPalette = myPalettes[currentTheme];
