"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Copy, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";
import { Message, MessageContent } from "@/components/ui/message";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/workbench/chat-input";
import type { PastedItem } from "@/lib/input-detection";
import { cn } from "@/lib/utils";

// Animated avatar component for the assistant
export function AssistantAvatar({
  isLoading = false,
  icon: Icon,
  className,
}: {
  isLoading?: boolean;
  icon?: React.ComponentType<{ size: number }>;
  className?: string;
}) {
  return (
    <div className={cn("relative flex-shrink-0 pt-2", className)}>
      <motion.div
        className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-border/30"
        animate={
          isLoading
            ? {
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }
            : {
                scale: 1,
                rotate: 0,
              }
        }
        transition={{
          duration: 2,
          repeat: isLoading ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {Icon ? (
          <Icon size={20} />
        ) : (
          <Sparkles className="h-5 w-5 text-primary" />
        )}
      </motion.div>

      {isLoading && (
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-400/40 to-orange-500/40 flex items-center justify-center border border-amber-300/50"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sparkles className="h-1.5 w-1.5 text-amber-500" />
        </motion.div>
      )}
    </div>
  );
}

interface AIChatProps {
  apiEndpoint: string;
  placeholder?: string;
  suggestions?: string[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: React.ComponentType<{ size: number }>;
  assistantIcon?: React.ComponentType<{ size: number }>;
  renderContent?: (message: any, index: number) => React.ReactNode;
  onSubmit?: (content: string, attachments: PastedItem[]) => void;
  className?: string;
  includeImages?: boolean;
  systemPrompt?: string;
}

export function AIChat({
  apiEndpoint,
  placeholder = "Type a message...",
  suggestions = [],
  emptyStateTitle = "What can I help you with?",
  emptyStateDescription = "Send a message to get started",
  emptyStateIcon: EmptyIcon,
  assistantIcon: AssistantIcon,
  renderContent,
  onSubmit: externalOnSubmit,
  className,
  includeImages = true,
  systemPrompt,
}: AIChatProps) {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: apiEndpoint,
    }),
  });

  // Timer for loading states
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const isLoading = useMemo(() => {
    const hasAssistantMessages = messages.some(
      (message) =>
        message.role === "assistant" &&
        message.parts.some(
          (part) =>
            (part.type === "text" && part.text.trim()) ||
            part.type.startsWith("tool-"),
        ),
    );
    return (
      (status === "submitted" || status === "streaming") &&
      !hasAssistantMessages
    );
  }, [status, messages]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading && !startTime) {
      setStartTime(Date.now());
      setLoadingTimer(0);
    }

    if (isLoading) {
      interval = setInterval(() => {
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          setLoadingTimer(elapsed);
        }
      }, 1000);
    } else if (startTime) {
      setStartTime(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, startTime]);

  const handleSubmit = useCallback(
    (content: string, attachments: PastedItem[]) => {
      if (!content.trim() && attachments.length === 0) return;

      // Add system prompt to first message if provided
      let messageText = content;
      if (messages.length === 0 && systemPrompt) {
        messageText = `${systemPrompt}\n\n${content}`;
      }

      // Convert PastedItems to AI SDK files format
      const files: any[] = [];
      attachments.forEach((item) => {
        if (item.kind === "image" && item.imageData) {
          const mediaType = item.imageData.startsWith("data:image/")
            ? item.imageData.substring(5, item.imageData.indexOf(";"))
            : "image/png";

          files.push({
            type: "file",
            mediaType,
            url: item.imageData,
            filename: item.content || `image.${mediaType.split("/")[1]}`,
          });
        }
      });

      sendMessage({
        text: messageText,
        files: files.length > 0 ? files : undefined,
      });

      // Call external onSubmit if provided
      if (externalOnSubmit) {
        externalOnSubmit(content, attachments);
      }
    },
    [sendMessage, messages.length, systemPrompt, externalOnSubmit],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSubmit(suggestion, []);
    },
    [handleSubmit],
  );

  const isChatDisabled = useMemo(() => {
    return status !== "ready" && status !== "error";
  }, [status]);

  return (
    <div className={cn("flex h-full flex-col overflow-hidden", className)}>
      <ScrollArea className="flex-1 min-h-0 pl-1 pr-4">
        <ChatContainerRoot className="relative space-y-0">
          <ChatContainerContent className="space-y-4 pb-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-border/30">
                    {EmptyIcon ? (
                      <EmptyIcon size={32} />
                    ) : (
                      <Sparkles className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center border border-amber-300/30">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                  </div>
                </div>

                <h3 className="text-lg font-medium text-foreground mb-2">
                  {emptyStateTitle}
                </h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                  {emptyStateDescription}
                </p>

                {suggestions.length > 0 && (
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
                )}
              </div>
            )}

            {messages.map((message) => {
              // Skip messages with no content
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
                    </div>
                  ) : (
                    <div className="group flex w-full">
                      <AssistantAvatar icon={AssistantIcon} />

                      <div className="flex flex-col gap-3 flex-1 min-w-0">
                        {renderContent ? (
                          renderContent(message, 0)
                        ) : (
                          <>
                            {/* Text content */}
                            {message.parts.some(
                              (part) => part.type === "text",
                            ) && (
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

                            {/* File content (images) */}
                            {message.parts
                              .filter(
                                (part) =>
                                  part.type === "file" &&
                                  part.mediaType?.startsWith("image/"),
                              )
                              .map((part, index) => (
                                <div key={index} className="mt-2">
                                  <img
                                    src={(part as any).url}
                                    alt="Generated content"
                                    className="max-w-full h-auto rounded-lg border border-border"
                                  />
                                </div>
                              ))}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </Message>
              );
            })}

            {/* Loading state */}
            {isLoading && (
              <Message className="flex w-full max-w-3xl flex-col items-start gap-2">
                <div className="group flex w-full gap-3">
                  <AssistantAvatar isLoading={true} icon={AssistantIcon} />
                  <div className="flex items-center justify-between py-4 w-full max-w-md">
                    <span className="text-sm text-muted-foreground animate-pulse">
                      Thinking...
                    </span>
                    <span className="text-xs text-muted-foreground/60">
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

      <ChatInput
        onSubmit={handleSubmit}
        onStop={stop}
        placeholder={placeholder}
        disabled={isChatDisabled}
        isStreaming={isLoading}
      />
    </div>
  );
}
