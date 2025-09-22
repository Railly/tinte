"use client";

import React, { useEffect, useMemo, useState } from "react";
import { codeTemplates, type VSCodeTheme } from "@/lib/providers/vscode";
import { useThemeContext } from "@/providers/theme";
import { MonacoLikeEditor } from "./monaco-like-editor";

interface VSCodePreviewProps {
  theme: { light: VSCodeTheme; dark: VSCodeTheme };
  className?: string;
}

export function VSCodePreview({ theme, className }: VSCodePreviewProps) {
  const { currentMode } = useThemeContext();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [themeVersion, setThemeVersion] = useState(0);
  const [currentThemeSet, setCurrentThemeSet] = useState(theme);

  useEffect(() => {
    setCurrentThemeSet(theme);
    setThemeVersion((prev) => {
      const newVersion = prev + 1;
      return newVersion;
    });
  }, [theme, currentMode]);

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
