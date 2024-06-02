import { useEffect, useMemo } from "react";
import { useMonaco } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { useTheme } from "next-themes";
import { getHighlighter } from "shiki";
import { LANGS } from "../constants";

export function useMonacoEditor({
  theme: monacoTheme,
}: {
  theme: {
    lightTheme: any;
    darkTheme: any;
  };
}) {
  const monaco = useMonaco();
  const { theme: nextTheme } = useTheme();

  const isDark = useMemo(() => {
    return (
      nextTheme === "dark" ||
      (nextTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }, [nextTheme]);

  const currentThemeName = useMemo(() => {
    return isDark ? monacoTheme.darkTheme.name : monacoTheme.lightTheme.name;
  }, [isDark, monacoTheme, nextTheme]);

  async function initializeMonaco(customTheme: {
    lightTheme: any;
    darkTheme: any;
  }) {
    if (!monaco) return;
    const highlighter = await getHighlighter({
      themes: [customTheme.lightTheme, customTheme.darkTheme],
      langs: LANGS,
    });

    LANGS.forEach((lang) => {
      if (!monaco) return;
      monaco.languages.register({ id: lang });
    });

    shikiToMonaco(highlighter, monaco);
  }

  useEffect(() => {
    if (!monaco) return;

    initializeMonaco(monacoTheme).then(() => {
      monaco.editor.setTheme(currentThemeName);
    });
  }, [monaco, monacoTheme, currentThemeName]);

  return { isDark, currentThemeName };
}
