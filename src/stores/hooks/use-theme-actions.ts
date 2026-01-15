"use client";

import { useCallback, useMemo } from "react";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

export function useThemeActions() {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const overrides = useThemeStore((s) => s.overrides);
  const selectTheme = useThemeStore((s) => s.selectTheme);

  const userThemes = useAuthStore((s) => s.userThemes);
  const favoriteThemes = useAuthStore((s) => s.favoriteThemes);
  const saveTheme = useAuthStore((s) => s.saveTheme);

  const allThemes = useMemo(
    () => [...userThemes, ...favoriteThemes],
    [userThemes, favoriteThemes],
  );

  const navigateTheme = useCallback(
    (direction: "prev" | "next" | "random") => {
      if (!activeTheme || allThemes.length <= 1) return;
      const currentIndex = allThemes.findIndex((t) => t.id === activeTheme.id);
      let nextTheme;
      switch (direction) {
        case "prev":
          nextTheme =
            allThemes[
              currentIndex <= 0 ? allThemes.length - 1 : currentIndex - 1
            ];
          break;
        case "next":
          nextTheme =
            allThemes[
              currentIndex >= allThemes.length - 1 ? 0 : currentIndex + 1
            ];
          break;
        case "random": {
          const available = allThemes.filter((t) => t.id !== activeTheme.id);
          nextTheme = available[Math.floor(Math.random() * available.length)];
          break;
        }
      }
      if (nextTheme) selectTheme(nextTheme);
    },
    [activeTheme, allThemes, selectTheme],
  );

  const saveCurrentTheme = useCallback(
    async (
      name?: string,
      makePublic?: boolean,
      shadcnOverride?: any,
      updateThemeId?: string,
    ) => {
      const { denormalizeProviderOverride } = await import(
        "@/lib/provider-utils"
      );

      const convertOverrideForDB = (override: any) => {
        if (!override) return undefined;
        return denormalizeProviderOverride(override);
      };

      const themeWithOverrides = {
        ...activeTheme,
        rawTheme: activeTheme?.rawTheme,
        concept: activeTheme?.concept,
        overrides: {
          ...activeTheme?.overrides,
          shadcn: convertOverrideForDB(shadcnOverride || overrides.shadcn),
          vscode: convertOverrideForDB(overrides.vscode),
          shiki: convertOverrideForDB(overrides.shiki),
          zed: convertOverrideForDB(overrides.zed),
        },
      };

      return saveTheme(themeWithOverrides, name, makePublic, updateThemeId);
    },
    [activeTheme, overrides, saveTheme],
  );

  return {
    navigateTheme,
    saveCurrentTheme,
  };
}
