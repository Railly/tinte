import { useEffect, useState } from "react";
import { getHighlighter } from "shiki";
// import oneHunterThemeDark from "@/lib/themes/one-hunter-theme-dark.json";
import oneHunterThemeLight from "@/lib/themes/one-hunter-theme-light.json";

export function useHighlighter({
  theme,
  text,
  lang = "typescript",
}: {
  theme: any;
  text?: string;
  lang?: string;
}) {
  const [highlightedText, setHighlightedText] = useState("");

  useEffect(() => {
    async function highlight() {
      if (!text) return;
      const highlighter = await getHighlighter({
        themes: [theme as any, oneHunterThemeLight as any],
        langs: ["json", "typescript", "javascript"],
      });

      setHighlightedText(
        highlighter.codeToHtml(text, {
          lang,
          themes: {
            light: "one-hunter-flexoki-light",
            dark: theme.name,
          },
        })
      );
    }

    highlight();
  }, [text, theme]);

  return { highlightedText };
}
