import { useState, useEffect, useMemo } from "react";
import { codeToHtml } from "shiki";
import { VSCodeTheme } from "@/lib/providers/vscode";

interface CodeTemplate {
  name: string;
  filename: string;
  language: string;
  code: string;
}

interface UseShikiHighlighterProps {
  themeSet: { light: VSCodeTheme; dark: VSCodeTheme };
  currentMode: "light" | "dark";
  template: CodeTemplate;
  themeVersion: number;
}

export function useShikiHighlighter({
  themeSet,
  currentMode,
  template,
  themeVersion,
}: UseShikiHighlighterProps) {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Memoize Shiki theme data
  const shikiThemeData = useMemo(() => {
    const currentTheme = themeSet[currentMode];
    return {
      name: `tinte-${currentMode}`,
      type: currentTheme.type,
      colors: {
        "editor.background":
          currentTheme.colors["editor.background"] ||
          (currentMode === "dark" ? "#1e1e1e" : "#ffffff"),
        "editor.foreground":
          currentTheme.colors["editor.foreground"] ||
          (currentMode === "dark" ? "#d4d4d4" : "#000000"),
        "editorLineNumber.foreground":
          currentTheme.colors["editorLineNumber.foreground"] || "#6a6a6a",
      },
      tokenColors: currentTheme.tokenColors.map((token) => ({
        scope: token.scope,
        settings: {
          foreground: token.settings.foreground,
          fontStyle: token.settings.fontStyle,
        },
      })),
    };
  }, [themeSet, currentMode, themeVersion]);

  // Fast highlighting - reduced debounce and smarter loading states
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const highlightCode = async () => {
      try {
        // Only show loading for initial load, not theme changes
        if (isInitialLoad) {
          setLoading(true);
        }

        const result = await codeToHtml(template.code, {
          lang: template.language as any,
          theme: shikiThemeData as any,
        });

        // Exclude from view transitions
        const modifiedResult = result.replace(
          /<pre([^>]*)>/g,
          '<pre$1 style="view-transition-name: none;">'
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

    // Reduced debounce for faster response
    timeoutId = setTimeout(highlightCode, isInitialLoad ? 0 : 50);
    return () => clearTimeout(timeoutId);
  }, [template.code, template.language, shikiThemeData, themeVersion, isInitialLoad]);

  return {
    html,
    loading,
  };
}
