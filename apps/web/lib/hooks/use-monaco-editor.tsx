import { useEffect, useMemo } from "react";
import { useMonaco, loader } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { useTheme } from "next-themes";
import { getHighlighter } from "shiki";
// import oneHunterThemeDark from "@/lib/themes/one-hunter-theme-dark.json";
import oneHunterThemeLight from "@/lib/themes/one-hunter-theme-light.json";

export function useMonacoEditor({ theme }: { theme: any }) {
  const monaco = useMonaco();
  const { theme: nextTheme, systemTheme } = useTheme();

  const isDark = useMemo(() => {
    return (
      nextTheme === "dark" || (nextTheme === "system" && systemTheme === "dark")
    );
  }, [nextTheme, systemTheme]);

  const currentTheme = useMemo(() => {
    return isDark ? theme.name : "one-hunter-flexoki-light";
  }, [isDark]);

  useEffect(() => {
    if (!monaco) return;
    async function initializeMonaco() {
      const highlighter = await getHighlighter({
        themes: [theme as any, oneHunterThemeLight as any],
        langs: ["sql", "typescript", "javascript"],
      });
      monaco?.languages.register({ id: "sql" });

      shikiToMonaco(highlighter, monaco);

      loader.init().then((monaco) => {
        monaco.editor.setTheme(currentTheme);
      });
    }

    initializeMonaco();
  }, [monaco, theme]);

  useEffect(() => {
    if (!monaco) return;
    monaco.editor.setTheme(currentTheme);
  }, [monaco, currentTheme]);

  return { isDark, currentTheme };
}
