"use client";

import { useEffect, useState } from "react";
import {
  GolangIcon,
  JavascriptIcon,
  PythonIcon,
  TypescriptIcon,
} from "@/components/shared/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShikiCssHighlighter } from "@/components/workbench/hooks/editor/use-shiki-css";
import { useThemeMode } from "@/stores/hooks";
import type { ShikiTheme } from "@/types/shiki";
import { codeTemplates } from "./shiki-code-templates";

interface ShikiPreviewProps {
  theme: ShikiTheme;
  className?: string;
}

export function ShikiPreview({ theme, className }: ShikiPreviewProps) {
  const getLanguageIcon = (language: string, className: string) => {
    switch (language) {
      case "javascript":
        return <JavascriptIcon className={className} />;
      case "typescript":
      case "tsx":
        return <TypescriptIcon className={className} />;
      case "python":
        return <PythonIcon className={className} />;
      case "go":
        return <GolangIcon className={className} />;
      default:
        return (
          <svg className={className} viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z" />
          </svg>
        );
    }
  };

  const { mode } = useThemeMode();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [themeVersion, setThemeVersion] = useState(0);
  const [currentThemeSet, setCurrentThemeSet] = useState(theme);

  useEffect(() => {
    setCurrentThemeSet(theme);
    setThemeVersion((prev) => prev + 1);
  }, [theme]);

  const template = codeTemplates[selectedTemplate];

  const { html, loading, cssVariables } = useShikiCssHighlighter({
    themeSet: { light: currentThemeSet.light, dark: currentThemeSet.dark },
    currentMode: mode,
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
    <div className={`h-full flex flex-col ${className || ""} relative`}>
      {/* Preview */}
      <div className="flex-1 overflow-hidden relative">
        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-10">
          <Select
            value={selectedTemplate.toString()}
            onValueChange={(value) => setSelectedTemplate(parseInt(value))}
          >
            <SelectTrigger className="w-[200px] flex items-center gap-2 bg-background/95 backdrop-blur-sm border shadow-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {codeTemplates.map((template, index) => (
                <SelectItem key={index} value={index.toString()}>
                  <div className="flex items-center gap-2">
                    {getLanguageIcon(template.language, "w-4 h-4")}
                    <span>{template.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            ${cssVariables}

            .shiki-css-container code {
              counter-reset: step;
              counter-increment: step 0;
            }

            .shiki-css-container code .line::before {
              content: counter(step);
              counter-increment: step;
              width: 2.5rem;
              margin-right: 1rem;
              display: inline-block;
              text-align: right;
              color: hsl(var(--muted-foreground));
              opacity: 0.6;
              font-variant-numeric: tabular-nums;
              user-select: none;
            }

            .shiki-css-container code .line:last-child:empty::before {
              content: none;
              counter-increment: none;
            }
          `,
          }}
        />
        <ScrollArea
          className="h-full"
          showScrollIndicators={true}
          indicatorType="shadow"
        >
          <div
            className="text-sm !font-mono !text-[13px] !leading-[1.53] !break-words shiki-css-container"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </ScrollArea>
      </div>
    </div>
  );
}
