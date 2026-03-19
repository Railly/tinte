import { CodexPreview } from "@/components/preview/codex/codex-preview";
import { CodexIcon } from "@/components/shared/icons";
import type {
  CodexTheme,
  CodexThemeBlock,
  TinteBlock,
  TinteTheme,
} from "@tinte/core";
import { wcagLuminance } from "culori";
import type { PreviewableProvider, ProviderOutput } from "./types";

function computeContrast(bg: string, fg: string): number {
  const bgLum = wcagLuminance(bg);
  const fgLum = wcagLuminance(fg);
  if (bgLum === undefined || fgLum === undefined) return 45;

  const ratio =
    (Math.max(bgLum, fgLum) + 0.05) / (Math.min(bgLum, fgLum) + 0.05);
  return Math.round(Math.min(ratio / 0.21, 1) * 100);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapTinteBlockToCodex(block: TinteBlock): CodexThemeBlock {
  return {
    accent: block.pr,
    contrast: computeContrast(block.bg, block.tx),
    fonts: { code: null, ui: null },
    ink: block.tx,
    opaqueWindows: false,
    semanticColors: {
      diffAdded: block.ac_1,
      diffRemoved: block.ac_2,
      skill: block.sc,
    },
    surface: block.bg,
  };
}

export function convertTinteToCodex(tinte: TinteTheme): CodexTheme {
  const themeId = tinte.name ? slugify(tinte.name) : "tinte";
  return {
    light: {
      codeThemeId: themeId,
      theme: mapTinteBlockToCodex(tinte.light),
      variant: "light",
    },
    dark: {
      codeThemeId: themeId,
      theme: mapTinteBlockToCodex(tinte.dark),
      variant: "dark",
    },
  };
}

export function getCodexVariantString(
  theme: TinteTheme,
  variant: "light" | "dark",
): string {
  const codexTheme = convertTinteToCodex(theme);
  const entry = variant === "light" ? codexTheme.light : codexTheme.dark;
  return `codex-theme-v1:${JSON.stringify(entry)}`;
}

function generateExportContent(theme: CodexTheme): string {
  return JSON.stringify(
    {
      light: `codex-theme-v1:${JSON.stringify(theme.light)}`,
      dark: `codex-theme-v1:${JSON.stringify(theme.dark)}`,
    },
    null,
    2,
  );
}

export const codexProvider: PreviewableProvider<CodexTheme> = {
  metadata: {
    id: "codex",
    name: "Codex",
    description: "Theme for OpenAI Codex desktop app",
    category: "editor",
    tags: ["openai", "ai", "codex", "terminal"],
    icon: CodexIcon,
    website: "https://openai.com/index/introducing-codex/",
  },

  fileExtension: "json",
  mimeType: "application/json",
  convert: convertTinteToCodex,

  export: (theme: TinteTheme, filename?: string): ProviderOutput => ({
    content: generateExportContent(convertTinteToCodex(theme)),
    filename: filename || "codex-theme.json",
    mimeType: "application/json",
  }),

  validate: (output: CodexTheme) => !!(output.light && output.dark),

  preview: {
    component: CodexPreview,
  },
};
