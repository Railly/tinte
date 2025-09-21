"use client";

import { useMemo } from "react";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";

export function useTheme() {
  // Use direct selectors - Zustand will handle memoization
  const themeStore = useThemeStore();
  const authStore = useAuthStore();

  // Memoize combined arrays to prevent infinite re-renders
  const allThemes = useMemo(() =>
    [...authStore.userThemes, ...authStore.favoriteThemes],
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
    isAnonymous: authStore.isAnonymous,
    userThemes: authStore.userThemes,
    favoriteThemes: authStore.favoriteThemes,
    favorites: authStore.favorites,
    isSaving: authStore.isSaving,
    lastSaved: authStore.lastSaved,

    // Memoized computed values
    allThemes,
    canSave: authStore.isAuthenticated || authStore.isAnonymous,
    favoritesLoaded: true,
    shadcnOverride: themeStore.overrides.shadcn,
    vscodeOverride: themeStore.overrides.vscode,
    shikiOverride: themeStore.overrides.shiki,

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
    signInAnonymously: authStore.signInAnonymously,
    linkAccount: authStore.linkAccount,
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
    getFavoriteStatus: (themeId: string) => authStore.favorites[themeId] ?? false,
    addTheme: (theme: any) => themeStore.selectTheme(theme),
    navigateTheme: (direction: "prev" | "next" | "random") => {
      const currentAllThemes = [...authStore.userThemes, ...authStore.favoriteThemes];
      if (!themeStore.activeTheme || currentAllThemes.length <= 1) return;
      const currentIndex = currentAllThemes.findIndex(t => t.id === themeStore.activeTheme.id);
      let nextTheme;
      switch (direction) {
        case "prev":
          nextTheme = currentAllThemes[currentIndex <= 0 ? currentAllThemes.length - 1 : currentIndex - 1];
          break;
        case "next":
          nextTheme = currentAllThemes[currentIndex >= currentAllThemes.length - 1 ? 0 : currentIndex + 1];
          break;
        case "random":
          const available = currentAllThemes.filter(t => t.id !== themeStore.activeTheme.id);
          nextTheme = available[Math.floor(Math.random() * available.length)];
          break;
      }
      if (nextTheme) themeStore.selectTheme(nextTheme);
    },
    updateShadcnOverride: (override: any) => themeStore.updateOverride("shadcn", override),
    updateVscodeOverride: (override: any) => themeStore.updateOverride("vscode", override),
    updateShikiOverride: (override: any) => themeStore.updateOverride("shiki", override),
    saveCurrentTheme: (name?: string, makePublic?: boolean) => authStore.saveTheme(themeStore.activeTheme, name, makePublic),
    syncAnonymousThemes: () => authStore.initialize(),
  };
}

// Separate stable functions to prevent re-creation
export const useThemeActions = () => {
  const themeStore = useThemeStore();
  const authStore = useAuthStore();

  return useMemo(() => ({
    getFavoriteStatus: (themeId: string) => authStore.favorites[themeId] ?? false,
    updateShadcnOverride: (override: any) => themeStore.updateOverride("shadcn", override),
    updateVscodeOverride: (override: any) => themeStore.updateOverride("vscode", override),
    updateShikiOverride: (override: any) => themeStore.updateOverride("shiki", override),
    saveCurrentTheme: (name?: string, makePublic?: boolean) => authStore.saveTheme(themeStore.activeTheme, name, makePublic),
    addTheme: (theme: any) => themeStore.selectTheme(theme),
    syncAnonymousThemes: () => authStore.initialize(),
    navigateTheme: (direction: "prev" | "next" | "random") => {
      const allThemes = [...authStore.userThemes, ...authStore.favoriteThemes];
      if (!themeStore.activeTheme || allThemes.length <= 1) return;
      const currentIndex = allThemes.findIndex(t => t.id === themeStore.activeTheme.id);
      let nextTheme;
      switch (direction) {
        case "prev":
          nextTheme = allThemes[currentIndex <= 0 ? allThemes.length - 1 : currentIndex - 1];
          break;
        case "next":
          nextTheme = allThemes[currentIndex >= allThemes.length - 1 ? 0 : currentIndex + 1];
          break;
        case "random":
          const available = allThemes.filter(t => t.id !== themeStore.activeTheme.id);
          nextTheme = available[Math.floor(Math.random() * available.length)];
          break;
      }
      if (nextTheme) themeStore.selectTheme(nextTheme);
    },
  }), [authStore, themeStore]);
};
