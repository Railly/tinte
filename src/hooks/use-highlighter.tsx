import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemedToken, getHighlighter } from "shiki";
import { LANGS, MONACO_SHIKI_LANGS } from "../constants";
import { MonacoToken } from "../types";

export function useHighlighter({
  theme,
  text,
  language,
  tokens,
}: {
  theme: {
    light: any;
    dark: any;
  };
  text?: string;
  language: string;
  tokens?: Array<MonacoToken>;
}) {
  const { theme: nextTheme } = useTheme();
  const [highlightedText, setHighlightedText] = useState("");

  useEffect(() => {
    async function highlight() {
      if (!text || !theme) return;

      const highlighter = await getHighlighter({
        themes: [theme.light, theme.dark],
        langs: Object.values(MONACO_SHIKI_LANGS),
      });

      setHighlightedText(
        highlighter.codeToHtml(text, {
          lang:
            MONACO_SHIKI_LANGS[language as keyof typeof MONACO_SHIKI_LANGS] ||
            "plaintext",
          themes: {
            light: theme.light.name,
            dark: theme.dark.name,
          },
        })
      );
    }

    highlight();
  }, [text, theme, nextTheme, language, tokens]);

  return { highlightedText };
}
