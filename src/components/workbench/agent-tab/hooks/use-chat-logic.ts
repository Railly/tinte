"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { PastedItem } from "@/lib/input-detection";
import { useThemeContext } from "@/providers/theme";
import { useWorkbenchStore } from "@/stores/workbench-store";
import { clearSeed } from "@/utils/anon-seed";

interface UseChatLogicProps {
  initialPrompt?: string;
}

export function useChatLogic({ initialPrompt }: UseChatLogicProps = {}) {
  const { tinteTheme, currentMode, fonts, radius, shadows } = useThemeContext();

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        currentTheme: {
          tinteTheme,
          currentMode,
          fonts,
          radius,
          shadows,
        },
      },
    }),
  });

  const seed = useWorkbenchStore((state) => state.seed);
  const chatId = useWorkbenchStore((state) => state.chatId);
  const processedSeedRef = useRef<string | null>(null);
  const processedPromptRef = useRef<string | null>(null);

  // Handle seed processing
  useEffect(() => {
    if (
      seed &&
      chatId &&
      processedSeedRef.current !== seed.id &&
      messages.length === 0
    ) {
      processedSeedRef.current = seed.id;

      const files: any[] = [];
      seed.attachments.forEach((attachment) => {
        if (attachment.kind === "image" && attachment.imageData) {
          const mediaType = attachment.imageData.startsWith("data:image/")
            ? attachment.imageData.substring(
                5,
                attachment.imageData.indexOf(";"),
              )
            : "image/png";

          files.push({
            type: "file",
            mediaType,
            url: attachment.imageData,
            filename: attachment.content || `image.${mediaType.split("/")[1]}`,
          });
        }
      });

      sendMessage({
        text: seed.content,
        files: files.length > 0 ? files : undefined,
      });

      clearSeed(chatId);
    }
  }, [seed, chatId]);

  // Handle initial prompt auto-send
  useEffect(() => {
    const promptKey = `${chatId}-${initialPrompt}`;
    if (
      initialPrompt &&
      processedPromptRef.current !== promptKey &&
      messages.length === 0 &&
      chatId &&
      !seed // Don't auto-send if we have a seed to process
    ) {
      processedPromptRef.current = promptKey;
      sendMessage({
        text: initialPrompt.trim(),
      });
    }
  }, [initialPrompt, chatId, seed]);

  const handleSubmit = useCallback(
    (content: string, attachments: PastedItem[]) => {
      if (!content.trim() && attachments.length === 0) return;

      // Convert PastedItems to AI SDK files format
      const files: any[] = [];
      attachments.forEach((item) => {
        if (item.kind === "image" && item.imageData) {
          // Detect media type from data URL
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
        text: content,
        files: files.length > 0 ? files : undefined,
      });
    },
    [sendMessage],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSubmit(suggestion, []);
    },
    [handleSubmit],
  );

  // Check if there's an active tool
  const hasActiveTool = useMemo(() => {
    return messages.some((message) =>
      message.parts.some(
        (part) =>
          (part.type === "tool-generateTheme" ||
            part.type === "tool-getCurrentTheme") &&
          (part.state === "input-available" ||
            part.state === "input-streaming"),
      ),
    );
  }, [messages]);

  // Simple loading check - but not if there's an active tool or if there are assistant messages
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
      !hasActiveTool &&
      !hasAssistantMessages
    );
  }, [status, hasActiveTool, messages]);

  // Memoize chat input disabled state
  const isChatDisabled = useMemo(() => {
    return status !== "ready" && status !== "error";
  }, [status]);

  return {
    messages,
    sendMessage,
    status,
    stop,
    handleSubmit,
    handleSuggestionClick,
    hasActiveTool,
    isLoading,
    isChatDisabled,
  };
}
