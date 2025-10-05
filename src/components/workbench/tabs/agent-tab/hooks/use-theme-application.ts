"use client";

import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import type { ThemeData } from "@/lib/theme-tokens";
import { useThemeContext } from "@/providers/theme";
import { useAgentSessionStore } from "@/stores/agent-session-store";
import { loadGoogleFont } from "@/utils/fonts";
import { FONT_WEIGHTS } from "../constants";

export function useThemeApplication() {
  const { handleThemeSelect } = useThemeContext();
  const { saveCurrentTheme, isAuthenticated, loadUserThemes, selectTheme } =
    useTheme();
  const { firstCreatedThemeId, setFirstCreatedTheme } = useAgentSessionStore();
  const isFirstThemeRef = useRef(true);

  const handleApplyTheme = useCallback(
    async (toolResult: any, isFirstTheme?: boolean) => {
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
        tags: ["ai-generated"],
        rawTheme: extendedRawTheme,
        concept: toolResult.concept,
      };

      // Apply theme to UI
      handleThemeSelect(themeData);

      // Auto-save first theme if authenticated
      if (isFirstTheme && isAuthenticated && !firstCreatedThemeId) {
        try {
          const result = await saveCurrentTheme(
            themeData.name,
            true,
            undefined,
            undefined,
          );

          if (result.success && result.savedTheme?.id) {
            setFirstCreatedTheme(
              result.savedTheme.id,
              result.savedTheme.slug || "",
            );
            await loadUserThemes();

            setTimeout(() => {
              selectTheme(result.savedTheme);

              if (
                result.savedTheme.slug &&
                result.savedTheme.slug !== "default" &&
                result.savedTheme.slug !== "theme"
              ) {
                const newUrl = `/workbench/${result.savedTheme.slug}?tab=agent`;
                window.history.replaceState(null, "", newUrl);
              }
            }, 100);

            toast.success(`"${themeData.name}" saved successfully!`);
          }
        } catch (error) {
          console.error("Error auto-saving first theme:", error);
        }
      }

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
    [
      handleThemeSelect,
      isAuthenticated,
      firstCreatedThemeId,
      saveCurrentTheme,
      setFirstCreatedTheme,
      loadUserThemes,
      selectTheme,
    ],
  );

  return { handleApplyTheme };
}
