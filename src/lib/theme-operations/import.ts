import { formatHex, parse } from "culori";
import type { ColorToken, ShadcnBlock, ShadcnTheme } from "@/types/shadcn";
import type { TinteTheme } from "@/types/tinte";
import { shadcnToTinte } from "@/lib/provider-utils";

/**
 * Parse CSS variables from a CSS string
 */
function parseCSSVariables(css: string): Record<string, string> {
  const variables: Record<string, string> = {};

  // Match CSS variable declarations like --variable-name: value;
  const variableRegex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;

  let match = variableRegex.exec(css);
  while (match !== null) {
    const [, name, value] = match;
    variables[name] = value.trim();
    match = variableRegex.exec(css);
  }

  return variables;
}

/**
 * Normalize color value to hex using culori
 */
function normalizeColor(colorValue: string): string {
  try {
    const parsed = parse(colorValue);
    if (parsed) {
      return formatHex(parsed);
    }
  } catch (error) {
    console.warn(`Failed to parse color: ${colorValue}`, error);
  }

  // Fallback for unparseable colors
  if (colorValue.startsWith("#")) {
    return colorValue;
  }

  return "#000000"; // Ultimate fallback
}

/**
 * Convert parsed CSS variables to ShadcnBlock with proper color normalization
 */
function variablesToShadcnBlock(
  variables: Record<string, string>,
): ShadcnBlock {
  const block = {} as ShadcnBlock;

  // Map CSS variable names to ShadcnBlock properties
  const tokenMap: Record<string, ColorToken> = {
    background: "background",
    foreground: "foreground",
    card: "card",
    "card-foreground": "card-foreground",
    popover: "popover",
    "popover-foreground": "popover-foreground",
    primary: "primary",
    "primary-foreground": "primary-foreground",
    secondary: "secondary",
    "secondary-foreground": "secondary-foreground",
    muted: "muted",
    "muted-foreground": "muted-foreground",
    accent: "accent",
    "accent-foreground": "accent-foreground",
    destructive: "destructive",
    "destructive-foreground": "destructive-foreground",
    border: "border",
    input: "input",
    ring: "ring",
    "chart-1": "chart-1",
    "chart-2": "chart-2",
    "chart-3": "chart-3",
    "chart-4": "chart-4",
    "chart-5": "chart-5",
    sidebar: "sidebar",
    "sidebar-foreground": "sidebar-foreground",
    "sidebar-primary": "sidebar-primary",
    "sidebar-primary-foreground": "sidebar-primary-foreground",
    "sidebar-accent": "sidebar-accent",
    "sidebar-accent-foreground": "sidebar-accent-foreground",
    "sidebar-border": "sidebar-border",
    "sidebar-ring": "sidebar-ring",
  };

  // Map variables to block with color normalization
  for (const [varName, token] of Object.entries(tokenMap)) {
    if (variables[varName]) {
      block[token] = normalizeColor(variables[varName]);
    }
  }

  return block;
}

/**
 * Import a shadcn theme from CSS and convert to both TinteTheme and original ShadcnTheme
 */
export function importShadcnTheme(css: string): {
  tinteTheme: TinteTheme;
  shadcnTheme: ShadcnTheme;
} {
  // Extract :root and .dark sections
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
  const darkMatch = css.match(/\.dark\s*\{([^}]+)\}/);

  if (!rootMatch || !darkMatch) {
    throw new Error("CSS must contain both :root and .dark sections");
  }

  const lightVariables = parseCSSVariables(rootMatch[1]);
  const darkVariables = parseCSSVariables(darkMatch[1]);

  const shadcnTheme: ShadcnTheme = {
    light: variablesToShadcnBlock(lightVariables),
    dark: variablesToShadcnBlock(darkVariables),
  };

  const tinteTheme = shadcnToTinte(shadcnTheme);

  return { tinteTheme, shadcnTheme };
}
