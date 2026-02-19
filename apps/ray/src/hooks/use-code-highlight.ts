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

const CACHE_KEY = "ray:highlight-cache";
const CACHE_VERSION = 1;

interface CacheEntry {
  html: string;
  v: number;
}

function getCachedHtml(code: string, language: string): string | null {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}:${language}`);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (entry.v !== CACHE_VERSION) return null;
    const hash = simpleHash(code);
    const stored = localStorage.getItem(`${CACHE_KEY}:${language}:hash`);
    if (stored !== hash) return null;
    return entry.html;
  } catch {
    return null;
  }
}

function setCachedHtml(code: string, language: string, html: string): void {
  try {
    const entry: CacheEntry = { html, v: CACHE_VERSION };
    localStorage.setItem(`${CACHE_KEY}:${language}`, JSON.stringify(entry));
    localStorage.setItem(`${CACHE_KEY}:${language}:hash`, simpleHash(code));
  } catch {}
}

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

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
  const [html, setHtml] = useState(() => getCachedHtml(code, language) ?? "");
  const [loading, setLoading] = useState(() => !getCachedHtml(code, language));
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
      const cached = getCachedHtml(code, language);
      if (!cached) setLoading(true);

      try {
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
          const processed = result.replace(
            /<pre([^>]*)>/g,
            '<pre$1 style="background: transparent; margin: 0; overflow-x: auto;">',
          );
          setHtml(processed);
          setLoading(false);
          setCachedHtml(code, language, processed);
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
