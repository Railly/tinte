import { generateTailwindPalette } from "./palette-generator";

export type Kind =
  | "url"
  | "json"
  | "cssvars"
  | "tailwind"
  | "palette"
  | "prompt"
  | "image";

export type Swatch = { step: number; hex: string };

export type PastedItem = {
  id: string;
  content: string;
  kind: Kind;
  colors?: string[];
  imageData?: string; // base64 data URL for images
  metadata?: {
    title: string;
    description: string;
    favicon: string;
    loading: boolean;
    error?: boolean;
  };
};

export function detectKind(s: string): Kind {
  const t = s.trim();
  if (/^https?:\/\//i.test(t)) return "url";
  if ((t.startsWith("{") && t.endsWith("}")) || /"colors"\s*:\s*{/.test(t))
    return "json";
  if (/--[\w-]+\s*:\s*(#|oklch\(|hsl\(|rgb\()/i.test(t)) return "cssvars";
  if (/module\.exports|export\s+default|tailwind\.config|theme:\s*{/.test(t))
    return "tailwind";
  if (/^#?[0-9a-f]{3,8}(?:\s+|,)/i.test(t)) return "palette";
  return "prompt";
}

export function generatePreview(content: string, kind: Kind) {
  switch (kind) {
    case "url":
      try {
        const url = new URL(content);
        const domain = url.hostname.replace("www.", "");
        const path = url.pathname !== "/" ? url.pathname : "";
        const isHomepage = !path && !url.search;

        return {
          title: domain,
          subtitle: isHomepage
            ? "Homepage"
            : path || url.search?.slice(0, 50) + "..." || "",
          colors: [],
        };
      } catch {
        return {
          title: content.slice(0, 40) + "...",
          subtitle: "Invalid URL",
          colors: [],
        };
      }

    case "json":
      try {
        const parsed = JSON.parse(content);
        const keys = Object.keys(parsed);
        const hasColors = "colors" in parsed || "theme" in parsed;

        return {
          title: hasColors ? "Theme Configuration" : `JSON Config`,
          subtitle: `${keys.length} properties: ${keys.slice(0, 3).join(", ")}${
            keys.length > 3 ? "..." : ""
          }`,
          colors: [],
        };
      } catch {
        const firstLine = content.split("\n")[0]?.slice(0, 50) + "...";
        return { title: "JSON Configuration", subtitle: firstLine, colors: [] };
      }

    case "cssvars":
      const vars = content.match(/--[\w-]+\s*:\s*([^;]+)/g) || [];
      const colorVars = vars
        .filter(
          (v) => v.includes("#") || v.includes("rgb") || v.includes("hsl")
        )
        .slice(0, 4);
      const varNames = content.match(/--[\w-]+/g) || [];

      return {
        title: `${varNames.length} CSS Variables`,
        subtitle:
          varNames.slice(0, 3).join(", ") + (varNames.length > 3 ? "..." : ""),
        colors: colorVars
          .map((v) => v.match(/#[0-9a-f]{3,8}/i)?.[0])
          .filter((c): c is string => Boolean(c))
          .slice(0, 4),
      };

    case "tailwind":
      const hasTheme = content.includes("theme:");
      const hasColors = content.includes("colors:");
      const configType = hasTheme ? "theme" : hasColors ? "colors" : "general";

      return {
        title: "Tailwind Config",
        subtitle: `${configType} configuration detected`,
        colors: [],
      };

    case "palette":
      const colorMatches = content.match(/#[0-9a-f]{3,8}/gi) || [];
      const uniqueColors = [...new Set(colorMatches)];

      return {
        title: `${uniqueColors.length} Color Palette`,
        subtitle:
          uniqueColors.length > 1
            ? "Ready for theme generation"
            : "Single color detected",
        colors: uniqueColors.slice(0, 8),
      };

    default:
      const lines = content.split("\n").filter((line) => line.trim());
      const firstLine = lines[0] || "";
      const secondLine = lines[1] || "";

      return {
        title:
          firstLine.slice(0, 50) + (firstLine.length > 50 ? "..." : "") ||
          "Text Content",
        subtitle:
          secondLine.slice(0, 80) + (secondLine.length > 80 ? "..." : "") || "",
        colors: [],
      };
  }
}

export function extractColors(content: string): string[] {
  const colorMatches = content.match(/#[0-9a-f]{3,8}/gi) || [];
  const uniqueColors = [...new Set(colorMatches)];
  return uniqueColors;
}

export function generateRamp(baseHex: string): Swatch[] {
  try {
    const palette = generateTailwindPalette(baseHex);
    return palette.map((color: any, index: number) => ({
      step:
        [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950][index] || 500,
      hex: color.value,
    }));
  } catch (error) {
    return [];
  }
}
