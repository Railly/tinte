import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import type { ShikiCssTheme } from "@tinte/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { codeToHtml } from "shiki";
import { createCssVariablesTheme } from "shiki/core";

const shikiTheme = createCssVariablesTheme({
  name: "tinte-css",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});

interface UseCodeHighlightProps {
  code: string;
  language: string;
  theme: ShikiCssTheme;
}

export function useCodeHighlight({
  code,
  language,
  theme,
}: UseCodeHighlightProps) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const prevThemeRef = useRef(theme);

  const cssVariables = useMemo(() => {
    const vars = theme.variables;
    return Object.entries(vars)
      .map(([key, value]) => `${key}: ${value};`)
      .join("\n");
  }, [theme.variables]);

  useEffect(() => {
    prevThemeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    const highlight = async () => {
      try {
        setLoading(true);
        const result = await codeToHtml(code, {
          lang: language as Parameters<typeof codeToHtml>[1]["lang"],
          theme: shikiTheme,
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
            transformerNotationFocus(),
            transformerNotationErrorLevel(),
          ],
        });
        if (!cancelled) {
          setHtml(
            result.replace(
              /<pre([^>]*)>/g,
              '<pre$1 style="background: transparent; margin: 0; overflow-x: auto;">',
            ),
          );
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setHtml(`<pre><code>${code}</code></pre>`);
          setLoading(false);
        }
      }
    };

    highlight();
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  return { html, cssVariables, loading };
}
