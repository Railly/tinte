"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authClient } from "@/lib/auth-client";
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
  initialize: () => Promise<void>;
  loadUserThemes: () => Promise<void>;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (themeId: string) => Promise<boolean>;
  saveTheme: (
    theme: ThemeData,
    name?: string,
    makePublic?: boolean,
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

      initialize: async () => {
        try {
          const sessionResult = await authClient.getSession();
          const session = sessionResult.data;
          const user = session?.user || null;
          const isAuthenticated = !!user;

          let userThemes: ThemeData[] = [];
          let favoriteThemes: ThemeData[] = [];
          let favorites: Record<string, boolean> = {};

          if (isAuthenticated) {
            await Promise.all([get().loadUserThemes(), get().loadFavorites()]);

            const state = get();
            userThemes = state.userThemes;
            favoriteThemes = state.favoriteThemes;
            favorites = state.favorites;
          }

          set({
            mounted: true,
            user,
            isAuthenticated,
            userThemes,
            favoriteThemes,
            favorites,
          });
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ mounted: true });
        }
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

      saveTheme: async (theme: ThemeData, name?: string, makePublic = true) => {
        console.log("🚀 [Auth Store] saveTheme called with:", {
          theme,
          name,
          makePublic,
        });
        console.log("🔍 [Auth Store] theme.rawTheme:", theme.rawTheme);
        console.log("🔍 [Auth Store] theme.concept:", theme.concept);

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
            id: theme.id || `theme_${Date.now()}`,
            tags: theme.tags?.filter((tag: string) => tag !== "unsaved") || [
              "custom",
            ],
          };

          // Check if this is an existing theme owned by the user that should be updated
          // Exclude AI-generated themes which should always create new themes
          const isExistingOwnTheme =
            themeToSave.id?.startsWith("theme_") &&
            !themeToSave.id.startsWith("ai-generated-") &&
            (themeToSave.user?.id === user?.id || themeToSave.author === "You");

          if (isExistingOwnTheme) {
            // Update existing theme using PUT
            const response = await fetch(`/api/themes/${themeToSave.id}`, {
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

            console.log("📤 [Auth Store] POST payload being sent:", payload);
            console.log(
              "📤 [Auth Store] themeToSave.rawTheme:",
              themeToSave.rawTheme,
            );
            console.log(
              "📤 [Auth Store] themeToSave.concept:",
              themeToSave.concept,
            );

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
