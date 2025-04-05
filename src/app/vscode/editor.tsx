"use client";

import { useHighlighter } from "@/hooks/use-highlighter";
import { useVSCodeTheme } from "@/hooks/use-vscode-theme";
import { normalizeName } from "@/lib/utils";

export function VSCodeEditor() {
  const { data: vsCodeTheme } = useVSCodeTheme("cqls275qrj660lo79ok0");

  const { data: highlighter } = useHighlighter({
    id: vsCodeTheme?.id,
    name: vsCodeTheme?.name,
    dark: vsCodeTheme?.dark,
    light: vsCodeTheme?.light,
  });

  if (!highlighter) return null;

  const code = `
  const a = 1;
  const b = 2;
  const c = a + b;
  `;

  const html = highlighter.codeToHtml(code, {
    lang: "typescript",
    themes: {
      light: `${normalizeName(vsCodeTheme?.name)}-light`,
      dark: `${normalizeName(vsCodeTheme?.name)}-dark`,
    },
  });

  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
