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
import { cn } from "@/lib/utils";
import {
  Copy,
  Palette,
  Sparkles,
} from "lucide-react";
import { ChatInput } from "@/components/workbench/chat-input";
import type { PastedItem } from "@/lib/input-detection";
import type { ThemeData } from "@/lib/theme-tokens";
import { ThemeColorPreview } from "@/components/shared/theme-color-preview";
import { extractThemeColors } from "@/lib/theme-utils";

const suggestions = [
  "Ocean sunset theme with warm oranges and cool blues",
  "Dark cyberpunk theme with neon accents", 
  "Forest morning theme with natural greens",
  "Minimalist theme with subtle grays",
];

export function AgentTab() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate-theme",
    }),
  });

  const { addTheme, handleThemeSelect } = useThemeContext();

  const handleApplyTheme = useCallback((toolResult: any) => {
    if (!toolResult?.theme) return;

    const themeData: ThemeData = {
      id: `ai-generated-${Date.now()}`,
      name: toolResult.concept ? toolResult.concept.slice(0, 30) + (toolResult.concept.length > 30 ? "..." : "") : "AI Generated Theme",
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
      rawTheme: toolResult.theme,
    };

    addTheme(themeData);
    handleThemeSelect(themeData);
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

  // Simple loading check
  const isLoading = useMemo(() => {
    return status === "submitted" || status === "streaming";
  }, [status]);

  // Timer and shimmer text for theme generation
  const [craftingTimer, setCraftingTimer] = useState(0);
  const [craftingText, setCraftingText] = useState("Crafting your theme...");

  // Shimmer text array
  const craftingSteps = [
    "Crafting your theme...",
    "Analyzing color harmony...", 
    "Generating light mode...",
    "Creating dark variant...",
    "Perfecting contrasts...",
    "Almost ready..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      setCraftingTimer(0);
      setCraftingText(craftingSteps[0]);
      
      interval = setInterval(() => {
        setCraftingTimer(prev => {
          const newTime = prev + 1;
          
          // Change text every few seconds
          const stepIndex = Math.floor(newTime / 3) % craftingSteps.length;
          setCraftingText(craftingSteps[stepIndex]);
          
          return newTime;
        });
      }, 1000);
    } else {
      setCraftingTimer(0);
      setCraftingText(craftingSteps[0]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Memoize chat input disabled state
  const isChatDisabled = useMemo(() => {
    return status !== "ready" && status !== "error";
  }, [status]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto">
        <ChatContainerContent className="space-y-12 px-4 py-12">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center max-w-2xl mx-auto">
              <Palette className="h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                AI Theme Generator
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-6">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-4 text-left rounded-xl border border-border/50 hover:border-border hover:bg-accent/30 transition-all duration-200 group"
                  >
                    <div className="text-sm font-medium group-hover:text-primary transition-colors">
                      {suggestion}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                <span>Powered by GPT-4 • Generative UI</span>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <Message
              key={message.id}
              className={cn(
                "mx-auto flex w-full max-w-3xl flex-col gap-2 px-2 md:px-10",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              {message.role === "user" ? (
                <div className="group flex w-full flex-col items-end gap-1">
                  <MessageContent className="bg-primary text-primary-foreground max-w-[85%] rounded-3xl px-5 py-2.5 whitespace-pre-wrap sm:max-w-[75%]">
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
                          return (
                            <div key={index} className="w-full max-w-md space-y-3">
                              <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
                                <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                <span>Crafting your perfect theme...</span>
                              </div>
                              <div className="p-4 border border-violet-200 dark:border-violet-800 rounded-lg bg-violet-50/50 dark:bg-violet-900/20 relative overflow-hidden">
                                <div className="text-xs text-violet-600 dark:text-violet-400 mb-3 font-medium">
                                  🎨 Generating OKLCH color harmonies
                                </div>
                                
                                {/* Animated color bars */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                                    <div className="h-2 bg-gradient-to-r from-violet-200 to-violet-400 rounded-full flex-1 animate-pulse"></div>
                                    <span className="text-xs text-violet-600/70">Light mode</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse delay-100"></div>
                                    <div className="h-2 bg-gradient-to-r from-violet-600 to-violet-800 rounded-full flex-1 animate-pulse delay-100"></div>
                                    <span className="text-xs text-violet-600/70">Dark mode</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-violet-600 animate-pulse delay-200"></div>
                                    <div className="h-2 bg-gradient-to-r from-violet-300 to-violet-500 rounded-full flex-1 animate-pulse delay-200"></div>
                                    <span className="text-xs text-violet-600/70">Accessibility</span>
                                  </div>
                                </div>

                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none"></div>
                              </div>
                            </div>
                          );
                        case 'output-available':
                          const themeOutput = part.output as any;
                          return (
                            <div key={index} className="w-full max-w-lg space-y-4">
                              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Crafted in {craftingTimer}s ✨</span>
                              </div>
                              
                              {/* Theme Details */}
                              <div className="p-4 rounded-lg border border-border/30 bg-muted/10 space-y-3">
                                <div className="flex items-center gap-2">
                                  <Palette className="h-4 w-4 text-primary" />
                                  <span className="font-medium text-sm">
                                    {themeOutput.concept || "Custom Theme"}
                                  </span>
                                  {themeOutput.accessibility?.contrastRatio && (
                                    <span className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
                                      {themeOutput.accessibility.contrastRatio}
                                    </span>
                                  )}
                                </div>
                                
                                {themeOutput.colorStory && (
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {themeOutput.colorStory}
                                  </p>
                                )}
                                
                                {/* Color Palette Display */}
                                {themeOutput.theme && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-muted-foreground">Light Mode</span>
                                      <ThemeColorPreview 
                                        colors={themeOutput.theme.light || {}} 
                                        size="sm" 
                                        maxColors={8}
                                      />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-muted-foreground">Dark Mode</span>
                                      <ThemeColorPreview 
                                        colors={themeOutput.theme.dark || {}} 
                                        size="sm" 
                                        maxColors={8}
                                      />
                                    </div>
                                  </div>
                                )}

                                {themeOutput.accessibility?.colorBlindSafe && (
                                  <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>Color-blind safe</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Single Apply Button */}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApplyTheme(themeOutput)}
                                  className="h-8 px-3"
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
          ))}

          {/* Simple shimmer loading */}
          {isLoading && (
            <Message className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-2 md:px-10">
              <div className="flex items-center justify-between py-4 w-full max-w-md">
                <span className="text-sm text-muted-foreground animate-pulse">
                  {craftingText}
                </span>
                <span className="text-xs text-muted-foreground/60">
                  {craftingTimer}s
                </span>
              </div>
            </Message>
          )}
        </ChatContainerContent>
      </ChatContainerRoot>

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