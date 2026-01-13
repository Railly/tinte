"use client";

import { useEffect, useMemo, useState } from "react";
import { codeTemplates, type VSCodeTheme } from "@/lib/providers/vscode";
import { useThemeContext } from "@/providers/theme";
import { MonacoLikeEditor } from "./monaco-like-editor";

interface VSCodePreviewProps {
  theme: { light: VSCodeTheme; dark: VSCodeTheme };
  className?: string;
}

export function VSCodePreview({ theme, className }: VSCodePreviewProps) {
  const { currentMode, vscodeOverride } = useThemeContext();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [themeVersion, setThemeVersion] = useState(0);
  const [currentThemeSet, setCurrentThemeSet] = useState(theme);

  useEffect(() => {
    // Merge VSCode overrides with base theme
    // VSCode overrides have structure: { light: {...}, dark: {...} }
    const mergedTheme = {
      light: {
        ...theme.light,
        colors: {
          ...theme.light.colors,
          ...((vscodeOverride as any)?.light || {}),
        },
      },
      dark: {
        ...theme.dark,
        colors: {
          ...theme.dark.colors,
          ...((vscodeOverride as any)?.dark || {}),
        },
      },
    };
    setCurrentThemeSet(mergedTheme);
    setThemeVersion((prev) => prev + 1);
  }, [theme, currentMode, vscodeOverride]);

  const currentTemplate = useMemo(
    () => codeTemplates[selectedTemplate],
    [selectedTemplate],
  );

  return (
    <div
      className={`rounded-lg border overflow-hidden font-mono text-sm flex flex-col h-full bg-background text-foreground ${className || ""}`}
    >
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <MonacoLikeEditor
          themeSet={currentThemeSet}
          currentMode={currentMode}
          template={currentTemplate}
          themeVersion={themeVersion}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
      </div>
    </div>
  );
}
