import { entries } from "./index.ts";
import { Color } from "./color.ts";

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

export const toTOML = (obj: Record<string, any>) => convertToTOML(obj);

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

const isObjectArrayOfTables = (obj: any): boolean => {
  if (Array.isArray(obj) && obj.length === 2) {
    const secondValue = obj[1];
    return (
      Array.isArray(secondValue) &&
      secondValue.length > 0 &&
      isPlainObject(secondValue[0])
    );
  }
  return false;
};

const isLastObjectArrayOfTables = (simplePairs: [string, any][]): boolean => {
  const array = simplePairs[simplePairs.length - 1];
  return isObjectArrayOfTables(array);
};

const isPlainObject = (obj: any): boolean => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
};

const escapeKey = (key: string): string => {
  return /^[a-zA-Z0-9-_]*$/.test(key) ? key : `"${key}"`;
};

const format = (value: any): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `"${value}"`;
  return value.toString();
};

const convertToTOML = (
  hash: Record<string, any>,
  options: { indent: number; newlineAfterSection: boolean } = {
    indent: 0,
    newlineAfterSection: false,
  }
): string => {
  const visit = (hash: Record<string, any>, prefix: string) => {
    const nestedPairs: [string, any][] = [];
    const simplePairs: [string, any][] = [];
    const indentStr = "".padStart(options.indent || 0, " ");

    if (prefix !== "") {
      // Add section header when prefix is not empty
      toml += "[" + prefix + "]\n";
    }

    Object.keys(hash).forEach((key) => {
      const value = hash[key];

      if (value === undefined) {
        throw new TypeError(
          `Cannot convert \`undefined\` at key "${key}" to TOML.`
        );
      }

      if (value === null) {
        throw TypeError(`Cannot convert \`null\` at key "${key}" to TOML.`);
      }

      if (
        Array.isArray(value) &&
        value.length > value.filter(() => true).length
      ) {
        throw new TypeError(
          `Cannot convert sparse array at key "${key}" to TOML.`
        );
      }

      (isPlainObject(value) ? nestedPairs : simplePairs).push([key, value]);
    });

    simplePairs.forEach((array) => {
      const key = array[0];
      const value = array[1];

      if (Array.isArray(value)) {
        toml += indentStr + key + " = [\n";
        for (let i = 0; i < value.length; i++) {
          toml += `${indentStr}  "${value[i]}"`;
          if (i < value.length - 1) {
            toml += ",";
          }
          toml += "\n";
        }
        toml += indentStr + "]\n";
      } else {
        toml += indentStr + escapeKey(key) + " = " + format(value) + "\n";
      }
    });

    if (
      simplePairs.length > 0 &&
      !isLastObjectArrayOfTables(simplePairs) &&
      options.newlineAfterSection
    ) {
      toml += "\n";
    }

    nestedPairs.forEach((array) => {
      const key = array[0];
      const value = array[1];

      visit(
        value,
        prefix
          ? `${prefix}.${escapeKey(key.toString())}`
          : escapeKey(key.toString())
      );
    });
  };

  let toml = "";
  visit(hash, "");
  return toml;
};
