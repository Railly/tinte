import React, {
  useRef,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { GeneratedVSCodeTheme } from "@/lib/core";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import { useMonacoEditor } from "@/lib/hooks/use-monaco-editor";
import MonacoEditor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Button } from "./ui/button";
import { IconCopy, IconLoading, IconSave } from "./ui/icons";
import { MONACO_SHIKI_LANGS } from "@/lib/constants";
import { useThemeGenerator } from "@/lib/hooks/use-theme-generator";
import { CreateThemeDialog } from "./create-theme-dialog";
import { useRouter } from "next/navigation";

interface PreviewProps {
  vsCodeTheme: GeneratedVSCodeTheme;
  code?: string;
  onCodeChange: (value: string | undefined) => void;
  setColorPickerShouldBeHighlighted: React.Dispatch<
    React.SetStateAction<{
      key: string;
      value: boolean;
    }>
  >;
  language: string;
  themeConfig: ThemeConfig;
  isSaving?: boolean;
  themes: ThemeConfig[];
  applyTheme: (themeName: string) => void;
  setIsColorModified: Dispatch<SetStateAction<boolean>>;
  onSelectTheme: (themeName: string, palette?: DarkLightPalette) => void;
}

export const PreviewEditor = ({
  vsCodeTheme,
  onCodeChange,
  code,
  setColorPickerShouldBeHighlighted,
  language,
  themeConfig,
  applyTheme,
  themes,
  setIsColorModified,
  onSelectTheme,
}: PreviewProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const { currentThemeName } = useMonacoEditor({
    vsCodeTheme,
    text: code,
    language,
    editorRef,
  });
  const { updateTheme, isSaving, isUpdating } = useThemeGenerator();
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    await updateTheme(themeConfig);
    setIsColorModified(false);
    router.refresh();
  };

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
    resizeEditor();

    return () => window.removeEventListener("resize", resizeEditor);
  }, []);

  return (
    <div className="flex gap-4 w-full h-full">
      <div
        ref={containerRef}
        className="w-full border rounded-md overflow-hidden"
        style={{ height: "calc(80vh - 30px)" }}
      >
        <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
          <h2 className="text-sm font-bold">Preview Editor</h2>
          {themeConfig.category === "user" && (
            <Button
              variant="outline"
              onClick={handleUpdate}
              disabled={isUpdating}
              className="ml-2"
            >
              {isUpdating ? (
                <>
                  <IconLoading className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <IconSave className="w-4 h-4 mr-2" />
                  Update
                </>
              )}
            </Button>
          )}
          {themeConfig.category !== "user" && (
            <Button
              variant="outline"
              onClick={() => setIsCopyDialogOpen(true)}
              disabled={isSaving}
              className="ml-2"
            >
              {isSaving ? (
                <>
                  <IconLoading className="w-4 h-4 mr-2 animate-spin" />
                  Copying...
                </>
              ) : (
                <>
                  <IconCopy className="w-4 h-4 mr-2" />
                  Make a Copy
                </>
              )}
            </Button>
          )}
        </div>
        <div className="flex-grow !h-[70vh]" style={{ height: "70vh" }}>
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
        <CreateThemeDialog
          title="Make a Copy"
          description="Create a copy of this theme by providing a new name"
          saveButtonContent={
            <>
              <IconCopy className="w-4 h-4 mr-2" />
              Create Copy
            </>
          }
          loadingButtonText="Copying..."
          isOpen={isCopyDialogOpen}
          onClose={() => setIsCopyDialogOpen(false)}
          onSelectTheme={onSelectTheme}
          themeConfig={themeConfig}
          themes={themes}
          applyTheme={applyTheme}
        />
      </div>
    </div>
  );
};
