"use client";

import { useCallback } from "react";
import type { ThemeData } from "@/lib/theme-tokens";
import { useThemeContext } from "@/providers/theme";
import { loadGoogleFont } from "@/utils/fonts";
import { FONT_WEIGHTS } from "../constants";

export function useThemeApplication() {
  const { handleThemeSelect } = useThemeContext();

  const handleApplyTheme = useCallback(
    async (toolResult: any) => {
      if (!toolResult?.theme) return;

      // Load Google Fonts if they were generated
      if (toolResult.fonts) {
        try {
          loadGoogleFont(toolResult.fonts.sans, FONT_WEIGHTS);
          loadGoogleFont(toolResult.fonts.serif, FONT_WEIGHTS);
          loadGoogleFont(toolResult.fonts.mono, FONT_WEIGHTS);
        } catch (error) {
          console.warn("Failed to load fonts:", error);
        }
      }

      const extendedRawTheme = {
        light: toolResult.theme.light,
        dark: toolResult.theme.dark,
        fonts: toolResult.fonts,
        radius: toolResult.radius,
        shadows: toolResult.shadows,
      };

      const themeData: ThemeData = {
        // Use database ID if available (from tool), otherwise temporary ID
        id:
          toolResult.databaseId ||
          toolResult.id ||
          `ai-generated-${Date.now()}`,
        slug: toolResult.slug,
        user_id: toolResult.databaseTheme?.user_id, // Include user_id from database
        name: toolResult.title || "AI Generated Theme",
        description: `AI-generated theme: ${
          toolResult.concept || "Custom theme"
        }`,
        author: "AI Assistant",
        provider: "tinte",
        downloads: 0,
        likes: 0,
        installs: 0,
        createdAt: new Date().toISOString(),
        colors: {
          primary: toolResult.theme.light.pr,
          secondary: toolResult.theme.light.sc,
          accent: toolResult.theme.light.ac_1,
          background: toolResult.theme.light.bg,
          foreground: toolResult.theme.light.tx,
        },
        tags: ["ai-generated"],
        rawTheme: extendedRawTheme,
        concept: toolResult.concept,
      };

      // Apply theme to UI
      handleThemeSelect(themeData);

      setTimeout(() => {
        if (document.documentElement) {
          document.documentElement.style.setProperty(
            "--force-update",
            Date.now().toString(),
          );
          requestAnimationFrame(() => {
            document.documentElement.style.removeProperty("--force-update");
          });
        }
      }, 100);
    },
    [handleThemeSelect],
  );

  return { handleApplyTheme };
}
