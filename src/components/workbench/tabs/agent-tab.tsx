"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useThemeContext } from "@/providers/theme";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";
import { Message, MessageContent } from "@/components/ui/message";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  Copy,
  Palette,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { ChatInput } from "@/components/workbench/chat-input";
import type { PastedItem } from "@/lib/input-detection";
import type { ThemeData } from "@/lib/theme-tokens";
import { ThemeColorPreview } from "@/components/shared/theme-color-preview";
import { extractThemeColors } from "@/lib/theme-utils";
import { loadGoogleFont } from "@/utils/fonts";

const suggestions = [
  "Ocean sunset theme with warm oranges and cool blues",
  "Dark cyberpunk theme with neon accents",
  "Forest morning theme with natural greens",
  "Minimalist theme with subtle grays",
];

// Font preview component that loads fonts on mount
function FontPreview({ fonts }: { fonts: { sans: string; serif: string; mono: string } }) {
  useEffect(() => {
    if (fonts) {
      try {
        // Load fonts for preview
        loadGoogleFont(fonts.sans, ["400"]);
        loadGoogleFont(fonts.serif, ["400"]);
        loadGoogleFont(fonts.mono, ["400"]);
      } catch (error) {
        console.warn("Failed to load preview fonts:", error);
      }
    }
  }, [fonts]);

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-muted-foreground">Typography</span>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Sans</span>
          <span
            className="font-medium truncate"
            style={{ fontFamily: `"${fonts.sans}", sans-serif` }}
          >
            {fonts.sans}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Serif</span>
          <span
            className="font-medium truncate"
            style={{ fontFamily: `"${fonts.serif}", serif` }}
          >
            {fonts.serif}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Mono</span>
          <span
            className="font-medium truncate"
            style={{ fontFamily: `"${fonts.mono}", monospace` }}
          >
            {fonts.mono}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AgentTab() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate-theme",
    }),
  });
  console.log({ messages })

  const { addTheme, handleThemeSelect, currentMode } = useThemeContext();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    colors: false,
    typography: false,
    radius: false,
    shadows: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApplyTheme = useCallback(async (toolResult: any) => {
    if (!toolResult?.theme) return;

    // Load Google Fonts if they were generated
    if (toolResult.fonts) {
      try {
        // Load all three font families with common weights
        // These run synchronously but won't block the theme application
        loadGoogleFont(toolResult.fonts.sans, ["300", "400", "500", "600", "700"]);
        loadGoogleFont(toolResult.fonts.serif, ["300", "400", "500", "600", "700"]);
        loadGoogleFont(toolResult.fonts.mono, ["300", "400", "500", "600", "700"]);
      } catch (error) {
        console.warn("Failed to load fonts:", error);
      }
    }

    // Create extended theme data with fonts, radius, and shadows
    const extendedRawTheme = {
      light: toolResult.theme.light,
      dark: toolResult.theme.dark,
      // Add the extended properties
      fonts: toolResult.fonts,
      radius: toolResult.radius,
      shadows: toolResult.shadows,
    };

    const themeData: ThemeData = {
      id: `ai-generated-${Date.now()}`,
      name: toolResult.title || "AI Generated Theme",
      description: `AI-generated theme: ${toolResult.concept || "Custom theme"}`,
      author: "AI Assistant",
      provider: "tinte",
      downloads: 0,
      likes: 0,
      views: 1,
      createdAt: new Date().toISOString(),
      colors: {
        primary: toolResult.theme.light.pr,
        secondary: toolResult.theme.light.sc,
        accent: toolResult.theme.light.ac_1,
        background: toolResult.theme.light.bg,
        foreground: toolResult.theme.light.tx,
      },
      tags: ["ai-generated", "custom"],
      rawTheme: extendedRawTheme,
    };

    addTheme(themeData);
    handleThemeSelect(themeData);

    // Force DOM update for CSS variables (helps with shadow cache issues)
    setTimeout(() => {
      if (document.documentElement) {
        document.documentElement.style.setProperty('--force-update', Date.now().toString());
        // Remove it immediately to trigger a repaint
        requestAnimationFrame(() => {
          document.documentElement.style.removeProperty('--force-update');
        });
      }
    }, 100);
  }, [addTheme, handleThemeSelect]);


  const handleSubmit = useCallback((content: string, attachments: PastedItem[]) => {
    if (!content.trim() && attachments.length === 0) return;

    // Convert PastedItems to AI SDK files format
    const files: any[] = [];
    attachments.forEach((item) => {
      if (item.kind === 'image' && item.imageData) {
        // Detect media type from data URL
        const mediaType = item.imageData.startsWith('data:image/')
          ? item.imageData.substring(5, item.imageData.indexOf(';'))
          : 'image/png';

        files.push({
          type: 'file',
          mediaType,
          url: item.imageData,
          filename: item.content || `image.${mediaType.split('/')[1]}`
        });
      }
    });

    sendMessage({
      text: content,
      files: files.length > 0 ? files : undefined
    });
  }, [sendMessage]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSubmit(suggestion, []);
  }, [handleSubmit]);

  // Check if there's an active tool
  const hasActiveTool = useMemo(() => {
    return messages.some(message =>
      message.parts.some(part =>
        part.type === "tool-generateTheme" &&
        (part.state === "input-available" || part.state === "input-streaming")
      )
    );
  }, [messages]);

  // Simple loading check - but not if there's an active tool
  const isLoading = useMemo(() => {
    return (status === "submitted" || status === "streaming") && !hasActiveTool;
  }, [status, hasActiveTool]);

  // Timer that persists throughout the entire generation process
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completedTime, setCompletedTime] = useState<number | null>(null);

  // Messages that alternate during tool execution
  const toolMessages = [
    "Finalizing your theme...",
    "Crafting color harmony...",
    "Generating light mode...",
    "Creating dark variant...",
    "Perfecting contrasts...",
    "Almost ready..."
  ];

  // Get current tool message based on timer
  const currentToolMessage = useMemo(() => {
    const messageIndex = Math.floor(loadingTimer / 2) % toolMessages.length;
    return toolMessages[messageIndex];
  }, [loadingTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const isAnyLoading = isLoading || hasActiveTool;

    if (isAnyLoading && !startTime) {
      // Start timing only if we haven't started yet
      setStartTime(Date.now());
      setLoadingTimer(0);
      setCompletedTime(null); // Reset completed time when starting new generation
    }

    if (isAnyLoading) {
      interval = setInterval(() => {
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          setLoadingTimer(elapsed);
        }
      }, 1000);
    } else if (startTime && !completedTime) {
      // Capture the final time when generation completes
      const finalTime = Math.floor((Date.now() - startTime) / 1000);
      setCompletedTime(finalTime);
      setLoadingTimer(finalTime);
      // Don't reset the timer, just clear the start time
      setStartTime(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, hasActiveTool, startTime, completedTime]);

  // Memoize chat input disabled state
  const isChatDisabled = useMemo(() => {
    return status !== "ready" && status !== "error";
  }, [status]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea
        className="flex-1 min-h-0 px-4"
      >
        <ChatContainerRoot className="relative space-y-0">
          <ChatContainerContent className="space-y-4 pb-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <Palette className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-lg font-medium text-foreground mb-2">
                  AI Theme Generator
                </h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                  Describe your ideal theme or upload an image
                </p>

                <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-3 text-left rounded-lg border border-border/40 hover:border-border hover:bg-accent/20 transition-all duration-200 group text-sm text-muted-foreground hover:text-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              // Skip messages with no content or only step-start
              const hasContent = message.parts.some(part =>
                (part.type === "text" && part.text.trim()) ||
                (part.type.startsWith("tool-") && part.type !== "step-start")
              );

              if (!hasContent) return null;

              return (
                <Message
                  key={message.id}
                  className={cn(
                    "flex w-full max-w-3xl flex-col gap-2 px-2",
                    message.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  {message.role === "user" ? (
                    <div className="group flex w-full flex-col items-end gap-1">
                      <MessageContent className="bg-card border max-w-full rounded-sm px-5 py-2.5 whitespace-normal">
                        {message.parts
                          .filter(part => part.type === "text")
                          .map(part => part.type === "text" ? part.text : "")
                          .join("")}
                      </MessageContent>
                    </div>
                  ) : (
                    <div className="group flex w-full flex-col gap-3">
                      {/* Text content - Regular chat text */}
                      {message.parts.some(part => part.type === "text") && (
                        <div className="w-full max-w-2xl">
                          <MessageContent className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                            {message.parts
                              .filter(part => part.type === "text")
                              .map(part => part.type === "text" ? part.text : "")
                              .join("")}
                          </MessageContent>
                        </div>
                      )}

                      {/* Tool calls - Enhanced with better state handling */}
                      {message.parts
                        .filter(part => part.type === "tool-generateTheme")
                        .map((part, index) => {
                          if (part.type !== "tool-generateTheme") return null;

                          switch (part.state) {
                            case 'input-available':
                            case 'input-streaming':
                              return (
                                <div key={index} className="flex items-center justify-between py-4 w-full max-w-md">
                                  <span className="text-sm text-muted-foreground animate-pulse">
                                    {currentToolMessage}
                                  </span>
                                  <span className="text-xs text-muted-foreground/60">
                                    {loadingTimer}s
                                  </span>
                                </div>
                              );
                            case 'output-available':
                              const themeOutput = part.output as any;
                              return (
                                <div key={index} className="w-full max-w-2xl space-y-4">
                                  {/* Header with status */}
                                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span>Crafted in {loadingTimer}s ✨</span>
                                  </div>

                                  {/* Main theme card */}
                                  <div className="space-y-4 border border-border/50 rounded-lg overflow-hidden bg-card/50">
                                    {/* Header */}
                                    <div className="px-4 pt-4 space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Palette className="h-4 w-4 text-primary" />
                                        <h4 className="font-semibold text-sm">
                                          {themeOutput.title || "Custom Theme"}
                                        </h4>
                                      </div>
                                      {themeOutput.concept && (
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                          {themeOutput.concept}
                                        </p>
                                      )}
                                    </div>

                                    {/* Collapsible sections */}
                                    <div className="space-y-0">
                                      {/* Colors Section */}
                                      {themeOutput.theme && (
                                        <Collapsible
                                          open={openSections.colors}
                                          onOpenChange={() => toggleSection('colors')}
                                        >
                                          <CollapsibleTrigger
                                            className={`flex w-full items-center justify-between px-4 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors border-t border-border/30`}
                                          >
                                            <span className="uppercase">Colors</span>
                                            <div className="flex items-center gap-2">
                                              <ThemeColorPreview
                                                colors={extractThemeColors({
                                                  rawTheme: {
                                                    light: themeOutput.theme.light,
                                                    dark: themeOutput.theme.dark
                                                  }
                                                } as any, currentMode)}
                                                size="sm"
                                                maxColors={6}
                                              />
                                              <ChevronDown
                                                className={`h-4 w-4 transition-transform ${openSections.colors ? "rotate-180" : ""}`}
                                              />
                                            </div>
                                          </CollapsibleTrigger>
                                          <CollapsibleContent className="bg-muted/20 border-t border-border/30">
                                            <div className="p-4 space-y-3">
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <span className="text-xs font-medium text-muted-foreground mb-2 block">Light Mode</span>
                                                  <ThemeColorPreview
                                                    colors={themeOutput.theme.light || {}}
                                                    size="md"
                                                    maxColors={8}
                                                    className="justify-start"
                                                  />
                                                </div>
                                                <div>
                                                  <span className="text-xs font-medium text-muted-foreground mb-2 block">Dark Mode</span>
                                                  <ThemeColorPreview
                                                    colors={themeOutput.theme.dark || {}}
                                                    size="md"
                                                    maxColors={8}
                                                    className="justify-start"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      )}

                                      {/* Typography Section */}
                                      {themeOutput.fonts && (
                                        <Collapsible
                                          open={openSections.typography}
                                          onOpenChange={() => toggleSection('typography')}
                                        >
                                          <CollapsibleTrigger
                                            className={`flex w-full items-center justify-between px-4 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors border-t border-border/30`}
                                          >
                                            <span className="uppercase">Typography</span>
                                            <div className="flex items-center gap-2">
                                              <div className="flex gap-1 text-[10px] text-muted-foreground">
                                                <span className="truncate max-w-16" style={{ fontFamily: `"${themeOutput.fonts.sans}", sans-serif` }}>
                                                  {themeOutput.fonts.sans}
                                                </span>
                                                <span>•</span>
                                                <span className="truncate max-w-16" style={{ fontFamily: `"${themeOutput.fonts.serif}", serif` }}>
                                                  {themeOutput.fonts.serif}
                                                </span>
                                                <span>•</span>
                                                <span className="truncate max-w-16" style={{ fontFamily: `"${themeOutput.fonts.mono}", monospace` }}>
                                                  {themeOutput.fonts.mono}
                                                </span>
                                              </div>
                                              <ChevronDown
                                                className={`h-4 w-4 transition-transform ${openSections.typography ? "rotate-180" : ""}`}
                                              />
                                            </div>
                                          </CollapsibleTrigger>
                                          <CollapsibleContent className="bg-muted/20 border-t border-border/30">
                                            <div className="p-4">
                                              <FontPreview fonts={themeOutput.fonts} />
                                            </div>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      )}

                                      {/* Border Radius Section */}
                                      {themeOutput.radius && (
                                        <Collapsible
                                          open={openSections.radius}
                                          onOpenChange={() => toggleSection('radius')}
                                        >
                                          <CollapsibleTrigger
                                            className={`flex w-full items-center justify-between px-4 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors border-t border-border/30`}
                                          >
                                            <span className="uppercase">Border Radius</span>
                                            <div className="flex items-center gap-2">
                                              <div className="flex gap-0.5">
                                                {Object.entries(themeOutput.radius).slice(0, 4).map(([size, value]) => (
                                                  <div
                                                    key={size}
                                                    className="w-3 h-3 bg-primary/30 border border-primary/40"
                                                    style={{ borderRadius: value as string }}
                                                    title={`${size}: ${value}`}
                                                  />
                                                ))}
                                              </div>
                                              <ChevronDown
                                                className={`h-4 w-4 transition-transform ${openSections.radius ? "rotate-180" : ""}`}
                                              />
                                            </div>
                                          </CollapsibleTrigger>
                                          <CollapsibleContent className="bg-muted/20 border-t border-border/30">
                                            <div className="p-4">
                                              <div className="flex flex-wrap gap-3">
                                                {Object.entries(themeOutput.radius).map(([size, value]) => (
                                                  <div key={size} className="flex items-center gap-2">
                                                    <div
                                                      className="w-6 h-6 bg-primary/20 border border-primary/30"
                                                      style={{ borderRadius: value as string }}
                                                    />
                                                    <div className="text-xs">
                                                      <div className="font-medium">{size}</div>
                                                      <div className="text-muted-foreground font-mono">{String(value)}</div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      )}

                                      {/* Shadow System Section */}
                                      {themeOutput.shadows && (
                                        <Collapsible
                                          open={openSections.shadows}
                                          onOpenChange={() => toggleSection('shadows')}
                                        >
                                          <CollapsibleTrigger
                                            className={`flex w-full items-center justify-between px-4 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors border-t border-border/30`}
                                          >
                                            <span className="uppercase">Shadow System</span>
                                            <div className="flex items-center gap-2">
                                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                                                <div
                                                  className="w-3 h-3 bg-background border border-border rounded-sm"
                                                  style={{
                                                    boxShadow: `${themeOutput.shadows.offsetX} ${themeOutput.shadows.offsetY} ${themeOutput.shadows.blur} ${themeOutput.shadows.color}${Math.round(parseFloat(themeOutput.shadows.opacity) * 255).toString(16).padStart(2, '0')}`
                                                  }}
                                                />
                                                <span>{themeOutput.shadows.color}</span>
                                                <span>•</span>
                                                <span>{themeOutput.shadows.opacity}</span>
                                              </div>
                                              <ChevronDown
                                                className={`h-4 w-4 transition-transform ${openSections.shadows ? "rotate-180" : ""}`}
                                              />
                                            </div>
                                          </CollapsibleTrigger>
                                          <CollapsibleContent className="bg-muted/20 border-t border-border/30">
                                            <div className="p-4">
                                              <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div className="space-y-1">
                                                  <span className="text-muted-foreground">Color</span>
                                                  <div className="font-mono bg-background/50 px-2 py-1 rounded border">{themeOutput.shadows.color}</div>
                                                </div>
                                                <div className="space-y-1">
                                                  <span className="text-muted-foreground">Opacity</span>
                                                  <div className="font-mono bg-background/50 px-2 py-1 rounded border">{themeOutput.shadows.opacity}</div>
                                                </div>
                                                <div className="space-y-1">
                                                  <span className="text-muted-foreground">Blur</span>
                                                  <div className="font-mono bg-background/50 px-2 py-1 rounded border">{themeOutput.shadows.blur}</div>
                                                </div>
                                                <div className="space-y-1">
                                                  <span className="text-muted-foreground">Offset</span>
                                                  <div className="font-mono bg-background/50 px-2 py-1 rounded border">{themeOutput.shadows.offsetX} {themeOutput.shadows.offsetY}</div>
                                                </div>
                                              </div>
                                            </div>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="px-4 pb-4 pt-2 flex gap-2 border-t border-border/30">
                                      <Button
                                        size="sm"
                                        onClick={() => handleApplyTheme(themeOutput)}
                                        className="h-8 px-3 flex-1"
                                      >
                                        <Sparkles className="h-3 w-3 mr-1.5" />
                                        Apply Theme
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          navigator.clipboard.writeText(JSON.stringify(themeOutput, null, 2));
                                        }}
                                        className="h-8 px-3"
                                      >
                                        <Copy className="h-3 w-3 mr-1.5" />
                                        Copy JSON
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            case 'output-error':
                              return (
                                <div key={index} className="w-full max-w-md">
                                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                      <div className="w-2 h-2 rounded-full bg-red-500" />
                                      <span>Theme generation failed</span>
                                    </div>
                                    <p className="text-red-700 dark:text-red-400 text-sm">
                                      {part.errorText || "An unexpected error occurred"}
                                    </p>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        // Retry the last message
                                        if (messages.length > 0) {
                                          const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
                                          if (lastUserMessage) {
                                            const textPart = lastUserMessage.parts.find(p => p.type === 'text');
                                            if (textPart && textPart.type === 'text') {
                                              sendMessage({ text: textPart.text });
                                            }
                                          }
                                        }
                                      }}
                                      className="h-7 text-xs"
                                    >
                                      Try Again
                                    </Button>
                                  </div>
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}

                    </div>
                  )}
                </Message>
              );
            })}

            {/* Simple shimmer loading */}
            {isLoading && (
              <Message className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-2 md:px-10">
                <div className="flex items-center justify-between py-4 w-full max-w-md">
                  <span className="text-sm text-muted-foreground animate-pulse">
                    Thinking...
                  </span>
                  <span className="text-xs text-muted-foreground/60">
                    {loadingTimer}s
                  </span>
                </div>
              </Message>
            )}
          </ChatContainerContent>
        </ChatContainerRoot>
        <ScrollBar />
      </ScrollArea>

      <ChatInput
        onSubmit={handleSubmit}
        onStop={stop}
        placeholder="Describe your ideal theme or drag & drop an image..."
        disabled={isChatDisabled}
        isStreaming={isLoading}
      />
    </div>
  );
}