"use client";

import { useCallback } from "react";
import type { ThemeData } from "@/lib/theme";
import { useActiveTheme } from "@/stores/hooks";
import { loadGoogleFont } from "@/utils/fonts";
import { FONT_WEIGHTS } from "../constants";

export function useThemeApplication() {
  const { selectTheme } = useActiveTheme();

  const handleApplyTheme = useCallback(
    async (toolResult: any) => {
      if (!toolResult?.theme) return;

      // Load Google Fonts if they were generated and wait for them to load
      if (toolResult.fonts) {
        try {
          loadGoogleFont(toolResult.fonts.sans, FONT_WEIGHTS);
          loadGoogleFont(toolResult.fonts.serif, FONT_WEIGHTS);
          loadGoogleFont(toolResult.fonts.mono, FONT_WEIGHTS);

          // Wait for fonts to actually load before applying theme
          if (typeof document !== "undefined" && document.fonts) {
            await Promise.all([
              document.fonts.load(`400 12px "${toolResult.fonts.sans}"`),
              document.fonts.load(`400 12px "${toolResult.fonts.serif}"`),
              document.fonts.load(`400 12px "${toolResult.fonts.mono}"`),
            ]).catch(() => {
              // Fonts failed to load, continue anyway with fallback
              console.warn("Some fonts failed to load");
            });
          }
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
      selectTheme(themeData);

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
    [selectTheme],
  );

  return { handleApplyTheme };
}
