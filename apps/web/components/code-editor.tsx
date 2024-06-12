import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { useMonacoEditor } from "@/lib/hooks/use-monaco-editor";
import MonacoEditor from "@monaco-editor/react";
import React, { useRef, useEffect, useState } from "react";
import { editor } from "monaco-editor";

interface CodeEditorProps {
  theme: any;
  code?: string;
  onCodeChange: (value: string | undefined) => void;
  language: string;
  setColorPickerShouldBeHighlighted: React.Dispatch<
    React.SetStateAction<{
      key: string;
      value: boolean;
    }>
  >;
}

export const CodeEditor = ({
  theme,
  code,
  onCodeChange,
  language,
  setColorPickerShouldBeHighlighted,
}: CodeEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const codeRef = useRef<HTMLPreElement>(null);
  const { currentThemeName, tokens } = useMonacoEditor({
    theme,
    text: code,
    language,
    editorRef,
  });
  const { highlightedText } = useHighlighter({
    theme,
    text: code,
    language,
    tokens,
  });
  useEffect(() => {
    const codeElement = codeRef.current;

    const handleTokenClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tokenType =
        getComputedStyle(target).getPropertyValue("--shiki-token-type");

      if (tokenType) {
        setColorPickerShouldBeHighlighted({ key: tokenType, value: true });
      }
    };

    codeElement?.addEventListener("click", handleTokenClick);

    return () => {
      codeElement?.removeEventListener("click", handleTokenClick);
    };
  }, []);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  return (
    <div className="w-full h-full grid md:grid-cols-2 gap-4 max-h-[80vh]">
      <pre
        ref={codeRef}
        className="overflow-x-auto border [&>pre]:p-4 text-sm !text-[13px]"
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />
      <MonacoEditor
        className="!w-full !h-[40vh] border"
        theme={currentThemeName}
        onMount={handleEditorDidMount}
        height="100%"
        language={language}
        value={code}
        onChange={onCodeChange}
        options={{
          fontFamily: "Geist Mono",
          fontSize: 13,
          padding: { top: 16 },
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: "on",
          formatOnType: true,
          lineDecorationsWidth: 1,
          lineNumbersMinChars: 4,
          tabSize: 2,
        }}
      />
    </div>
  );
};
