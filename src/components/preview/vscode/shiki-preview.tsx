'use client';

import React from 'react';
import { VSCodeTheme } from '@/lib/providers/vscode';
import { useShikiHighlighter } from '@/hooks/use-shiki-highlighter';
import { type CodeTemplate } from '@/lib/vscode-preview-utils';

interface ShikiPreviewProps {
  themeSet: { light: VSCodeTheme; dark: VSCodeTheme };
  currentMode: 'light' | 'dark';
  template: CodeTemplate;
  themeVersion: number;
}

export function ShikiPreview({ themeSet, currentMode, template, themeVersion }: ShikiPreviewProps) {
  const { html, loading, isViewTransitioning } = useShikiHighlighter({
    themeSet,
    currentMode,
    template,
    themeVersion
  });

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted backdrop-blur-sm text-muted-foreground">
        <div className="text-sm">Loading Shiki...</div>
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
      <div
        className="h-full overflow-auto text-sm leading-relaxed scrollbar-thin bg-background text-foreground"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}