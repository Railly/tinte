import { entries } from "./index.ts";
import { Color } from "./color.ts";
import { AllColorAbbreviations, AllToneAbbreviations } from "../types.ts";

const indent = (level: number) => "  ".repeat(level); // Two spaces for each level.

const convertToYAML = (obj: any, level = 0): string => {
  if (typeof obj !== "object" || obj === null) {
    return String(obj);
  }

  return entries(obj)
    .map(([key, value]) => {
      if (typeof value === "object") {
        return `${indent(level)}${key}:\n${convertToYAML(value, level + 1)}`;
      } else {
        return `${indent(level)}${key}: "${value}"`;
      }
    })
    .join("\n");
};

export const toJSON = <T>(obj: T) => JSON.stringify(obj, null, 2);

export const toYAML = <T extends object>(obj: T) => convertToYAML(obj);

export const toCSSVar = (name: string) => `var(--${name})`;

export const toCSS = (obj: Record<string, any>) => {
  let css = "";
  for (const [selector, styles] of entries(obj)) {
    const maxKeyLength = Math.max(...Object.keys(styles).map((k) => k.length));

    css += `${selector} {
`;
    for (const [key, value] of entries(styles)) {
      const paddedKey = key.padEnd(maxKeyLength, " ");
      css += `  ${paddedKey}: ${value};
`;
    }
    css += `
}
`;
  }
  return css;
};

export const processPaletteHexToInt = (paletteSection: {
  [key: string]: string;
}) => {
  const processed = {} as { [key: string]: string };
  for (const key in paletteSection) {
    const color = paletteSection[key];
    processed[key] = Color.fromHex(color).asIntRGB;
  }
  return processed;
};

const baseToneMappings = {
  tx: "text",
  "tx-2": "text-muted",
  "tx-3": "text-faint",
  ui: "ui",
  "ui-2": "ui-hover",
  "ui-3": "ui-active",
  bg: "bg",
  "bg-2": "bg-secondary",
} as const;

const invertedColorAbbreviations = {
  re: "red",
  or: "orange",
  ye: "yellow",
  gr: "green",
  cy: "cyan",
  bl: "blue",
  pu: "purple",
  ma: "magenta",
} as const;

export const formatAbbreviationToSemantic = (
  abbreviation: AllColorAbbreviations | AllToneAbbreviations
) => {
  if (abbreviation in baseToneMappings)
    return baseToneMappings[abbreviation as keyof typeof baseToneMappings];

  if (abbreviation.endsWith("-2")) {
    const color = abbreviation.slice(0, abbreviation.length - 2);
    const semantic =
      invertedColorAbbreviations[
        color as keyof typeof invertedColorAbbreviations
      ];
    return `${semantic}-secondary`;
  }

  return invertedColorAbbreviations[
    abbreviation as keyof typeof invertedColorAbbreviations
  ];
};
