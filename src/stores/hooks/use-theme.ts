"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import {
  createNavigateTheme,
  createOverrideUpdaters,
  createSaveCurrentTheme,
} from "./theme-utils";

export function useTheme() {
  const themeStore = useThemeStore();
  const authStore = useAuthStore();

  const allThemes = useMemo(
    () => [...authStore.userThemes, ...authStore.favoriteThemes],
    [authStore.userThemes, authStore.favoriteThemes],
  );

  const overrideUpdaters = createOverrideUpdaters(themeStore);
  const navigateTheme = createNavigateTheme(themeStore, authStore);
  const saveCurrentTheme = createSaveCurrentTheme(themeStore, authStore);

  return {
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

    allThemes,
    canSave: authStore.isAuthenticated,
    favoritesLoaded: true,
    shadcnOverride: themeStore.overrides.shadcn,
    vscodeOverride: themeStore.overrides.vscode,
    shikiOverride: themeStore.overrides.shiki,
    zedOverride: themeStore.overrides.zed,

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
    radius: themeStore.currentTokens.radius || "0.5rem",
    shadows: {
      color: themeStore.currentTokens["shadow-color"] || "hsl(0 0% 0%)",
      opacity: themeStore.currentTokens["shadow-opacity"] || "0.1",
      blur: themeStore.currentTokens["shadow-blur"] || "4px",
      spread: themeStore.currentTokens["shadow-spread"] || "0px",
      offsetX: themeStore.currentTokens["shadow-offset-x"] || "0px",
      offsetY: themeStore.currentTokens["shadow-offset-y"] || "2px",
    },

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

    theme: themeStore.mode,
    setTheme: themeStore.setMode,
    handleModeChange: themeStore.setMode,
    toggleTheme: themeStore.toggleMode,
    handleThemeSelect: themeStore.selectTheme,
    handleTokenEdit: themeStore.editToken,

    getFavoriteStatus: (themeId: string) =>
      authStore.favorites[themeId] ?? false,
    addTheme: (theme: any) => themeStore.selectTheme(theme),
    navigateTheme,
    saveCurrentTheme,
    ...overrideUpdaters,
  };
}

export const useThemeActions = () => {
  const themeStore = useThemeStore();
  const authStore = useAuthStore();

  return useMemo(() => {
    const overrideUpdaters = createOverrideUpdaters(themeStore);
    const navigateTheme = createNavigateTheme(themeStore, authStore);
    const saveCurrentTheme = createSaveCurrentTheme(themeStore, authStore);

    return {
      getFavoriteStatus: (themeId: string) =>
        authStore.favorites[themeId] ?? false,
      addTheme: (theme: any) => themeStore.selectTheme(theme),
      navigateTheme,
      saveCurrentTheme,
      ...overrideUpdaters,
    };
  }, [authStore, themeStore]);
};
