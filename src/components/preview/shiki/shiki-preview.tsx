"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShikiCssHighlighter } from "@/hooks/use-shiki-css-highlighter";
import type { ShikiTheme } from "@/types/shiki";
import { useThemeContext } from "@/providers/theme";

interface CodeTemplate {
  name: string;
  filename: string;
  language: string;
  code: string;
}

const codeTemplates: CodeTemplate[] = [
  {
    name: "Transformers Demo",
    filename: "transformers.ts",
    language: "typescript",
    code: `// [!code word:transformer:3] - Highlight "transformer" on next 3 lines
import { transformerNotationDiff } from '@shikijs/transformers';
import { codeToHtml } from 'shiki';

// Basic transformer usage
const oldFunction = () => console.log('old'); // [!code --]
const newFunction = () => console.log('new'); // [!code ++]

// [!code highlight:2]
const highlighted = true;
const alsoHighlighted = 'yes';

export function createHighlighter() { // [!code focus]
  const options = {
    themes: ['nord'],
    transformers: [
      transformerNotationDiff(), // Error in old version // [!code error]
      transformerNotationHighlight(), // Fixed! // [!code warning]
    ]
  };

  return codeToHtml(code, options); // [!code highlight]
}`,
  },
  {
    name: "JavaScript",
    filename: "example.js",
    language: "javascript",
    code: `// Theme preview with JavaScript
import { createTheme } from 'shiki/core';
import { createCssVariablesTheme } from 'shiki/core';

const theme = createCssVariablesTheme({
  name: 'tinte-css-theme',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true
});

export async function highlightCode(code, lang) {
  const highlighter = await createHighlighter({
    themes: [theme],
    langs: [lang]
  });

  return highlighter.codeToHtml(code, {
    lang,
    theme: 'tinte-css-theme'
  });
}`,
  },
  {
    name: "TypeScript",
    filename: "theme.ts",
    language: "typescript",
    code: `// TypeScript theme interface
interface ShikiCssTheme {
  name: string;
  variables: Record<string, string>;
}

interface ThemeConfig {
  light: ShikiCssTheme;
  dark: ShikiCssTheme;
}

class ThemeManager {
  private currentTheme: ShikiCssTheme;

  constructor(private config: ThemeConfig) {
    this.currentTheme = config.light;
  }

  switchMode(mode: 'light' | 'dark'): void {
    this.currentTheme = this.config[mode];
    this.applyVariables();
  }

  private applyVariables(): void {
    Object.entries(this.currentTheme.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
}`,
  },
  {
    name: "React JSX",
    filename: "component.tsx",
    language: "tsx",
    code: `import React from 'react';

interface ShikiPreviewProps {
  theme: { light: ShikiTheme; dark: ShikiTheme };
  className?: string;
}

export function ShikiPreview({ theme, className }: ShikiPreviewProps) {
  const { currentMode } = useThemeContext();
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const cssVariables = useMemo(() => {
    const currentTheme = theme[currentMode];
    return Object.entries(currentTheme.variables)
      .map(([key, value]) => \`\${key}: \${value};\`)
      .join('\\n');
  }, [theme, currentMode]);

  return (
    <div className={className}>
      <style>{\`:root { \${cssVariables} }\`}</style>
      <pre className="shiki-css-container">
        <code>{/* Highlighted code goes here */}</code>
      </pre>
    </div>
  );
}`,
  },
];

interface ShikiPreviewProps {
  theme: { light: ShikiTheme; dark: ShikiTheme };
  className?: string;
}

export function ShikiPreview({ theme, className }: ShikiPreviewProps) {
  const { currentMode } = useThemeContext();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [themeVersion, setThemeVersion] = useState(0);
  const [currentThemeSet, setCurrentThemeSet] = useState(theme);

  // Apply theme changes
  useEffect(() => {
    setCurrentThemeSet(theme);
    setThemeVersion((prev) => prev + 1);
  }, [theme]);

  const template = codeTemplates[selectedTemplate];

  const { html, loading, cssVariables } = useShikiCssHighlighter({
    themeSet: currentThemeSet,
    currentMode,
    template,
    themeVersion,
  });

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted backdrop-blur-sm text-muted-foreground">
        <div className="text-sm">Loading Shiki CSS...</div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${className || ""}`}>
      {/* Controls */}
      <div className="p-4 border-b bg-background">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              CSS Variables Theme
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {template.language}
            </Badge>
          </div>

          <Select
            value={selectedTemplate.toString()}
            onValueChange={(value) => setSelectedTemplate(parseInt(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
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

      {/* Preview */}
      <div className="flex-1 overflow-hidden relative">
        <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
        <div
          className="h-full overflow-auto text-sm scrollbar-thin !font-mono !text-[13px] !leading-[1.53] !break-words shiki-css-container"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}