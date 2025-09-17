"use client";

import { useCallback } from "react";
import type { ThemeData } from "@/lib/theme-tokens";
import { useThemeContext } from "@/providers/theme";
import { loadGoogleFont } from "@/utils/fonts";
import { FONT_WEIGHTS } from "../constants";

export function useThemeApplication() {
  const { addTheme, handleThemeSelect } = useThemeContext();

  const handleApplyTheme = useCallback(
    async (toolResult: any) => {
      if (!toolResult?.theme) return;

      // Load Google Fonts if they were generated
      if (toolResult.fonts) {
        try {
          // Load all three font families with common weights
          // These run synchronously but won't block the theme application
          loadGoogleFont(toolResult.fonts.sans, FONT_WEIGHTS);
          loadGoogleFont(toolResult.fonts.serif, FONT_WEIGHTS);
          loadGoogleFont(toolResult.fonts.mono, FONT_WEIGHTS);
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
        tags: ["ai-generated", "custom"],
        rawTheme: extendedRawTheme,
      };

      addTheme(themeData);
      handleThemeSelect(themeData);

      // Force DOM update for CSS variables (helps with shadow cache issues)
      setTimeout(() => {
        if (document.documentElement) {
          document.documentElement.style.setProperty(
            "--force-update",
            Date.now().toString()
          );
          // Remove it immediately to trigger a repaint
          requestAnimationFrame(() => {
            document.documentElement.style.removeProperty("--force-update");
          });
        }
      }, 100);
    },
    [addTheme, handleThemeSelect]
  );

  return { handleApplyTheme };
}
