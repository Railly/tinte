type BaseColors = {
  black: string;
  50: string;
  100: string;
  150: string;
  200: string;
  300: string;
  500: string;
  600: string;
  700: string;
  800: string;
  850: string;
  900: string;
  950: string;
  paper: string;
};

type ColorMap = {
  950: string;
  900: string;
  800: string;
  700: string;
  600: string;
  500: string;
  400: string;
  300: string;
  200: string;
  100: string;
  50: string;
};

export type Palette = {
  base: BaseColors;
  red: ColorMap;
  orange: ColorMap;
  yellow: ColorMap;
  green: ColorMap;
  cyan: ColorMap;
  blue: ColorMap;
  purple: ColorMap;
  magenta: ColorMap;
};
