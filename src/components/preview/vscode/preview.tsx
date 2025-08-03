'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { VSCodeTheme } from '@/lib/providers/vscode';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useThemeContext } from '@/providers/theme';
import { codeTemplates, convertThemeToVSCode } from '@/lib/vscode-preview-utils';
import { MonacoPreview } from './monaco-preview';
import { ShikiPreview } from './shiki-preview';
import { TokensPreview } from './tokens-preview';

interface VSCodePreviewProps {
  theme: { light: VSCodeTheme; dark: VSCodeTheme };
  className?: string;
}

export function VSCodePreview({ theme, className }: VSCodePreviewProps) {
  const { activeTheme, currentMode } = useThemeContext();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'monaco' | 'shiki' | 'tokens'>('split');

  // Set default view mode based on screen size - monaco for mobile, split for desktop
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768 && viewMode === 'split') {
          setViewMode('monaco');
        }
      }
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);
  const [themeVersion, setThemeVersion] = useState(0);
  const [currentThemeSet, setCurrentThemeSet] = useState(theme);

  // Memoize theme conversion using utility function
  const convertedTheme = useMemo(() =>
    convertThemeToVSCode(activeTheme, theme),
    [activeTheme, theme]
  );

  // Apply theme changes - trigger on theme ID and mode changes
  useEffect(() => {
    console.log('VSCodePreview: Theme change detected', {
      activeThemeId: activeTheme?.id,
      currentMode,
      themeVersion,
      convertedTheme: {
        light: convertedTheme.light.name,
        dark: convertedTheme.dark.name
      }
    });
    setCurrentThemeSet(convertedTheme);
    setThemeVersion(prev => {
      const newVersion = prev + 1;
      console.log('VSCodePreview: themeVersion updated', prev, '->', newVersion);
      return newVersion;
    });
  }, [activeTheme?.id || 'default', currentMode]);

  const currentTheme = currentMode === 'dark' ? currentThemeSet.dark : currentThemeSet.light;
  const currentTemplate = useMemo(() => codeTemplates[selectedTemplate], [selectedTemplate]);

  // Get abbreviated name for mobile
  const getShortName = (name: string) => {
    const abbrevMap: Record<string, string> = {
      'Python': 'Py',
      'JavaScript': 'JS',
      'TypeScript': 'TS',
      'Go': 'Go',
      'Rust': 'Rs',
      'Java': 'Java'
    };
    return abbrevMap[name] || name.slice(0, 2);
  };


  return (
    <div
      className={`rounded-lg border overflow-hidden font-mono text-sm flex flex-col h-full bg-background text-foreground ${className || ''}`}
    >
      {/* Title bar */}
      <div
        className="px-2 md:px-4 py-2 border-b flex items-center gap-2 bg-muted/50"
      >
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs ml-1 md:ml-2 truncate hidden md:block">{currentTemplate.filename}</div>

        <div className="md:ml-auto flex items-center gap-1 md:gap-2">
          {/* View Mode Selector - Desktop */}
          <div className="hidden md:block">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="split" className="text-xs">
                  Split
                </TabsTrigger>
                <TabsTrigger value="monaco" className="text-xs">
                  Monaco
                </TabsTrigger>
                <TabsTrigger value="shiki" className="text-xs">
                  Shiki
                </TabsTrigger>
                <TabsTrigger value="tokens" className="text-xs">
                  Tokens
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* View Mode Selector - Mobile (no Split) */}
          <div className="md:hidden">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="monaco" className="text-xs">
                  Monaco
                </TabsTrigger>
                <TabsTrigger value="shiki" className="text-xs">
                  Shiki
                </TabsTrigger>
                <TabsTrigger value="tokens" className="text-xs">
                  Tokens
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Language Selector */}
          <Select value={selectedTemplate.toString()} onValueChange={(value) => setSelectedTemplate(parseInt(value))}>
            <SelectTrigger className="flex-1 md:w-32 h-6 text-xs border bg-muted/30 md:border-none md:bg-transparent px-1 md:px-2 min-w-0">
              <div className="md:hidden font-mono text-[10px] truncate">
                {getShortName(currentTemplate.name)}
              </div>
              <div className="hidden md:block">
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {codeTemplates.map((template, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {viewMode === 'split' && (
          <div className="flex flex-1 overflow-hidden">
            {/* Monaco Editor */}
            <div className="w-1/2 max-w-[50%] border-r border-border/50 flex flex-col overflow-hidden">
              <div
                className="px-2 py-1 border-b border-border/50 flex items-center gap-2 flex-shrink-0 bg-muted/30"
              >
                <Badge variant="secondary" className="text-xs">Monaco Editor</Badge>
              </div>
              <div className="flex-1 overflow-hidden w-full max-w-full">
                <MonacoPreview
                  themeSet={currentThemeSet}
                  currentMode={currentMode}
                  template={currentTemplate}
                  themeVersion={themeVersion}
                />
              </div>
            </div>

            {/* Shiki */}
            <div className="w-1/2 flex flex-col overflow-hidden">
              <div
                className="px-2 py-1 border-b border-border/50 flex items-center gap-2 flex-shrink-0 bg-muted/30"
              >
                <Badge variant="secondary" className="text-xs">Shiki</Badge>
              </div>
              <div className="flex-1 overflow-hidden">
                <ShikiPreview
                  themeSet={currentThemeSet}
                  currentMode={currentMode}
                  template={currentTemplate}
                  themeVersion={themeVersion}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'monaco' && (
          <div className="flex-1 overflow-hidden">
            <MonacoPreview
              themeSet={currentThemeSet}
              currentMode={currentMode}
              template={currentTemplate}
              themeVersion={themeVersion}
            />
          </div>
        )}

        {viewMode === 'shiki' && (
          <div className="flex-1 overflow-hidden">
            <ShikiPreview
              themeSet={currentThemeSet}
              currentMode={currentMode}
              template={currentTemplate}
              themeVersion={themeVersion}
            />
          </div>
        )}

        {viewMode === 'tokens' && (
          <div className="flex-1 overflow-auto">
            <TokensPreview
              theme={currentTheme}
              mode={currentMode}
            />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div
        className="px-4 py-1 text-xs flex items-center justify-between flex-shrink-0 bg-muted/50 text-muted-foreground border-t border-border"
      >
        <div>{currentTemplate.name} • {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View</div>
        <div>Ln 1, Col 1</div>
      </div>
    </div>
  );
}