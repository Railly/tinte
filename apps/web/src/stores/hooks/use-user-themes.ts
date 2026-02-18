"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/stores/auth";

export function useUserThemes() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userThemes = useAuthStore((s) => s.userThemes);
  const favoriteThemes = useAuthStore((s) => s.favoriteThemes);
  const favorites = useAuthStore((s) => s.favorites);
  const isSaving = useAuthStore((s) => s.isSaving);
  const lastSaved = useAuthStore((s) => s.lastSaved);

  const loadUserThemes = useAuthStore((s) => s.loadUserThemes);
  const loadFavorites = useAuthStore((s) => s.loadFavorites);
  const toggleFavorite = useAuthStore((s) => s.toggleFavorite);
  const saveTheme = useAuthStore((s) => s.saveTheme);
  const deleteTheme = useAuthStore((s) => s.deleteTheme);
  const addThemes = useAuthStore((s) => s.addThemes);

  const allThemes = useMemo(
    () => [...userThemes, ...favoriteThemes],
    [userThemes, favoriteThemes],
  );

  const getFavoriteStatus = (themeId: string) => favorites[themeId] ?? false;

  return {
    user,
    isAuthenticated,
    canSave: isAuthenticated,
    userThemes,
    favoriteThemes,
    allThemes,
    favorites,
    favoritesLoaded: true,
    isSaving,
    lastSaved,
    loadUserThemes,
    loadFavorites,
    toggleFavorite,
    saveTheme,
    deleteTheme,
    addThemes,
    getFavoriteStatus,
  };
}
