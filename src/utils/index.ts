import fs from "node:fs";
import path from "node:path";
import { Color } from "./color.ts";

export const entries = <O extends object>(obj: O) =>
  Object.entries(obj) as { [K in keyof O]: [K, O[K]] }[keyof O][];

export const toJSON = <T>(obj: T) => JSON.stringify(obj, null, 2);

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

export const toYAML = <T extends object>(obj: T) => convertToYAML(obj);

export const toCSSVar = (name: string) => `var(--${name})`;

export const writeFile = (filePath: string, data: string) => {
  const pathArray = filePath.split("/");
  pathArray.pop();
  const dirPath = pathArray.join("/");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(process.cwd(), filePath), data);
};

export const getThemeName = (name: string, themeType: string) =>
  `${name}-${themeType}`;

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
