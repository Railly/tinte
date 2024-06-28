import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemedToken, getHighlighter } from "shiki";
import { LANGS } from "../constants";
import { MonacoToken } from "../types";

export function useHighlighter({
  theme,
  text,
  language,
  tokens,
}: {
  theme: {
    lightTheme: any;
    darkTheme: any;
  };
  text?: string;
  language: string;
  tokens: Array<MonacoToken>;
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

      const processedTokens = tokens?.reduce(
        (acc: Record<number, MonacoToken[]>, token: MonacoToken) => {
          const { lineNumber } = token;
          if (!acc[lineNumber] && String(lineNumber).trim() !== "") {
            acc[lineNumber] = [];
          }
          acc[lineNumber]?.push(token);
          return acc;
        },
        {}
      );

      if (!processedTokens) return;

      setHighlightedText(
        highlighter.codeToHtml(text, {
          lang: language,
          themes: {
            light: theme.lightTheme.name,
            dark: theme.darkTheme.name,
          },
          transformers: [
            {
              span(node) {
                const shikiTokenType = (node.properties.style as string)
                  ?.split(";")
                  ?.find((s) => s.trim().startsWith("--shiki-token-type"))
                  ?.split(":")[1]
                  ?.trim();

                node.properties.className = [
                  "relative rounded-sm cursor-pointer",
                ];
                node.children = [
                  {
                    type: "element",
                    tagName: "div",
                    properties: {
                      className: "inline-block peer relative",
                    },
                    children: [
                      {
                        type: "element",
                        tagName: "div",
                        properties: {
                          className:
                            "absolute inset-0 border border-transparent hover:border-black/50 dark:hover:border-white/50",
                          // @ts-ignore
                          style: `width: ${node.children[0]?.value.length}ch;`,
                        },
                        children: [],
                      },
                      {
                        type: "text",
                        // @ts-ignore
                        value: node.children[0]?.value,
                      },
                    ],
                  },
                  {
                    type: "element",
                    tagName: "div",
                    properties: {
                      className:
                        "absolute !top-4 -left-0 font-mono z-10 px-3 py-2 text-xs bg-background border dark:border-white/30 bg-secondary rounded-md shadow-lg mt-2 opacity-0 peer-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                    },
                    children: [
                      {
                        type: "text",
                        value: shikiTokenType || "unknown",
                      },
                    ],
                  },
                ];
              },
              tokens: (tokens: ThemedToken[][]): ThemedToken[][] => {
                return tokens.map((line, lineIndex) => {
                  return line.map((token) => {
                    const monacoToken = processedTokens[lineIndex + 1]?.find(
                      (t) => t.text.trim() === token.content.trim()
                    );
                    if (monacoToken) {
                      return {
                        ...token,
                        type: monacoToken.type,
                        htmlStyle: `${token.htmlStyle}; --shiki-token-type: ${monacoToken.type};`,
                        className: `shiki-token ${monacoToken.type}`,
                      };
                    }
                    return token;
                  });
                });
              },
            },
          ],
        })
      );
    }

    highlight();
  }, [text, theme, nextTheme, language, tokens]);

  return { highlightedText };
}
