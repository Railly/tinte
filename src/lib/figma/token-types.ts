import type { ShadcnBlock } from "@/types/shadcn";

export interface FigmaTokens {
  colors: Record<string, string>;
  numbers: Record<string, string>;
}

const NUMBER_TOKENS = new Set([
  "radius",
  "radius-sm",
  "radius-md",
  "radius-lg",
  "radius-xl",
  "letter-spacing",
  "shadow-opacity",
  "shadow-offset-x",
  "shadow-offset-y",
  "shadow-blur",
  "shadow-spread",
]);

const EXCLUDED_TOKENS = new Set([
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
  "font-sans",
  "font-serif",
  "font-mono",
]);

export function categorizeTokens(palette: ShadcnBlock): FigmaTokens {
  const colors: Record<string, string> = {};
  const numbers: Record<string, string> = {};

  for (const [key, value] of Object.entries(palette)) {
    if (EXCLUDED_TOKENS.has(key)) {
      continue;
    }

    if (NUMBER_TOKENS.has(key)) {
      numbers[key] = value;
    } else {
      colors[key] = value;
    }
  }

  return { colors, numbers };
}
