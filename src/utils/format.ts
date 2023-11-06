import { entries } from "./index.js";
import { Color } from "./color.js";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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

const convertToTOML = (obj: any, level = 0): string => {
  let toml = "";

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (typeof value === "object" && !Array.isArray(value)) {
      toml += `[${key}]\n`;
      toml += convertToTOML(value, level + 1);
    } else if (Array.isArray(value)) {
      toml += `${key} = [\n`;
      const rgbArray = value
        .map((item: string) => `${indent(level)}"${item}"`)
        .join(",\n");
      toml += `${rgbArray}\n]\n`;
    } else {
      toml += `${key} = "${value}"\n`;
    }
  }

  return toml;
};

const convertToMD = ({ name, ...obj }: Record<string, any>): string => {
  const lines: string[] = [];
  const title = name.split("-").map(capitalize).join(" ");

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    lines.push(`### ${title}\n\n\`\`\`bash`);

    for (const item of value) {
      const lineParts = Object.entries(item).map(
        ([subKey, subValue]) => `${subKey}:${subValue}`
      );
      lines.push(`--${key}=${lineParts.join(",")}`);
    }

    lines.push("```");
  }

  return lines.join("\n");
};

export const toJSON = <T>(obj: T) => JSON.stringify(obj, null, 2);

export const toYAML = <T extends object>(obj: T) => convertToYAML(obj);

export const toTOML = (obj: Record<string, any>) => convertToTOML(obj);

export const toMD = (obj: Record<string, any>) => convertToMD(obj);

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
    const maxKeyLength = Math.max(...Object.keys(values).map((k) => k.length));

    ini += `# ${section}
`;

    for (const [key, value] of entries(values)) {
      const paddedKey = key.padEnd(maxKeyLength, " ");
      ini += `${paddedKey} ${value}
`;
    }
    ini += `
`;
  }
  return ini;
};

export const toThemeSH = (obj: Record<string, any>) => {
  let sh = "";
  for (const [key, value] of entries(obj)) {
    sh += `${key} ${value}
`;
  }
  return sh;
};

export const toXResources = (
  defines: Record<string, Record<string, string>>,
  obj: Record<string, any>
) => {
  let xresources = "";

  const maxKeyLength = Math.max(...Object.keys(obj).map((k) => k.length));
  for (const [key, value] of entries(defines)) {
    xresources += `! ${key}
`;

    for (const [k, v] of entries(value)) {
      const paddedKey = k.padEnd(maxKeyLength + 2, " ");
      xresources += `#define ${paddedKey}    ${v}
`;
    }
    xresources += `
`;
  }

  for (const [key, value] of entries(obj)) {
    const maxKeyLength = Math.max(...Object.keys(value).map((k) => k.length));

    xresources += `! ${key}
`;

    for (const [k, v] of entries(value)) {
      const paddedKey = k.padEnd(maxKeyLength, " ");
      xresources += `${paddedKey}:  ${v}
`;
    }
    xresources += `
`;
  }
  return xresources;
};
