import { useEffect, useMemo, useState } from "react";
import { useMonaco } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { useTheme } from "next-themes";
import { getHighlighter } from "shiki";
import { LANGS } from "../constants";
import { MonacoToken } from "../types";
import { editor } from "monaco-editor";

export function useMonacoEditor({
  theme: monacoTheme,
  language,
  text,
  editorRef,
}: {
  theme: {
    lightTheme: any;
    darkTheme: any;
  };
  text?: string;
  language: string;
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | undefined>;
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
    return isDark ? monacoTheme.darkTheme.name : monacoTheme.lightTheme.name;
  }, [isDark, monacoTheme, nextTheme]);

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
  }, [monaco, monacoTheme, currentThemeName, language]);

  return { isDark, currentThemeName, tokens };
}
