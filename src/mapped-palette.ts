import { currentPalette } from "./config/index.js";
import { ColorMap, Shade } from "./types.js";
import { entries } from "./utils/index.js";

const colorAbbreviations = {
  red: "re",
  orange: "or",
  yellow: "ye",
  green: "gr",
  cyan: "cy",
  blue: "bl",
  purple: "pu",
  magenta: "ma",
} as const;

const textTones = {
  tx: {
    light: currentPalette.base.black,
    dark: currentPalette.base[200],
  },
  "tx-2": {
    light: currentPalette.base[600],
    dark: currentPalette.base[500],
  },
  "tx-3": {
    light: currentPalette.base[300],
    dark: currentPalette.base[700],
  },
};

const interfaceTones = {
  ui: {
    light: currentPalette.base[100],
    dark: currentPalette.base[900],
  },
  "ui-2": {
    light: currentPalette.base[150],
    dark: currentPalette.base[850],
  },
  "ui-3": {
    light: currentPalette.base[200],
    dark: currentPalette.base[800],
  },
};

const backgroundTones = {
  bg: {
    light: currentPalette.base.paper,
    dark: currentPalette.base.black,
  },
  "bg-2": {
    light: currentPalette.base[50],
    dark: currentPalette.base[950],
  },
};

const generateColorTones = ({
  lightContrastShade = 500,
  darkContrastShade = 300,
}: {
  lightContrastShade: Shade;
  darkContrastShade: Shade;
}): ColorMap => {
  const colorMap: ColorMap = {} as ColorMap;

  for (const [colorName, abbreviation] of entries(colorAbbreviations)) {
    colorMap[abbreviation] = {
      light: currentPalette[colorName][lightContrastShade],
      dark: currentPalette[colorName][darkContrastShade],
    };
    colorMap[`${abbreviation}-2`] = {
      light: currentPalette[colorName][darkContrastShade],
      dark: currentPalette[colorName][lightContrastShade],
    };
  }

  return colorMap;
};

export const mappedPalette = {
  ...textTones,
  ...interfaceTones,
  ...backgroundTones,
  // ...generateColorTones({ lightContrastShade: 700, darkContrastShade: 400 }),
  // ...generateColorTones({ lightContrastShade: 500, darkContrastShade: 300 }),
  ...generateColorTones({
    lightContrastShade: 800, // Light shade for contrast
    darkContrastShade: 300, // Dark shade for contrast
  }),
};
