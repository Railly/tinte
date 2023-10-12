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

export const toConf = (obj: Record<string, any>) => {
  let ini = "";
  for (const [section, values] of entries(obj)) {
    console.log({ section, values });
    const maxKeyLength = Math.max(...Object.keys(values).map((k) => k.length));

    ini += `# ${section}
`;

    for (const [key, value] of entries(values)) {
      console.log({ key, value });
      const paddedKey = key.padEnd(maxKeyLength, " ");
      ini += `${paddedKey} ${value}
`;
    }
    ini += `
`;
  }
  return ini;
};
