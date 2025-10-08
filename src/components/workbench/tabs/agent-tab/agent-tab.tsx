"use client";

import { SignInButton } from "@clerk/nextjs";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";
import { Message, MessageContent } from "@/components/ui/message";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/workbench/chat-input";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme";
import { AssistantAvatar } from "./components/assistant-avatar";
import { ChatEmptyState } from "./components/chat-empty-state";
import { MessageAttachment } from "./components/message-attachment";
import { ThemeResultCard } from "./components/theme-result-card";
import { ToolStatusCard } from "./components/tool-status-card";
import { useChatLogic } from "./hooks/use-chat-logic";
import { useLoadingTimer } from "./hooks/use-loading-timer";
import { useThemeApplication } from "./hooks/use-theme-application";

interface AgentTabProps {
  initialPrompt?: string;
}

export function AgentTab({ initialPrompt }: AgentTabProps) {
  const { currentMode } = useThemeContext();
  const { handleApplyTheme } = useThemeApplication();
  const { isAuthenticated, loadUserThemes, selectTheme } = useTheme();
  const lastProcessedThemeIdRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);

  // Keep stable references
  const loadUserThemesRef = useRef(loadUserThemes);
  const selectThemeRef = useRef(selectTheme);
  const handleApplyThemeRef = useRef(handleApplyTheme);

  useEffect(() => {
    loadUserThemesRef.current = loadUserThemes;
    selectThemeRef.current = selectTheme;
    handleApplyThemeRef.current = handleApplyTheme;
  });

  const {
    messages,
    sendMessage,
    handleSubmit,
    handleSuggestionClick,
    hasActiveTool,
    isLoading,
    isChatDisabled,
  } = useChatLogic({ initialPrompt });

  const { loadingTimer, currentToolMessage } = useLoadingTimer({
    isLoading,
    hasActiveTool,
  });

  // Check if anonymous user has generated at least one theme
  const hasGeneratedTheme = useMemo(() => {
    return messages.some((message) =>
      message.parts.some(
        (part) =>
          part.type === "tool-generateTheme" &&
          part.state === "output-available",
      ),
    );
  }, [messages]);

  // Block chat input for anonymous users after first theme generation
  const shouldBlockInput = !isAuthenticated && hasGeneratedTheme;

  // Auto-apply and auto-save each generated theme
  useEffect(() => {
    const allGeneratedThemes = messages.flatMap((msg) =>
      msg.parts.filter(
        (part) =>
          part.type === "tool-generateTheme" &&
          part.state === "output-available",
      ),
    );

    if (allGeneratedThemes.length === 0) return;

    // Process latest theme
    const latestTheme = allGeneratedThemes[allGeneratedThemes.length - 1];
    const latestThemeOutput =
      latestTheme.type === "tool-generateTheme" &&
      latestTheme.state === "output-available"
        ? (latestTheme.output as any)
        : null;

    if (!latestThemeOutput) return;

    // Use the tool call ID as unique identifier to prevent duplicates
    const toolCallId =
      latestTheme.type === "tool-generateTheme" ? latestTheme.toolCallId : null;
    if (!toolCallId) return;

    // Only process if this exact tool call hasn't been processed yet
    if (lastProcessedThemeIdRef.current === toolCallId) return;
    lastProcessedThemeIdRef.current = toolCallId;

    // For authenticated users: theme is already saved by generate-theme tool
    // Just reload user themes and select the saved theme
    if (isAuthenticated && !isSavingRef.current) {
      isSavingRef.current = true;

      const reloadAndSelectTheme = async () => {
        try {
          // Reload user themes to get the newly saved theme
          await loadUserThemesRef.current();

          // The tool already saved the theme and returned the slug
          const savedSlug = latestThemeOutput.slug;
          const savedTheme = latestThemeOutput.databaseTheme;

          if (savedSlug) {
            // If we have the full theme object from the tool, select it directly
            if (savedTheme) {
              selectThemeRef.current(savedTheme);
            }
            toast.success(`"${latestThemeOutput.title}" saved!`);
          }

          // Apply the theme
          handleApplyThemeRef.current(latestThemeOutput);
        } catch (error) {
          console.error("Error reloading themes:", error);
        } finally {
          isSavingRef.current = false;
        }
      };

      reloadAndSelectTheme();
    } else if (!isAuthenticated) {
      // Anonymous users: theme is already saved by tool (as public theme)
      // Apply the theme with database info so it shows as saved
      const themeToApply = {
        ...latestThemeOutput,
        // Include database ID and slug from the tool output
        id: latestThemeOutput.databaseId,
        slug: latestThemeOutput.slug,
      };
      handleApplyThemeRef.current(themeToApply);
    }
  }, [messages, isAuthenticated]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 min-h-0 pl-1 pr-4">
        <ChatContainerRoot className="relative space-y-0">
          <ChatContainerContent className="space-y-4 pb-6">
            {messages.length === 0 && (
              <ChatEmptyState onSuggestionClick={handleSuggestionClick} />
            )}

            {messages.map((message) => {
              const hasContent = message.parts.some(
                (part) =>
                  (part.type === "text" && part.text.trim()) ||
                  (part.type.startsWith("tool-") && part.type !== "step-start"),
              );

              if (!hasContent) return null;

              return (
                <Message
                  key={message.id}
                  className={cn(
                    "flex w-full max-w-3xl flex-col gap-2",
                    message.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  {message.role === "user" ? (
                    <div className="group flex w-full flex-col items-end gap-1">
                      <MessageContent className="bg-card border max-w-full rounded-sm px-5 py-2.5 whitespace-normal">
                        {message.parts
                          .filter((part) => part.type === "text")
                          .map((part) =>
                            part.type === "text" ? part.text : "",
                          )
                          .join("")}
                      </MessageContent>
                      {(() => {
                        const fileParts = message.parts.filter(
                          (part) => part.type === "file",
                        );
                        return (
                          fileParts.length > 0 && (
                            <div className="flex flex-wrap gap-2 max-w-full justify-end">
                              {fileParts.map((part: any, index: number) => (
                                <MessageAttachment
                                  key={`part-${index}`}
                                  file={part}
                                />
                              ))}
                            </div>
                          )
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="group flex w-full">
                      <AssistantAvatar />

                      <div className="flex flex-col gap-3 flex-1 min-w-0">
                        {message.parts.some((part) => part.type === "text") && (
                          <div className="w-full max-w-2xl">
                            <MessageContent className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                              {message.parts
                                .filter((part) => part.type === "text")
                                .map((part) =>
                                  part.type === "text" ? part.text : "",
                                )
                                .join("")}
                            </MessageContent>
                          </div>
                        )}

                        {(() => {
                          const allGeneratedThemes = messages.flatMap((msg) =>
                            msg.parts.filter(
                              (part) =>
                                part.type === "tool-generateTheme" &&
                                part.state === "output-available",
                            ),
                          );

                          return message.parts
                            .filter(
                              (part) =>
                                part.type === "tool-generateTheme" ||
                                part.type === "tool-getCurrentTheme",
                            )
                            .map((part, index) => {
                              if (part.type === "tool-getCurrentTheme") {
                                switch (part.state) {
                                  case "input-available":
                                  case "input-streaming":
                                    return (
                                      <ToolStatusCard
                                        key={index}
                                        toolName="getCurrentTheme"
                                        state={part.state}
                                        timer={loadingTimer}
                                      />
                                    );
                                  case "output-available":
                                  case "output-error":
                                    return null;
                                  default:
                                    return null;
                                }
                              }

                              if (part.type !== "tool-generateTheme")
                                return null;

                              switch (part.state) {
                                case "input-available":
                                case "input-streaming":
                                  return (
                                    <ToolStatusCard
                                      key={index}
                                      toolName="generateTheme"
                                      state={part.state}
                                      message={currentToolMessage}
                                      timer={loadingTimer}
                                    />
                                  );
                                case "output-available": {
                                  const themeOutput = part.output as any;
                                  // Check if this is the first generated theme (index 0 in all themes)
                                  const isFirstTheme =
                                    part === allGeneratedThemes[0];
                                  return (
                                    <ThemeResultCard
                                      key={index}
                                      themeOutput={themeOutput}
                                      currentMode={currentMode}
                                      loadingTimer={loadingTimer}
                                      onApplyTheme={handleApplyTheme}
                                      isFirstTheme={isFirstTheme}
                                    />
                                  );
                                }
                                case "output-error":
                                  return (
                                    <div
                                      key={index}
                                      className="w-full max-w-md"
                                    >
                                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                          <div className="w-2 h-2 rounded-full bg-red-500" />
                                          <span>Theme generation failed</span>
                                        </div>
                                        <p className="text-red-700 dark:text-red-400 text-sm">
                                          {part.errorText ||
                                            "An unexpected error occurred"}
                                        </p>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            if (messages.length > 0) {
                                              const lastUserMessage = [
                                                ...messages,
                                              ]
                                                .reverse()
                                                .find((m) => m.role === "user");
                                              if (lastUserMessage) {
                                                const textPart =
                                                  lastUserMessage.parts.find(
                                                    (p) => p.type === "text",
                                                  );
                                                if (
                                                  textPart &&
                                                  textPart.type === "text"
                                                ) {
                                                  sendMessage({
                                                    text: textPart.text,
                                                  });
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
                            });
                        })()}
                      </div>
                    </div>
                  )}
                </Message>
              );
            })}

            {isLoading && (
              <Message className="flex w-full max-w-3xl flex-col items-start gap-2">
                <div className="group flex w-full gap-3">
                  <AssistantAvatar isLoading={true} />
                  <div className="flex items-center justify-between py-4 w-full max-w-md">
                    <span className="text-sm text-muted-foreground animate-pulse">
                      Thinking...
                    </span>
                    <span className="text-xs text-muted-foreground/60 tabular-nums">
                      {loadingTimer}s
                    </span>
                  </div>
                </div>
              </Message>
            )}
          </ChatContainerContent>
        </ChatContainerRoot>
        <ScrollBar />
      </ScrollArea>

      {/* Login prompt for anonymous users after first theme */}
      {shouldBlockInput && (
        <div className="px-4 py-3 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              🎨 <strong>Sign in to continue</strong> creating theme variations
            </p>
            <SignInButton mode="modal">
              <Button size="sm" variant="default">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      )}

      <ChatInput
        onSubmit={handleSubmit}
        placeholder={
          shouldBlockInput
            ? "Sign in to continue creating themes..."
            : "Describe your ideal theme or drag & drop an image..."
        }
        disabled={isChatDisabled || shouldBlockInput}
        isStreaming={isLoading}
      />
    </div>
  );
}
