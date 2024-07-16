import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { useMonacoEditor } from "@/lib/hooks/use-monaco-editor";
import MonacoEditor from "@monaco-editor/react";
import React, { useRef, useEffect, useState } from "react";
import { editor } from "monaco-editor";
import { Button } from "./ui/button";
import { IconSave } from "./ui/icons";
import { MONACO_SHIKI_LANGS } from "@/lib/constants";

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
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const resizeEditor = () => {
      if (editorRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        editorRef.current.layout({ width, height });
      }
    };

    window.addEventListener("resize", resizeEditor);
    resizeEditor(); // Initial layout

    return () => window.removeEventListener("resize", resizeEditor);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full border rounded-md overflow-hidden"
      style={{ height: "calc(80vh - 30px)" }}
    >
      <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
        <h2 className="text-sm font-bold">Preview Editor</h2>
        <Button variant="outline">
          <IconSave />
          <span className="ml-2">Save Theme</span>
        </Button>
      </div>
      <div className="flex-grow !h-[70vh]" style={{ height: "70vh" }}>
        {/* Adjust 40px based on your header height */}
        <MonacoEditor
          theme={currentThemeName}
          onMount={handleEditorDidMount}
          language={
            MONACO_SHIKI_LANGS[language as keyof typeof MONACO_SHIKI_LANGS]
          }
          value={code}
          onChange={onCodeChange}
          height="calc(80vh - 40px)"
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
    </div>
  );
};
