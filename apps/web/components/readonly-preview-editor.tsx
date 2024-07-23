import React, { useRef, useEffect } from "react";
import { GeneratedVSCodeTheme } from "@/lib/core";
import { ThemeConfig } from "@/lib/core/types";
import { useMonacoEditor } from "@/lib/hooks/use-monaco-editor";
import MonacoEditor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MONACO_SHIKI_LANGS } from "@/lib/constants";

interface ReadOnlyPreviewEditorProps {
  vsCodeTheme: GeneratedVSCodeTheme;
  code: string;
  language: string;
  themeConfig: ThemeConfig;
}

export const ReadOnlyPreviewEditor: React.FC<ReadOnlyPreviewEditorProps> = ({
  vsCodeTheme,
  code,
  language,
  themeConfig,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentThemeName } = useMonacoEditor({
    vsCodeTheme,
    text: code,
    language,
    editorRef,
  });

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
    resizeEditor();

    return () => window.removeEventListener("resize", resizeEditor);
  }, []);

  return (
    <div className="w-full h-full">
      <div
        ref={containerRef}
        className="w-full border rounded-md overflow-hidden"
        style={{ height: "calc(100% - 40px)" }}
      >
        <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
          <h2 className="text-sm font-bold">
            {themeConfig.displayName} Preview
          </h2>
        </div>
        <div className="h-full">
          <MonacoEditor
            theme={currentThemeName}
            onMount={handleEditorDidMount}
            language={
              MONACO_SHIKI_LANGS[language as keyof typeof MONACO_SHIKI_LANGS]
            }
            value={code}
            height="100%"
            options={{
              fontFamily: "Geist Mono",
              fontSize: 13,
              padding: { top: 16 },
              minimap: { enabled: false },
              automaticLayout: true,
              wordWrap: "on",
              readOnly: true,
              domReadOnly: true,
              formatOnType: true,
              lineDecorationsWidth: 1,
              lineNumbersMinChars: 4,
              tabSize: 2,
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};
