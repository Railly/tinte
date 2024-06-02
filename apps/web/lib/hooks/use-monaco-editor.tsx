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
  const { theme: nextTheme, systemTheme } = useTheme();
  console.log({
    nextTheme,
    systemTheme,
  });
  const theme =
    nextTheme === "dark" ? monacoTheme.darkTheme : monacoTheme.lightTheme;

  const isDark = useMemo(() => {
    return (
      nextTheme === "dark" || (nextTheme === "system" && systemTheme === "dark")
    );
  }, [nextTheme, systemTheme]);

  const currentThemeName = useMemo(() => {
    return theme.name;
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
  }, [monaco, theme, nextTheme, systemTheme]);

  useEffect(() => {
    if (!monaco) return;
    monaco.editor.setTheme(currentThemeName);
  }, [monaco, currentThemeName]);

  return { isDark, currentThemeName };
}
