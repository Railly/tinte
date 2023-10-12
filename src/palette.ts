import colors from "./colors.ts";
import { ColorMap, Shade } from "./types.ts";
import { entries } from "./utils/index.ts";

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
    light: colors.base.black,
    dark: colors.base[200],
  },
  "tx-2": {
    light: colors.base[600],
    dark: colors.base[500],
  },
  "tx-3": {
    light: colors.base[300],
    dark: colors.base[700],
  },
};

const interfaceTones = {
  ui: {
    light: colors.base[100],
    dark: colors.base[900],
  },
  "ui-2": {
    light: colors.base[150],
    dark: colors.base[850],
  },
  "ui-3": {
    light: colors.base[200],
    dark: colors.base[800],
  },
};

const backgroundTones = {
  bg: {
    light: colors.base.paper,
    dark: colors.base.black,
  },
  "bg-2": {
    light: colors.base[50],
    dark: colors.base[950],
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
      light: colors[colorName][lightContrastShade],
      dark: colors[colorName][darkContrastShade],
    };
    colorMap[`${abbreviation}-2`] = {
      light: colors[colorName][darkContrastShade],
      dark: colors[colorName][lightContrastShade],
    };
  }

  return colorMap;
};

export const palette = {
  ...textTones,
  ...interfaceTones,
  ...backgroundTones,
  ...generateColorTones({ lightContrastShade: 500, darkContrastShade: 300 }),
};
