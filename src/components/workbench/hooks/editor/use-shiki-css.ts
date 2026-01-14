import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shiki";
import { createCssVariablesTheme } from "shiki/core";
import type { CodeTemplate } from "@/types/code-template";

interface ShikiCssTheme {
  name: string;
  variables: Record<string, string>;
}

interface UseShikiCssHighlighterProps {
  themeSet: { light: ShikiCssTheme; dark: ShikiCssTheme };
  currentMode: "light" | "dark";
  template: CodeTemplate;
  themeVersion: number;
}

export function useShikiCssHighlighter({
  themeSet,
  currentMode,
  template,
  themeVersion,
}: UseShikiCssHighlighterProps) {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const currentTheme = themeSet[currentMode];

  const cssVariables = useMemo(() => {
    const vars = currentTheme.variables;
    const isDark = currentMode === "dark";

    return `:root {
      ${Object.entries(vars)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join("\n")}
    }

    .shiki-css-container {
      background: var(--shiki-background, #ffffff);
      color: var(--shiki-foreground, #000000);
    }

    /* Transformer styles */
    .line.diff.add {
      background-color: ${isDark ? "rgba(46, 160, 67, 0.15)" : "rgba(172, 242, 189, 0.5)"};
      border-left: 3px solid ${isDark ? "#2ea043" : "#28a745"};
      padding-left: 8px;
      margin-left: -11px;
    }

    .line.diff.remove {
      background-color: ${isDark ? "rgba(248, 81, 73, 0.15)" : "rgba(255, 235, 233, 0.5)"};
      border-left: 3px solid ${isDark ? "#f85149" : "#dc3545"};
      padding-left: 8px;
      margin-left: -11px;
    }

    .line.highlighted {
      background-color: ${isDark ? "rgba(255, 255, 0, 0.1)" : "rgba(255, 255, 0, 0.2)"};
      border-left: 3px solid ${isDark ? "#ffd700" : "#ffeb3b"};
      padding-left: 8px;
      margin-left: -11px;
    }

    .line.focused {
      background-color: ${isDark ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.05)"};
      border-left: 3px solid ${isDark ? "#6366f1" : "#4f46e5"};
      padding-left: 8px;
      margin-left: -11px;
    }

    .line.highlighted.error {
      background-color: ${isDark ? "rgba(248, 81, 73, 0.15)" : "rgba(254, 226, 226, 0.5)"};
      border-left: 3px solid ${isDark ? "#f85149" : "#dc2626"};
    }

    .line.highlighted.warning {
      background-color: ${isDark ? "rgba(251, 191, 36, 0.15)" : "rgba(254, 243, 199, 0.5)"};
      border-left: 3px solid ${isDark ? "#fbcf24" : "#d97706"};
    }

    .highlighted-word {
      background-color: ${isDark ? "rgba(88, 166, 255, 0.3)" : "rgba(59, 130, 246, 0.2)"};
      border-radius: 3px;
      padding: 1px 3px;
      font-weight: 500;
    }

    /* Add subtle animation for highlighted elements */
    .line.diff, .line.highlighted, .line.focused, .highlighted-word {
      transition: all 0.2s ease-in-out;
    }`;
  }, [currentTheme.variables, currentMode]);

  const shikiTheme = useMemo(() => {
    return createCssVariablesTheme({
      name: `tinte-css-${currentMode}`,
      variablePrefix: "--shiki-",
      variableDefaults: {
        foreground: currentMode === "dark" ? "#d4d4d4" : "#000000",
        background: currentMode === "dark" ? "#1e1e1e" : "#ffffff",
      },
      fontStyle: true,
    });
  }, [currentMode]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const highlightCode = async () => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }

        const result = await codeToHtml(template.code, {
          lang: template.language as any,
          theme: shikiTheme,
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
            transformerNotationFocus(),
            transformerNotationErrorLevel(),
          ],
        });

        const modifiedResult = result.replace(
          /<pre([^>]*)>/g,
          '<pre$1 style="view-transition-name: none; background: transparent;">',
        );
        setHtml(modifiedResult);

        if (isInitialLoad) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHtml(`<pre><code>${template.code}</code></pre>`);

        if (isInitialLoad) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    timeoutId = setTimeout(highlightCode, isInitialLoad ? 0 : 50);
    return () => clearTimeout(timeoutId);
  }, [
    template.code,
    template.language,
    shikiTheme,
    isInitialLoad,
    themeVersion,
  ]);

  return {
    html,
    loading,
    cssVariables,
  };
}
