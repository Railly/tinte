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
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);

  // View transition loading (non-negotiable)
  useEffect(() => {
    setIsViewTransitioning(true);
    const timer = setTimeout(() => setIsViewTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [themeVersion, currentMode]);

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

  // Debounced highlighting
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const highlightCode = async () => {
      try {
        setLoading(true);

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
        setLoading(false);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHtml(`<pre><code>${template.code}</code></pre>`);
        setLoading(false);
      }
    };

    timeoutId = setTimeout(highlightCode, 150);
    return () => clearTimeout(timeoutId);
  }, [template.code, template.language, shikiThemeData, themeVersion]);

  return {
    html,
    loading,
    isViewTransitioning,
  };
}
