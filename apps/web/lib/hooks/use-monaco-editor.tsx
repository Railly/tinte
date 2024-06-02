import { useEffect, useMemo } from "react";
import { useMonaco, loader } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { useTheme } from "next-themes";
import { getHighlighter } from "shiki";

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
  }, [isDark]);

  useEffect(() => {
    if (!monaco) return;
    async function initializeMonaco() {
      const highlighter = await getHighlighter({
        themes: [monacoTheme.lightTheme, monacoTheme.darkTheme],
        langs: ["sql", "typescript", "javascript"],
      });
      monaco?.languages.register({ id: "sql" });

      shikiToMonaco(highlighter, monaco);

      loader.init().then((monaco) => {
        monaco.editor.setTheme(currentThemeName);
      });
    }

    initializeMonaco();
  }, [monaco, nextTheme]);

  useEffect(() => {
    if (!monaco) return;
    monaco.editor.setTheme(currentThemeName);
  }, [monaco, currentThemeName]);

  return { isDark, currentThemeName };
}
