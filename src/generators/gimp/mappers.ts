import { AllColorAbbreviations, AllToneAbbreviations } from "../../types.js";

const baseToneMappings = {
  tx: "Text",
  "tx-2": "Text Muted",
  "tx-3": "Text Faint",
  ui: "Interface",
  "ui-2": "Interface Hover",
  "ui-3": "Interface active",
  bg: "Background",
  "bg-2": "Background Secondary",
} as const;

const invertedColorAbbreviations = {
  re: "Red",
  or: "Orange",
  ye: "Yellow",
  gr: "Green",
  cy: "Cyan",
  bl: "Blue",
  pu: "Purple",
  ma: "Magenta",
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
    return `Light ${semantic}`;
  }

  return `Dark ${
    invertedColorAbbreviations[
      abbreviation as keyof typeof invertedColorAbbreviations
    ]
  }`;
};
