import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getHighlighter } from "shiki";
import { LANGS } from "../constants";

export function useHighlighter({
  theme,
  text,
  language,
}: {
  theme: {
    lightTheme: any;
    darkTheme: any;
  };
  text?: string;
  language: string;
}) {
  const { theme: nextTheme } = useTheme();
  const [highlightedText, setHighlightedText] = useState("");

  useEffect(() => {
    async function highlight() {
      if (!text) return;

      const highlighter = await getHighlighter({
        themes: [theme.lightTheme, theme.darkTheme],
        langs: LANGS,
      });

      if (!highlighter) return;

      setHighlightedText(
        highlighter.codeToHtml(text, {
          lang: language,
          themes: {
            light: theme.lightTheme.name,
            dark: theme.darkTheme.name,
          },
        })
      );
    }

    highlight();
  }, [text, theme.darkTheme, theme.lightTheme, nextTheme, language]);

  return { highlightedText };
}
