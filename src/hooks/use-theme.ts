"use client";

import { useMemo } from "react";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";

export function useTheme() {
  // Use direct selectors - Zustand will handle memoization
  const themeStore = useThemeStore();
  const authStore = useAuthStore();

  // Memoize combined arrays to prevent infinite re-renders
  const allThemes = useMemo(
    () => [...authStore.userThemes, ...authStore.favoriteThemes],
    [authStore.userThemes, authStore.favoriteThemes]
  );

  return {
    // Core state - direct references (no new objects)
    mounted: themeStore.mounted && authStore.mounted,
    mode: themeStore.mode,
    currentMode: themeStore.mode,
    activeTheme: themeStore.activeTheme,
    editedTokens: themeStore.editedTokens,
    overrides: themeStore.overrides,
    unsavedChanges: themeStore.unsavedChanges,
    isDark: themeStore.isDark,
    currentTokens: themeStore.currentTokens,
    hasEdits: themeStore.hasEdits,
    tinteTheme: themeStore.tinteTheme,
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    userThemes: authStore.userThemes,
    favoriteThemes: authStore.favoriteThemes,
    favorites: authStore.favorites,
    isSaving: authStore.isSaving,
    lastSaved: authStore.lastSaved,

    // Memoized computed values
    allThemes,
    canSave: authStore.isAuthenticated,
    favoritesLoaded: true,
    shadcnOverride: themeStore.overrides.shadcn,
    vscodeOverride: themeStore.overrides.vscode,
    shikiOverride: themeStore.overrides.shiki,

    // Typography and styling properties
    fonts: {
      sans:
        themeStore.currentTokens["font-sans"] ||
        "Inter, ui-sans-serif, system-ui, sans-serif",
      serif:
        themeStore.currentTokens["font-serif"] ||
        'Georgia, Cambria, "Times New Roman", serif',
      mono:
        themeStore.currentTokens["font-mono"] ||
        "JetBrains Mono, ui-monospace, SFMono-Regular, monospace",
    },
    radius: themeStore.currentTokens["radius"] || "0.5rem",
    shadows: {
      color: themeStore.currentTokens["shadow-color"] || "hsl(0 0% 0%)",
      opacity: themeStore.currentTokens["shadow-opacity"] || "0.1",
      blur: themeStore.currentTokens["shadow-blur"] || "4px",
      spread: themeStore.currentTokens["shadow-spread"] || "0px",
      offsetX: themeStore.currentTokens["shadow-offset-x"] || "0px",
      offsetY: themeStore.currentTokens["shadow-offset-y"] || "2px",
    },

    // Export functionality removed to prevent infinite re-renders
    // Use useThemeExport directly in components that need it

    // Store actions - direct references (Zustand handles stability)
    initialize: themeStore.initialize,
    setMode: themeStore.setMode,
    toggleMode: themeStore.toggleMode,
    selectTheme: themeStore.selectTheme,
    editToken: themeStore.editToken,
    resetTokens: themeStore.resetTokens,
    updateTinteTheme: themeStore.updateTinteTheme,
    updateOverride: themeStore.updateOverride,
    resetOverrides: themeStore.resetOverrides,
    markAsSaved: themeStore.markAsSaved,
    loadUserThemes: authStore.loadUserThemes,
    loadFavorites: authStore.loadFavorites,
    toggleFavorite: authStore.toggleFavorite,
    saveTheme: authStore.saveTheme,
    deleteTheme: authStore.deleteTheme,
    addThemes: authStore.addThemes,

    // Legacy aliases
    theme: themeStore.mode,
    setTheme: themeStore.setMode,
    handleModeChange: themeStore.setMode,
    toggleTheme: themeStore.toggleMode,
    handleThemeSelect: themeStore.selectTheme,
    handleTokenEdit: themeStore.editToken,

    // Legacy functions - these should NOT cause re-renders
    getFavoriteStatus: (themeId: string) =>
      authStore.favorites[themeId] ?? false,
    addTheme: (theme: any) => themeStore.selectTheme(theme),
    navigateTheme: (direction: "prev" | "next" | "random") => {
      const currentAllThemes = [
        ...authStore.userThemes,
        ...authStore.favoriteThemes,
      ];
      if (!themeStore.activeTheme || currentAllThemes.length <= 1) return;
      const currentIndex = currentAllThemes.findIndex(
        (t) => t.id === themeStore.activeTheme.id
      );
      let nextTheme;
      switch (direction) {
        case "prev":
          nextTheme =
            currentAllThemes[
              currentIndex <= 0 ? currentAllThemes.length - 1 : currentIndex - 1
            ];
          break;
        case "next":
          nextTheme =
            currentAllThemes[
              currentIndex >= currentAllThemes.length - 1 ? 0 : currentIndex + 1
            ];
          break;
        case "random":
          const available = currentAllThemes.filter(
            (t) => t.id !== themeStore.activeTheme.id
          );
          nextTheme = available[Math.floor(Math.random() * available.length)];
          break;
      }
      if (nextTheme) themeStore.selectTheme(nextTheme);
    },
    updateShadcnOverride: (override: any) =>
      themeStore.updateOverride("shadcn", override),
    updateVscodeOverride: (override: any) =>
      themeStore.updateOverride("vscode", override),
    updateShikiOverride: (override: any) =>
      themeStore.updateOverride("shiki", override),
    saveCurrentTheme: (
      name?: string,
      makePublic?: boolean,
      shadcnOverride?: any
    ) => {
      // Create theme with current overrides from store
      console.log("🔍 [saveCurrentTheme] activeTheme:", themeStore.activeTheme);
      console.log(
        "🔍 [saveCurrentTheme] activeTheme.rawTheme:",
        themeStore.activeTheme?.rawTheme
      );
      console.log(
        "🔍 [saveCurrentTheme] activeTheme.concept:",
        themeStore.activeTheme?.concept
      );

      // Convert ProviderOverride format to ThemeOverrides format
      const convertProviderOverrideToThemeOverrides = (
        providerOverride: any
      ) => {
        if (!providerOverride) return undefined;

        // If it already has light/dark structure, return as is
        if (providerOverride.light || providerOverride.dark) {
          return providerOverride;
        }

        // If it's a ProviderOverride format, convert to ThemeOverrides format
        return {
          light: providerOverride.light,
          dark: providerOverride.dark,
        };
      };

      const themeWithOverrides = {
        ...themeStore.activeTheme,
        rawTheme: themeStore.activeTheme?.rawTheme, // Explicitly preserve rawTheme
        concept: themeStore.activeTheme?.concept, // Explicitly preserve concept
        overrides: {
          ...themeStore.activeTheme.overrides,
          shadcn: convertProviderOverrideToThemeOverrides(
            shadcnOverride || themeStore.overrides.shadcn
          ),
          vscode: convertProviderOverrideToThemeOverrides(
            themeStore.overrides.vscode
          ),
          shiki: convertProviderOverrideToThemeOverrides(
            themeStore.overrides.shiki
          ),
        },
      };

      console.log(
        "🔍 [saveCurrentTheme] themeWithOverrides:",
        themeWithOverrides
      );
      console.log(
        "🔍 [saveCurrentTheme] themeWithOverrides.rawTheme:",
        themeWithOverrides.rawTheme
      );
      console.log(
        "🔍 [saveCurrentTheme] themeWithOverrides.concept:",
        themeWithOverrides.concept
      );

      return authStore.saveTheme(themeWithOverrides, name, makePublic);
    },
  };
}

// Separate stable functions to prevent re-creation
export const useThemeActions = () => {
  const themeStore = useThemeStore();
  const authStore = useAuthStore();

  return useMemo(
    () => ({
      getFavoriteStatus: (themeId: string) =>
        authStore.favorites[themeId] ?? false,
      updateShadcnOverride: (override: any) =>
        themeStore.updateOverride("shadcn", override),
      updateVscodeOverride: (override: any) =>
        themeStore.updateOverride("vscode", override),
      updateShikiOverride: (override: any) =>
        themeStore.updateOverride("shiki", override),
      saveCurrentTheme: (
        name?: string,
        makePublic?: boolean,
        shadcnOverride?: any
      ) => {
        // Create theme with current overrides from store

        // Convert ProviderOverride format to ThemeOverrides format
        const convertProviderOverrideToThemeOverrides = (
          providerOverride: any
        ) => {
          if (!providerOverride) return undefined;

          // If it already has light/dark structure, return as is
          if (providerOverride.light || providerOverride.dark) {
            return providerOverride;
          }

          // If it's a ProviderOverride format, convert to ThemeOverrides format
          return {
            light: providerOverride.light,
            dark: providerOverride.dark,
          };
        };

        const themeWithOverrides = {
          ...themeStore.activeTheme,
          overrides: {
            ...themeStore.activeTheme.overrides,
            shadcn: convertProviderOverrideToThemeOverrides(
              shadcnOverride || themeStore.overrides.shadcn
            ),
            vscode: convertProviderOverrideToThemeOverrides(
              themeStore.overrides.vscode
            ),
            shiki: convertProviderOverrideToThemeOverrides(
              themeStore.overrides.shiki
            ),
          },
        };
        return authStore.saveTheme(themeWithOverrides, name, makePublic);
      },
      addTheme: (theme: any) => themeStore.selectTheme(theme),
      navigateTheme: (direction: "prev" | "next" | "random") => {
        const allThemes = [
          ...authStore.userThemes,
          ...authStore.favoriteThemes,
        ];
        if (!themeStore.activeTheme || allThemes.length <= 1) return;
        const currentIndex = allThemes.findIndex(
          (t) => t.id === themeStore.activeTheme.id
        );
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
          case "random":
            const available = allThemes.filter(
              (t) => t.id !== themeStore.activeTheme.id
            );
            nextTheme = available[Math.floor(Math.random() * available.length)];
            break;
        }
        if (nextTheme) themeStore.selectTheme(nextTheme);
      },
    }),
    [authStore, themeStore]
  );
};
