"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/stores/theme";

interface UseThemeSlugRedirectProps {
  chatId: string;
  enabled?: boolean;
  messages?: any[]; // Chat messages to detect AI tool responses
}

export function useThemeSlugRedirect({ chatId, enabled = true, messages = [] }: UseThemeSlugRedirectProps) {
  const router = useRouter();
  const activeTheme = useThemeStore((state) => state.activeTheme);
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
          if (part.type === "tool-generateTheme" && part.state === "output-available" && part.output) {
            const { slug } = part.output;
            if (slug && slug !== detectedSlug) {
              console.log("🎨 AI generated theme with database slug:", slug);
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
    const isOnOriginalChatId = currentPath === `/workbench/${initialChatIdRef.current}`;

    if (!isOnOriginalChatId) return;

    // Priority 1: Use detected slug from AI tool response
    if (detectedSlug && detectedSlug !== chatId) {
      console.log("🔄 Redirecting to AI-generated theme slug:", detectedSlug);

      const searchParams = window.location.search;
      const newUrl = `/workbench/${detectedSlug}${searchParams}`;

      console.log("🚀 Redirecting to AI theme:", newUrl);
      router.replace(newUrl);
      return;
    }

    // Priority 2: Use theme store slug (for manually selected themes)
    if (
      activeTheme?.slug &&
      activeTheme.slug !== lastThemeRef.current &&
      activeTheme.slug !== chatId // Don't redirect if slug is the same as current chatId
    ) {
      console.log("🔄 Theme store slug redirect detected:", {
        oldSlug: lastThemeRef.current,
        newSlug: activeTheme.slug,
        chatId,
        currentPath
      });

      lastThemeRef.current = activeTheme.slug;

      // Preserve search params when redirecting
      const searchParams = window.location.search;
      const newUrl = `/workbench/${activeTheme.slug}${searchParams}`;

      console.log("🚀 Redirecting to theme slug:", newUrl);
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
      window.location.pathname === `/workbench/${initialChatIdRef.current}`
    )
  };
}