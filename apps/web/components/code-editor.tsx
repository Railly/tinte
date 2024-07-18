import { useHighlighter } from "@/lib/hooks/use-highlighter";
import { useMonacoEditor } from "@/lib/hooks/use-monaco-editor";
import MonacoEditor from "@monaco-editor/react";
import React, { useRef, useEffect, useState } from "react";
import { editor } from "monaco-editor";
import { Button } from "./ui/button";
import { IconSave } from "./ui/icons";
import { MONACO_SHIKI_LANGS } from "@/lib/constants";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import { defaultThemeConfig } from "@/lib/core/config";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface CodeEditorProps {
  theme: any;
  code?: string;
  onCodeChange: (value: string | undefined) => void;
  language: string;
  themeConfig: ThemeConfig | DarkLightPalette;
  setColorPickerShouldBeHighlighted: React.Dispatch<
    React.SetStateAction<{
      key: string;
      value: boolean;
    }>
  >;
  onThemeSaved?: () => void;
  userId?: string;
}

export const CodeEditor = ({
  theme,
  code,
  onCodeChange,
  language,
  themeConfig,
  setColorPickerShouldBeHighlighted,
  onThemeSaved,
  userId,
}: CodeEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const codeRef = useRef<HTMLPreElement>(null);
  const { currentThemeName } = useMonacoEditor({
    theme,
    text: code,
    language,
    editorRef,
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

  const saveTheme = async () => {
    setIsSaving(true);
    try {
      let themeData: ThemeConfig;
      let isLocalTheme = false;

      if ("palette" in themeConfig) {
        themeData = themeConfig;
      } else {
        isLocalTheme = true;
        themeData = {
          ...defaultThemeConfig,
          name: currentThemeName,
          displayName: currentThemeName,
          palette: themeConfig,
        };
      }

      const response = await fetch("/api/themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...themeData,
          userId,
          isLocalTheme: isLocalTheme,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save theme");
      }

      const savedTheme = await response.json();
      toast.success("Theme saved successfully!: " + JSON.stringify(savedTheme));

      if (onThemeSaved) {
        onThemeSaved();
      }

      if (isLocalTheme) {
        // Save to localStorage
        const localThemes = JSON.parse(
          localStorage.getItem("customThemes") || "{}"
        );
        localThemes[themeData.name] = themeData.palette;
        localStorage.setItem("customThemes", JSON.stringify(localThemes));
      }
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Failed to save theme. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full border rounded-md overflow-hidden"
      style={{ height: "calc(80vh - 30px)" }}
    >
      <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
        <h2 className="text-sm font-bold">Preview Editor</h2>
        <Button variant="outline" onClick={saveTheme} disabled={isSaving}>
          <IconSave />
          <span className="ml-2">{isSaving ? "Saving..." : "Save Theme"}</span>
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
