"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { codeTemplates, type VSCodeTheme } from "@/lib/providers/vscode";
import { useThemeContext } from "@/providers/theme";
import { MonacoLikePreview } from "./monaco-like-preview";

interface VSCodePreviewProps {
  theme: { light: VSCodeTheme; dark: VSCodeTheme };
  className?: string;
}

export function VSCodePreview({ theme, className }: VSCodePreviewProps) {
  const { currentMode } = useThemeContext();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [themeVersion, setThemeVersion] = useState(0);
  const [currentThemeSet, setCurrentThemeSet] = useState(theme);

  // Apply theme changes - use the theme prop directly since it's already converted
  useEffect(() => {
    console.log("VSCodePreview: Theme change detected", {
      currentMode,
      themeVersion,
      theme: {
        light: theme.light.name,
        dark: theme.dark.name,
      },
    });
    setCurrentThemeSet(theme);
    setThemeVersion((prev) => {
      const newVersion = prev + 1;
      console.log(
        "VSCodePreview: themeVersion updated",
        prev,
        "->",
        newVersion,
      );
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
        <MonacoLikePreview
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
