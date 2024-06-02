import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getHighlighter } from "shiki";

export function useHighlighter({
  theme,
  text,
  lang = "typescript",
}: {
  theme: {
    lightTheme: any;
    darkTheme: any;
  };
  text?: string;
  lang?: string;
}) {
  const { theme: nextTheme } = useTheme();
  const [highlightedText, setHighlightedText] = useState("");

  useEffect(() => {
    async function highlight() {
      if (!text) return;
      console.log({
        themes: {
          light: theme.lightTheme,
          dark: theme.darkTheme,
        },
        ga: "Ga",
      });
      const highlighter = await getHighlighter({
        themes: [theme.lightTheme, theme.darkTheme],
        langs: ["json", "typescript", "javascript"],
      });
      if (!highlighter) return;

      setHighlightedText(
        highlighter.codeToHtml(text, {
          lang,
          themes: {
            light: theme.lightTheme.name,
            dark: theme.darkTheme.name,
          },
        })
      );
    }

    highlight();
  }, [text, theme.darkTheme, theme.lightTheme, nextTheme]);

  return { highlightedText };
}
