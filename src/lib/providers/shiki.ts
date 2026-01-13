import { ShikiPreview } from "@/components/preview/shiki/shiki-preview";
import { ShikiIcon } from "@/components/shared/icons";
import type { ShikiCssTheme, ShikiTheme } from "@/types/shiki";
import type { TinteBlock, TinteTheme } from "@/types/tinte";
import type { PreviewableProvider, ProviderOutput } from "./types";

function mapTinteBlockToShiki(
  block: TinteBlock,
  mode: "light" | "dark",
): ShikiCssTheme {
  const bg = block.bg || (mode === "light" ? "#ffffff" : "#1e1e1e");
  const fg = block.tx || (mode === "light" ? "#000000" : "#d4d4d4");

  // Map Tinte tokens to Shiki CSS variables
  const variables: Record<string, string> = {
    "--shiki-background": bg,
    "--shiki-foreground": fg,
    "--shiki-token-comment":
      block.tx_3 || (mode === "light" ? "#6a737d" : "#6a9955"),
    "--shiki-token-keyword":
      block.pr || block.sc || (mode === "light" ? "#d73a49" : "#569cd6"),
    "--shiki-token-string":
      block.ac_1 || block.ac_2 || (mode === "light" ? "#032f62" : "#ce9178"),
    "--shiki-token-constant":
      block.sc || block.pr || (mode === "light" ? "#005cc5" : "#4fc1ff"),
    "--shiki-token-function":
      block.ac_2 || block.pr || (mode === "light" ? "#6f42c1" : "#dcdcaa"),
    "--shiki-token-parameter":
      block.tx_2 || (mode === "light" ? "#24292e" : "#9cdcfe"),
    "--shiki-token-punctuation":
      block.tx_2 || (mode === "light" ? "#24292e" : "#d4d4d4"),
    "--shiki-token-string-expression":
      block.ac_3 || block.ac_1 || (mode === "light" ? "#22863a" : "#b5cea8"),
    "--shiki-token-link":
      block.pr || block.sc || (mode === "light" ? "#0366d6" : "#4fc1ff"),
  };

  return {
    name: `tinte-${mode}`,
    variables,
  };
}

export function convertTinteToShiki(tinte: TinteTheme): ShikiTheme {
  return {
    light: mapTinteBlockToShiki(tinte.light, "light"),
    dark: mapTinteBlockToShiki(tinte.dark, "dark"),
  };
}

function generateShikiCss(
  theme: ShikiTheme,
  overrides?: { light?: Record<string, string>; dark?: Record<string, string> },
): string {
  // Merge theme variables with overrides
  const lightVariables = {
    ...theme.light.variables,
    ...(overrides?.light || {}),
  };
  const darkVariables = {
    ...theme.dark.variables,
    ...(overrides?.dark || {}),
  };

  const lightVars = Object.entries(lightVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  const darkVars = Object.entries(darkVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  return `:root {
${lightVars}
}

.dark {
${darkVars}
}

/* Shiki CSS Variables Theme Styles */
.shiki-css-container {
  background: var(--shiki-background);
  color: var(--shiki-foreground);
  font-family: 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  line-height: 1.5;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
}

.shiki-css-container pre {
  background: transparent !important;
  margin: 0;
  padding: 0;
}

.shiki-css-container code {
  font-family: inherit;
}`;
}

export const shikiProvider: PreviewableProvider<ShikiTheme> = {
  metadata: {
    id: "shiki",
    name: "Shiki",
    description:
      "Syntax highlighter using CSS variables for maximum customization",
    category: "editor",
    tags: ["syntax", "highlighting", "css", "customizable"],
    icon: ShikiIcon,
    website: "https://shiki.style/",
    documentation:
      "https://shiki.style/guide/theme-colors-manipulation#css-variables-theme",
  },

  fileExtension: "css",
  mimeType: "text/css",
  convert: convertTinteToShiki,

  export: (theme: TinteTheme, filename?: string): ProviderOutput => ({
    content: generateShikiCss(convertTinteToShiki(theme)),
    filename: filename || "shiki-theme.css",
    mimeType: "text/css",
  }),

  validate: (output: ShikiTheme) => !!(output.light && output.dark),

  preview: {
    component: ShikiPreview,
  },
};
