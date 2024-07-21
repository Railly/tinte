import { useEffect, useMemo, useState } from "react";
import { useMonaco } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { useTheme } from "next-themes";
import { getHighlighter } from "shiki";
import { LANGS, MONACO_SHIKI_LANGS } from "../constants";
import { MonacoToken } from "../types";
import { editor } from "monaco-editor";
import { GeneratedVSCodeTheme } from "../core";

export function useMonacoEditor({
  vsCodeTheme,
  language,
  text,
  editorRef,
}: {
  vsCodeTheme: GeneratedVSCodeTheme;
  text?: string;
  language: string;
  editorRef: React.RefObject<editor.IStandaloneCodeEditor> | null;
}) {
  const monaco = useMonaco();
  const { theme: nextTheme } = useTheme();
  const [tokens, setTokens] = useState<Array<MonacoToken>>([]);

  const isDark = useMemo(() => {
    return (
      nextTheme === "dark" ||
      (nextTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }, [nextTheme]);

  const currentThemeName = useMemo(() => {
    return isDark ? vsCodeTheme.dark.name : vsCodeTheme.light.name;
  }, [isDark, vsCodeTheme, nextTheme]);

  const getAllTokensWithStyles = (editor: editor.IStandaloneCodeEditor) => {
    const model = editor.getModel();
    if (!model) return [];

    const fullContent = model.getValue();

    const allTokens = monaco?.editor.tokenize(fullContent, language);

    if (!allTokens || !allTokens.length) return [];

    const tokensWithStyles: Array<MonacoToken> = [];

    allTokens.forEach((lineTokens, lineIndex) => {
      const lineContent = model.getLineContent(lineIndex + 1);
      lineTokens.forEach((token, tokenIndex) => {
        const tokenText = lineContent.substring(
          token.offset,
          tokenIndex < lineTokens.length - 1
            ? lineTokens[tokenIndex + 1]?.offset
            : undefined
        );

        const lineDecorations = editor.getLineDecorations(lineIndex + 1);

        const tokenStyle = lineDecorations
          ? lineDecorations.find(
              (dec) =>
                dec.range.startColumn <= token.offset + 1 &&
                dec.range.endColumn > token.offset + 1
            )
          : null;
        if (tokenText.trim() === "") return;
        tokensWithStyles.push({
          text: tokenText,
          type: token.type,
          className: tokenStyle ? tokenStyle.options.inlineClassName || "" : "",
          foreground: tokenStyle
            ? tokenStyle.options.inlineClassName || ""
            : "",
          lineNumber: lineIndex + 1,
          tokenIndex: tokenIndex + 1,
        });
      });
    });

    return tokensWithStyles;
  };

  useEffect(() => {
    if (!monaco || !editorRef?.current) return;
    if (editorRef?.current) {
      setTokens(getAllTokensWithStyles(editorRef.current));
    }
  }, [monaco, editorRef?.current, language, text]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function initializeMonaco(customTheme: any) {
    if (!monaco) return;
    const highlighter = await getHighlighter({
      themes: [customTheme.light, customTheme.dark],
      langs: Object.values(MONACO_SHIKI_LANGS),
    });

    LANGS.forEach((lang) => {
      if (!monaco) return;
      monaco.languages.register({
        id: MONACO_SHIKI_LANGS[lang as keyof typeof MONACO_SHIKI_LANGS],
      });
    });

    shikiToMonaco(highlighter, monaco);
  }

  useEffect(() => {
    if (!monaco) return;

    initializeMonaco(vsCodeTheme).then(() => {
      monaco.editor.setTheme(currentThemeName);
    });
  }, [monaco, vsCodeTheme, currentThemeName, language]);

  return { isDark, currentThemeName, tokens };
}
