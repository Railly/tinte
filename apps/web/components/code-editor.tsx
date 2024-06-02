import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { useMonacoEditor } from "@/lib/hooks/use-monaco-editor";
import MonacoEditor from "@monaco-editor/react";
import { useRef } from "react";

interface CodeEditorProps {
  theme: any;
  code?: string;
  onCodeChange: (value: string | undefined) => void;
  language: string;
}

export const CodeEditor = ({
  theme,
  code,
  onCodeChange,
  language,
}: CodeEditorProps) => {
  const { highlightedText } = useHighlighter({
    theme,
    text: code,
    language,
  });
  const editorRef = useRef<any>(null);
  const { currentThemeName } = useMonacoEditor({ theme });

  return (
    <div className="w-full h-full grid grid-rows-2 gap-4 max-h-[80vh]">
      <pre
        className="size-full overflow-x-auto border [&>pre]:p-4 text-sm md:!w-full !text-[13px]"
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />
      <MonacoEditor
        className="!size-full border"
        theme={currentThemeName}
        onMount={(editor) => (editorRef.current = editor)}
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
