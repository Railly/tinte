"use client";

import { Image, Palette, Wand2, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BananaIcon } from "@/components/shared/icons/banana";

// Wrapper to make BananaIcon compatible with AIChat's expected interface
const BananaIconWrapper = ({ size }: { size: number }) => (
  <div style={{ width: size, height: size }}>
    <BananaIcon className="w-full h-full" />
  </div>
);

import { AIChat } from "@/components/ui/ai-chat";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib";
import type { BananaTheme } from "@/lib/providers/banana";
import { useThemeContext } from "@/providers/theme";

interface BananaChatProps {
  theme: { light: BananaTheme; dark: BananaTheme };
  className?: string;
}

export function BananaChat({ theme, className }: BananaChatProps) {
  const { currentMode } = useThemeContext();
  const currentTheme = currentMode === "dark" ? theme.dark : theme.light;
  const _previousThemeRef = useRef<BananaTheme | null>(null);

  // Create theme context message for AI
  const createThemeContext = (theme: BananaTheme, mode: "light" | "dark") => {
    return `Current brand theme (${mode} mode):
- Primary Brand: ${theme.primaryBrand}
- Secondary Brand: ${theme.secondaryBrand} 
- Accent Color: ${theme.accentColor}
- Background: ${theme.backgroundColor}
- Surface: ${theme.surfaceColor}
- Text (Heading): ${theme.headingColor}
- Text (Body): ${theme.bodyColor}
- Success: ${theme.successColor}
- Warning: ${theme.warningColor}
- CTA Color: ${theme.ctaColor}
- Link Color: ${theme.linkColor}
- Highlight: ${theme.highlightColor}

Use these exact colors when generating any visual assets or brand materials.`;
  };

  const brandColors = {
    primary: currentTheme.primaryBrand,
    secondary: currentTheme.secondaryBrand,
    accent: currentTheme.accentColor,
    background: currentTheme.backgroundColor,
    surface: currentTheme.surfaceColor,
    border: currentTheme.borderColor,
    heading: currentTheme.headingColor,
    body: currentTheme.bodyColor,
    muted: currentTheme.mutedColor,
    success: currentTheme.successColor,
    warning: currentTheme.warningColor,
    error: currentTheme.errorColor,
    cta: currentTheme.ctaColor,
    link: currentTheme.linkColor,
    highlight: currentTheme.highlightColor,
  };

  const quickPrompts = [
    "Create a hero banner for my brand",
    "Design a social media kit",
    "Make a professional logo concept",
    "Generate marketing materials",
  ];

  // System prompt with initial theme context
  const systemPrompt = createThemeContext(currentTheme, currentMode);

  // Custom content renderer for Banana chat
  const renderBananaContent = (message: any) => {
    return (
      <div className="w-full max-w-2xl space-y-3">
        {message.parts.map((part: any, index: number) => {
          if (part.type === "text") {
            return (
              <Markdown
                key={index}
                className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border"
              >
                {part.text}
              </Markdown>
            );
          } else if (
            part.type === "file" &&
            part.mediaType?.startsWith("image/")
          ) {
            return (
              <div key={index} className="mt-4">
                <div
                  className="rounded-lg border overflow-hidden"
                  style={{ borderColor: brandColors.border }}
                >
                  <img
                    src={part.url}
                    alt="Generated design asset"
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ✨ Generated using your brand colors
                </p>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "rounded-lg border overflow-hidden h-full flex flex-col",
        className,
      )}
      style={{
        backgroundColor: brandColors.background,
        borderColor: brandColors.border,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0"
        style={{
          backgroundColor: brandColors.surface,
          borderBottomColor: brandColors.border,
          color: brandColors.heading,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: brandColors.primary }}
            >
              <BananaIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">Nano Banana</div>
              <div className="text-xs opacity-60">AI Creative Partner</div>
            </div>
          </div>
        </div>
        <div className="text-xs px-2 py-1 rounded-full opacity-60">
          {currentMode} mode
        </div>
      </div>

      {/* Chat Content */}
      <AIChat
        apiEndpoint="/api/banana"
        placeholder="Describe the asset you want to create..."
        suggestions={quickPrompts}
        emptyStateTitle="Ready to create amazing assets!"
        emptyStateDescription="Tell me about your brand and I'll generate stunning visuals"
        emptyStateIcon={BananaIconWrapper}
        assistantIcon={BananaIconWrapper}
        renderContent={renderBananaContent}
        includeImages={true}
        systemPrompt={systemPrompt}
        className="flex-1 min-h-0"
      />
    </div>
  );
}
