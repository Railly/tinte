import fs from "node:fs";
import path from "node:path";

export const entries = <O extends object>(obj: O) =>
  Object.entries(obj) as { [K in keyof O]: [K, O[K]] }[keyof O][];

export const writeFile = (filePath: string, data: string) => {
  const pathArray = filePath.split("/");
  pathArray.pop();
  const dirPath = pathArray.join("/");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(process.cwd(), filePath), data);
};

// export const getThemeName = (name: string, themeType: string) =>
//   `${name}-${themeType}`;

// sanitize One Hunter Theme to one-hunter-theme
export const getThemeName = (...args: string[]) => {
  const themeName = args.join("-").toLowerCase();
  return themeName.replace(/\s/g, "-");
};
