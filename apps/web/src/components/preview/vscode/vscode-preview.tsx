"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { codeTemplates, type VSCodeTheme } from "@tinte/providers";
import { useThemeMode, useThemeOverrides } from "@/stores/hooks";

const MonacoLikeEditor = dynamic(
  () => import("./monaco-like-editor").then((mod) => mod.MonacoLikeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e1e] min-h-[400px]">
        <div className="animate-pulse text-sm text-[#6c6c6c]">Loading VSCode preview...</div>
      </div>
    ),
  }
);

interface VSCodePreviewProps {
  theme: { light: VSCodeTheme; dark: VSCodeTheme };
  className?: string;
}

export function VSCodePreview({ theme, className }: VSCodePreviewProps) {
  const { mode } = useThemeMode();
  const { vscodeOverride } = useThemeOverrides();
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
  }, [theme, mode, vscodeOverride]);

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
          currentMode={mode}
          template={currentTemplate}
          themeVersion={themeVersion}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
      </div>
    </div>
  );
}
