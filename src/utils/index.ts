import fs from "node:fs";
import path from "node:path";

export const entries = <O extends object>(obj: O) =>
  Object.entries(obj) as { [K in keyof O]: [K, O[K]] }[keyof O][];

export const toJSON = <T>(obj: T) => JSON.stringify(obj, null, 2);

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
