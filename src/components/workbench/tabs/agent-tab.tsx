"use client";

import { memo, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useThemeContext } from "@/providers/theme";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";
import { DotsLoader } from "@/components/ui/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";
import {
  AlertTriangle,
  ArrowUp,
  Copy,
  Palette,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import type { ThemeData } from "@/lib/theme-tokens";
import { AttachmentBubble } from "@/components/workbench/attachment-bubble";

type MessageComponentProps = {
  message: UIMessage;
  isLastMessage: boolean;
};

const ThemePreview = memo(({ themeData }: { themeData: any }) => {
  if (!themeData?.theme) return null;

  const { light, dark } = themeData.theme;
  const { colorStory, accessibility } = themeData;

  return (
    <div className="mt-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold">Generated Theme</span>
        {accessibility?.contrastRatio && (
          <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
            {accessibility.contrastRatio}
          </span>
        )}
      </div>
      
      {colorStory && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            {colorStory}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Light Mode</div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: light.bg }}
              />
              <span className="text-xs font-medium">BG</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: light.tx }}
              />
              <span className="text-xs font-medium">Text</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: light.pr }}
              />
              <span className="text-xs font-medium">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: light.ac_1 }}
              />
              <span className="text-xs font-medium">Accent</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Dark Mode</div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: dark.bg }}
              />
              <span className="text-xs font-medium">BG</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: dark.tx }}
              />
              <span className="text-xs font-medium">Text</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: dark.pr }}
              />
              <span className="text-xs font-medium">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: dark.ac_1 }}
              />
              <span className="text-xs font-medium">Accent</span>
            </div>
          </div>
        </div>

        {accessibility?.colorBlindSafe && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-muted-foreground">Color-blind friendly</span>
          </div>
        )}
      </div>
    </div>
  );
});

ThemePreview.displayName = "ThemePreview";

export const MessageComponent = memo(
  ({ message, isLastMessage }: MessageComponentProps) => {
    const isAssistant = message.role === "assistant";
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

    return (
      <Message
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-col gap-2 px-2 md:px-10",
          isAssistant ? "items-start" : "items-end"
        )}
      >
        {isAssistant ? (
          <div className="group flex w-full flex-col gap-0">
            <MessageContent
              className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0"
              markdown
            >
              {message.parts
                .filter(part => part.type === "text")
                .map(part => part.type === "text" ? part.text : "")
                .join("")}
            </MessageContent>

            {message.parts
              .filter(part => part.type === "tool-generateTheme")
              .map((part, index) => {
                if (part.type !== "tool-generateTheme" || !("output" in part) || !part.output) return null;
                return (
                  <div key={index}>
                    <ThemePreview themeData={part.output} />
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApplyTheme(part.output)}
                        className="h-7"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Apply Theme
                      </Button>
                    </div>
                  </div>
                );
              })}

            <MessageActions
              className={cn(
                "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                isLastMessage && "opacity-100"
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Copy className="h-4 w-4" />
                </Button>
              </MessageAction>
              <MessageAction tooltip="Upvote" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </MessageAction>
              <MessageAction tooltip="Downvote" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        ) : (
          <div className="group flex w-full flex-col items-end gap-1">
            <MessageContent className="bg-primary text-primary-foreground max-w-[85%] rounded-3xl px-5 py-2.5 whitespace-pre-wrap sm:max-w-[75%]">
              {message.parts
                .filter(part => part.type === "text")
                .map(part => part.type === "text" ? part.text : "")
                .join("")}
            </MessageContent>

            {/* Show attachments if available */}
            {(message as any).experimental_attachments && (message as any).experimental_attachments.length > 0 && (
              <div className="space-y-2 mt-3 max-w-[85%] sm:max-w-[75%]">
                {(message as any).experimental_attachments.map((attachment: any, index: number) => (
                  <AttachmentBubble
                    key={index}
                    att={{
                      kind: attachment.contentType?.startsWith('image/') ? 'image' : 'prompt',
                      content: attachment.name || 'Attachment',
                      imageData: attachment.contentType?.startsWith('image/') ? attachment.url : undefined,
                      id: `att-${index}`
                    } as any}
                  />
                ))}
              </div>
            )}

            <MessageActions
              className={cn(
                "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Copy className="h-4 w-4" />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        )}
      </Message>
    );
  }
);

MessageComponent.displayName = "MessageComponent";

const LoadingMessage = memo(() => (
  <Message className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col gap-0">
      <div className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0">
        <DotsLoader />
      </div>
    </div>
  </Message>
));

LoadingMessage.displayName = "LoadingMessage";

const ErrorMessage = memo(({ error }: { error: Error }) => (
  <Message className="not-prose mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col items-start gap-0">
      <div className="text-primary flex min-w-0 flex-1 flex-row items-center gap-2 rounded-lg border-2 border-red-300 bg-red-300/20 px-2 py-1">
        <AlertTriangle size={16} className="text-red-500" />
        <p className="text-red-500">{error.message}</p>
      </div>
    </div>
  </Message>
));

ErrorMessage.displayName = "ErrorMessage";

const suggestions = [
  "Ocean sunset theme with warm oranges and cool blues",
  "Dark cyberpunk theme with neon accents",
  "Forest morning theme with natural greens",
  "Minimalist theme with subtle grays",
];

export function AgentTab() {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Array<{ file: File; url: string }>>([]);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate-theme",
    }),
  });

  const handleSubmit = useCallback(() => {
    if (!input.trim() && attachments.length === 0) return;

    const message: any = { text: input };
    
    // Add attachments if any
    if (attachments.length > 0) {
      message.experimental_attachments = attachments.map((att, index) => ({
        name: att.file.name,
        contentType: att.file.type,
        url: att.url,
        id: `attachment-${index}`
      }));
    }

    sendMessage(message);
    setInput("");
    setAttachments([]);
  }, [input, attachments, sendMessage]);

  const handleFileUpload = useCallback((files: FileList) => {
    const newAttachments: Array<{ file: File; url: string }> = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newAttachments.push({ file, url });
      }
    });
    
    setAttachments(prev => [...prev, ...newAttachments]);
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].url);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);

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
                <span>Powered by GPT-4 • Instant generation</span>
              </div>
            </div>
          )}

          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;

            return (
              <MessageComponent
                key={message.id}
                message={message}
                isLastMessage={isLastMessage}
              />
            );
          })}

          {status === "submitted" && <LoadingMessage />}
          {status === "error" && error && <ErrorMessage error={error} />}
        </ChatContainerContent>
      </ChatContainerRoot>

      <div className="inset-x-0 bottom-0 mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
        {/* Show attachments preview above input */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative">
                <AttachmentBubble
                  att={{
                    kind: 'image',
                    content: attachment.file.name,
                    imageData: attachment.url,
                    id: `preview-${index}`
                  } as any}
                />
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <PromptInput
          isLoading={status !== "ready"}
          value={input}
          onValueChange={setInput}
          onSubmit={handleSubmit}
          className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-lg"
        >
          <div className="flex flex-col">
            <div 
              className="relative"
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  handleFileUpload(files);
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
            >
              <PromptInputTextarea
                placeholder={attachments.length > 0 
                  ? "Describe what theme you want based on the image..." 
                  : "Describe your ideal theme or drag & drop an image..."
                }
                className="min-h-[48px] pt-3 pl-4 pr-4 text-base leading-[1.4] sm:text-base md:text-base"
              />
            </div>

            <PromptInputActions className="mt-2 flex w-full items-center justify-between gap-2 p-2">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(e.target.files);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  📎 {attachments.length > 0 ? `${attachments.length} image${attachments.length > 1 ? 's' : ''}` : 'Add image'}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  disabled={
                    (!input.trim() && attachments.length === 0) || (status !== "ready" && status !== "error")
                  }
                  onClick={handleSubmit}
                  className="size-9 rounded-full"
                >
                  {status === "ready" || status === "error" ? (
                    <ArrowUp size={18} />
                  ) : (
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  );
}