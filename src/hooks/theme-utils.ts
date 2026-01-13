"use client";

import type { AuthStore } from "@/stores/auth";
import type { ThemeStore } from "@/stores/theme";

export function createNavigateTheme(
  themeStore: ThemeStore,
  authStore: AuthStore,
) {
  return (direction: "prev" | "next" | "random") => {
    const allThemes = [...authStore.userThemes, ...authStore.favoriteThemes];
    if (!themeStore.activeTheme || allThemes.length <= 1) return;
    const currentIndex = allThemes.findIndex(
      (t) => t.id === themeStore.activeTheme.id,
    );
    let nextTheme;
    switch (direction) {
      case "prev":
        nextTheme =
          allThemes[currentIndex <= 0 ? allThemes.length - 1 : currentIndex - 1];
        break;
      case "next":
        nextTheme =
          allThemes[currentIndex >= allThemes.length - 1 ? 0 : currentIndex + 1];
        break;
      case "random": {
        const available = allThemes.filter(
          (t) => t.id !== themeStore.activeTheme.id,
        );
        nextTheme = available[Math.floor(Math.random() * available.length)];
        break;
      }
    }
    if (nextTheme) themeStore.selectTheme(nextTheme);
  };
}

export function createSaveCurrentTheme(
  themeStore: ThemeStore,
  authStore: AuthStore,
) {
  return async (
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
      ...themeStore.activeTheme,
      rawTheme: themeStore.activeTheme?.rawTheme,
      concept: themeStore.activeTheme?.concept,
      overrides: {
        ...themeStore.activeTheme.overrides,
        shadcn: convertOverrideForDB(
          shadcnOverride || themeStore.overrides.shadcn,
        ),
        vscode: convertOverrideForDB(themeStore.overrides.vscode),
        shiki: convertOverrideForDB(themeStore.overrides.shiki),
        zed: convertOverrideForDB(themeStore.overrides.zed),
      },
    };

    return authStore.saveTheme(
      themeWithOverrides,
      name,
      makePublic,
      updateThemeId,
    );
  };
}

export function createOverrideUpdaters(themeStore: ThemeStore) {
  return {
    updateShadcnOverride: (override: any) =>
      themeStore.updateOverride("shadcn", override),
    updateVscodeOverride: (override: any) =>
      themeStore.updateOverride("vscode", override),
    updateShikiOverride: (override: any) =>
      themeStore.updateOverride("shiki", override),
    updateZedOverride: (override: any) =>
      themeStore.updateOverride("zed", override),
  };
}
