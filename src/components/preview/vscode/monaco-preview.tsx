'use client';

import React from 'react';
import { VSCodeTheme } from '@/lib/providers/vscode';
import Editor from '@monaco-editor/react';
import { useMonacoEditor } from '@/hooks/use-monaco-editor';
import { type CodeTemplate } from '@/lib/vscode-preview-utils';

interface MonacoPreviewProps {
  themeSet: { light: VSCodeTheme; dark: VSCodeTheme };
  currentMode: 'light' | 'dark';
  template: CodeTemplate;
  themeVersion: number;
}

export function MonacoPreview({ themeSet, currentMode, template, themeVersion }: MonacoPreviewProps) {
  const { isReady, isViewTransitioning, currentThemeName, handleEditorDidMount } = useMonacoEditor({
    themeSet,
    currentMode,
    template,
    themeVersion
  });

  if (!isReady) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-sm">Loading Monaco...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden relative">
      {isViewTransitioning && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted">
          <div className="text-sm text-muted-foreground">Applying theme...</div>
        </div>
      )}
      <Editor
        height="100%"
        width="100%"
        language={template.language}
        value={template.code}
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: 'on',
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 20,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'none',
          automaticLayout: false,
          wordWrap: 'on',
          wordWrapColumn: 50,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'hidden',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
        theme={currentThemeName}
      />
    </div>
  );
}