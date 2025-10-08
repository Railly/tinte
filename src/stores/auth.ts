"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ThemeData } from "@/lib/theme-tokens";

interface AuthState {
  mounted: boolean;
  user: any | null;
  isAuthenticated: boolean;
  userThemes: ThemeData[];
  favoriteThemes: ThemeData[];
  favorites: Record<string, boolean>;
  isSaving: boolean;
  lastSaved: Date | null;
}

interface AuthActions {
  setUser: (user: any | null, isAuthenticated: boolean) => void;
  initialize: () => void;
  loadUserThemes: () => Promise<void>;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (themeId: string) => Promise<boolean>;
  saveTheme: (
    theme: ThemeData,
    name?: string,
    makePublic?: boolean,
    updateThemeId?: string,
  ) => Promise<{ success: boolean; savedTheme: any | null }>;
  deleteTheme: (themeId: string) => Promise<boolean>;
  addThemes: (themes: ThemeData[]) => void;
}

type AuthStore = AuthState & AuthActions;

const sanitizeFavorites = (input: any): Record<string, boolean> => {
  try {
    return Object.fromEntries(
      Object.entries((input || {}) as Record<string, unknown>).map(
        ([key, value]) => [key, !!value],
      ),
    );
  } catch {
    return {};
  }
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      mounted: false,
      user: null,
      isAuthenticated: false,
      userThemes: [],
      favoriteThemes: [],
      favorites: {},
      isSaving: false,
      lastSaved: null,

      setUser: (user: any | null, isAuthenticated: boolean) => {
        set({ user, isAuthenticated });

        if (isAuthenticated && user) {
          get().loadUserThemes();
          get().loadFavorites();
        } else {
          set({
            userThemes: [],
            favoriteThemes: [],
            favorites: {},
          });
        }
      },

      initialize: () => {
        set({ mounted: true });
      },

      loadUserThemes: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;

        try {
          const response = await fetch("/api/themes");
          if (response.ok) {
            const themes = await response.json();
            set({ userThemes: themes });
          }
        } catch (error) {
          console.error("Error loading user themes:", error);
        }
      },

      loadFavorites: async () => {
        const { isAuthenticated, user } = get();
        if (!isAuthenticated || !user?.id) {
          set({ favorites: {} });
          return;
        }

        try {
          const { getUserFavorites } = await import("@/lib/actions/favorites");
          const { favorites } = await getUserFavorites();

          const sanitized = sanitizeFavorites(favorites);
          set({ favorites: sanitized });

          if (typeof window !== "undefined") {
            localStorage.setItem(
              `favorites_${user.id}`,
              JSON.stringify(sanitized),
            );
          }

          const response = await fetch("/api/user/favorites");
          if (response.ok) {
            const favoriteThemes = await response.json();
            set({ favoriteThemes });
          }
        } catch (error) {
          console.error("Error loading favorites:", error);

          if (typeof window !== "undefined" && user?.id) {
            const stored = localStorage.getItem(`favorites_${user.id}`);
            if (stored) {
              try {
                const favorites = sanitizeFavorites(JSON.parse(stored));
                set({ favorites });
              } catch (parseError) {
                console.error(
                  "Error parsing localStorage favorites:",
                  parseError,
                );
              }
            }
          }
        }
      },

      toggleFavorite: async (themeId: string) => {
        const { isAuthenticated, user, favorites } = get();
        if (!isAuthenticated || !user?.id) return false;

        const currentStatus = !!favorites[themeId];
        const newStatus = !currentStatus;
        const newFavorites = { ...favorites, [themeId]: newStatus };

        set({ favorites: newFavorites });

        if (typeof window !== "undefined") {
          localStorage.setItem(
            `favorites_${user.id}`,
            JSON.stringify(newFavorites),
          );
        }

        try {
          const { toggleFavorite } = await import("@/lib/actions/favorites");
          const result = await toggleFavorite(themeId);

          if (!result.success) {
            set({ favorites });
            if (typeof window !== "undefined") {
              localStorage.setItem(
                `favorites_${user.id}`,
                JSON.stringify(favorites),
              );
            }
            return false;
          }

          if (result.isFavorite !== newStatus) {
            const corrected = {
              ...newFavorites,
              [themeId]: !!result.isFavorite,
            };
            set({ favorites: corrected });
            if (typeof window !== "undefined") {
              localStorage.setItem(
                `favorites_${user.id}`,
                JSON.stringify(corrected),
              );
            }
          }

          await get().loadFavorites();
          return true;
        } catch (error) {
          console.error("Error syncing favorite:", error);
          set({ favorites });
          if (typeof window !== "undefined") {
            localStorage.setItem(
              `favorites_${user.id}`,
              JSON.stringify(favorites),
            );
          }
          return false;
        }
      },

      saveTheme: async (
        theme: ThemeData,
        name?: string,
        makePublic = true,
        updateThemeId?: string,
      ) => {
        const { isAuthenticated, user } = get();

        if (!isAuthenticated) {
          return { success: false, savedTheme: null };
        }

        set({ isSaving: true });

        try {
          let cleanName = name || theme.name;
          if (cleanName.includes("(unsaved)")) {
            cleanName = cleanName.replace(" (unsaved)", "");
          }
          if (cleanName === "Custom") {
            cleanName = "My Custom Theme";
          }

          const themeToSave = {
            ...theme,
            name: cleanName,
            tags: theme.tags?.filter((tag: string) => tag !== "unsaved") || [
              "custom",
            ],
          };

          // Check if we should update an existing theme
          // Use explicit updateThemeId if provided, otherwise check if theme has an ID and is owned by user
          const themeIdToUpdate = updateThemeId || themeToSave.id;
          const shouldUpdate =
            themeIdToUpdate &&
            (updateThemeId ||
              themeToSave.user?.id === user?.id ||
              themeToSave.author === "You");

          if (shouldUpdate && themeIdToUpdate) {
            // Update existing theme using PUT
            const response = await fetch(`/api/themes/${themeIdToUpdate}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: cleanName,
                tinteTheme: themeToSave.rawTheme,
                overrides: themeToSave.overrides || {},
                isPublic: makePublic,
                concept: themeToSave.concept,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              const savedTheme = result.theme;
              await get().loadUserThemes();
              set({ lastSaved: new Date() });
              return { success: true, savedTheme };
            }
          } else {
            // Create new theme using POST
            const payload = {
              name: cleanName,
              tinteTheme: themeToSave.rawTheme,
              overrides: themeToSave.overrides || {},
              isPublic: makePublic,
              concept: themeToSave.concept,
            };

            const response = await fetch("/api/themes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (response.ok) {
              const result = await response.json();
              const savedTheme = result.theme;
              await get().loadUserThemes();
              set({ lastSaved: new Date() });
              return { success: true, savedTheme };
            }
          }

          return { success: false, savedTheme: null };
        } catch (error) {
          console.error("Error saving theme:", error);
          return { success: false, savedTheme: null };
        } finally {
          set({ isSaving: false });
        }
      },

      deleteTheme: async (themeId: string) => {
        const { isAuthenticated } = get();

        if (!isAuthenticated) return false;

        try {
          const response = await fetch(`/api/themes/${themeId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            await get().loadUserThemes();
            return true;
          }

          return false;
        } catch (error) {
          console.error("Error deleting theme:", error);
          return false;
        }
      },

      addThemes: (themes: ThemeData[]) => {
        set((state) => {
          // Create a comprehensive deduplication across all theme sources
          const allExistingIds = new Set([
            ...state.userThemes.map((t) => t.id),
            ...state.favoriteThemes.map((t) => t.id),
          ]);

          // Filter out duplicates and also deduplicate within the new themes array
          const uniqueThemes = themes.filter(
            (theme, index, arr) =>
              !allExistingIds.has(theme.id) &&
              arr.findIndex((t) => t.id === theme.id) === index,
          );

          return {
            userThemes: [...state.userThemes, ...uniqueThemes],
          };
        });
      },
    }),
    { name: "auth-store" },
  ),
);
