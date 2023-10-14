import { FlexokiPalette } from "../palettes/flexoki.ts";
import { OneHunterPalette } from "../palettes/one-hunter.ts";
import { Palette } from "../palettes/types.ts";
import { MyTheme } from "../types.ts";

export const currentTheme: MyTheme = "One Hunter";

const myPalettes: Record<MyTheme, Palette> = {
  Flexoki: FlexokiPalette,
  "One Hunter": OneHunterPalette,
};

export const currentPalette = myPalettes[currentTheme];
