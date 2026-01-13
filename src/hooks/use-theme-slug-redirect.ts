"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "@/stores/theme";

interface UseThemeSlugRedirectProps {
  chatId: string;
  enabled?: boolean;
  messages?: any[]; // Chat messages to detect AI tool responses
}

export function useThemeSlugRedirect({
  chatId,
  enabled = true,
  messages = [],
}: UseThemeSlugRedirectProps) {
  const router = useRouter();
  const activeTheme = useThemeStore((state: any) => state.activeTheme);
  const lastThemeRef = useRef<string | null>(null);
  const initialChatIdRef = useRef(chatId);
  const [detectedSlug, setDetectedSlug] = useState<string | null>(null);

  // Watch for AI tool responses that contain a slug
  useEffect(() => {
    if (!enabled || messages.length === 0) return;

    // Look for generateTheme tool responses in messages
    for (const message of messages) {
      if (message.role === "assistant" && message.parts) {
        for (const part of message.parts) {
          if (
            part.type === "tool-generateTheme" &&
            part.state === "output-available" &&
            part.output
          ) {
            const { slug } = part.output;
            if (slug && slug !== detectedSlug) {
              setDetectedSlug(slug);
              return;
            }
          }
        }
      }
    }
  }, [messages, enabled, detectedSlug]);

  // Handle redirection when slug is detected
  useEffect(() => {
    if (!enabled) return;

    const currentPath = window.location.pathname;
    const isOnOriginalChatId =
      currentPath === `/workbench/${initialChatIdRef.current}`;

    if (!isOnOriginalChatId) return;

    // Priority 1: Use detected slug from AI tool response
    if (detectedSlug && detectedSlug !== chatId) {
      const searchParams = window.location.search;
      const newUrl = `/workbench/${detectedSlug}${searchParams}`;
      router.replace(newUrl);
      return;
    }

    // Priority 2: Use theme store slug (for manually selected themes)
    if (
      activeTheme?.slug &&
      activeTheme.slug !== lastThemeRef.current &&
      activeTheme.slug !== chatId
    ) {
      lastThemeRef.current = activeTheme.slug;
      const searchParams = window.location.search;
      const newUrl = `/workbench/${activeTheme.slug}${searchParams}`;
      router.replace(newUrl);
    } else if (activeTheme?.slug) {
      // Update the reference even if we don't redirect
      lastThemeRef.current = activeTheme.slug;
    }
  }, [activeTheme, chatId, router, enabled, detectedSlug]);

  return {
    currentThemeSlug: activeTheme?.slug,
    detectedSlug,
    shouldRedirect: Boolean(
      enabled &&
        (detectedSlug || activeTheme?.slug) &&
        (detectedSlug !== chatId || activeTheme?.slug !== chatId) &&
        window.location.pathname === `/workbench/${initialChatIdRef.current}`,
    ),
  };
}
