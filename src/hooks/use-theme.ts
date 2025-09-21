"use client";

import { useEffect } from "react";
import { useThemeExport } from "@/lib/theme-utils";
import { usePersistentThemeStore } from "@/stores/persistent-theme-store";

export function useTheme() {
  const store = usePersistentThemeStore();
  const themeExport = useThemeExport(store.tinteTheme);

  useEffect(() => {
    if (!store.mounted) {
      store.initialize();
    }
  }, [store.mounted, store.initialize]);

  return {
    // Core state
    ...store,

    // Export functionality
    ...themeExport,

    // Legacy compatibility
    theme: store.currentMode,
    setTheme: store.setMode,
    handleModeChange: store.setMode,
    toggleTheme: store.toggleMode,
    handleThemeSelect: store.selectTheme,
    handleTokenEdit: store.editToken,
    resetTokens: store.resetTokens,
    addTheme: store.addTheme,
    navigateTheme: store.navigateTheme,

    // Persistence functionality
    saveCurrentTheme: (name?: string, makePublic?: boolean, additionalShadcnOverride?: any, concept?: string) => store.saveTheme(name, makePublic, additionalShadcnOverride, concept),
    deleteTheme: store.deleteTheme,
    loadUserThemes: store.loadUserThemes,
    createNewTheme: store.createNewTheme,
    duplicateTheme: store.duplicateTheme,
    signInAnonymously: store.signInAnonymously,
    linkAccount: store.linkAccount,
    syncAnonymousThemes: store.syncAnonymousThemes,
    exportTheme: store.exportTheme,
    importTheme: store.importTheme,
    forkTheme: store.forkTheme,

    // Override management
    updateShadcnOverride: store.updateShadcnOverride,
    updateVscodeOverride: store.updateVscodeOverride,
    updateShikiOverride: store.updateShikiOverride,
    resetOverrides: store.resetOverrides,

    // Override data access
    shadcnOverride: store.shadcnOverride,
    vscodeOverride: store.vscodeOverride,
    shikiOverride: store.shikiOverride,

    // Favorites functionality
    favorites: store.favorites,
    favoritesLoaded: store.favoritesLoaded,
    favoriteThemes: store.favoriteThemes,
    toggleFavorite: store.toggleFavorite,
    getFavoriteStatus: store.getFavoriteStatus,
    loadFavorites: store.loadFavorites,
  };
}
