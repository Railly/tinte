'use client';

import React from 'react';
import { VSCodeTheme } from '@/lib/providers/vscode';
import { useShikiHighlighter } from '@/hooks/use-shiki-highlighter';
import { CodeTemplate } from '@/lib/providers/vscode';

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

  // Only show loading on initial load - theme changes are instant
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted backdrop-blur-sm text-muted-foreground">
        <div className="text-sm">Loading Shiki...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden relative">
      {/* Subtle theme transition - no blocking overlay */}
      <div
        className={`h-full overflow-auto text-sm scrollbar-thin bg-background text-foreground !font-mono !text-[13px] !leading-[1.53] !break-words transition-opacity duration-100 ${
          isViewTransitioning ? 'opacity-90' : 'opacity-100'
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}