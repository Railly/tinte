import { AllColorAbbreviations, AllToneAbbreviations } from "../../types.js";

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
