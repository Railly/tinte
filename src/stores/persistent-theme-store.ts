"use client";

import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { authClient } from "@/lib/auth-client";
import { shadcnToTinte } from "@/lib/shadcn-to-tinte";
import type { ThemeData } from "@/lib/theme-tokens";
import type { ShadcnTheme } from "@/types/shadcn";
import type { TinteBlock, TinteTheme } from "@/types/tinte";
// All static preset imports removed - theme data now comes from database
import { DEFAULT_THEME } from "@/utils/default-theme";

// Import refactored modules
import type { ThemeMode, ThemeOverrides } from "./theme/types";
import {
  computeThemeTokens,
  computeProcessedTokens,
  convertColorToHex,
  applyProcessedTokensToDOM,
} from "./theme/utils/theme-computation";
import {
  getThemeOwnershipInfo,
  createUpdatedThemeForEdit,
} from "./theme/utils/theme-ownership";
import {
  loadFromStorage,
  saveToStorage,
  loadAnonymousThemes,
} from "./theme/utils/storage";
import {
  createOverrideHandler,
  createResetOverridesHandler,
} from "./theme/overrides";
import { createPersistenceActions } from "./theme/actions/persistence-actions";
import { createThemeActions } from "./theme/actions/theme-actions";

interface PersistentThemeState {
  // Core state
  mounted: boolean;
  currentMode: ThemeMode;
  activeTheme: ThemeData;
  editedTokens: Record<string, string>;

  // User state
  user: any | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;

  // Theme persistence
  savedThemes: ThemeData[];
  unsavedChanges: boolean;
  isSaving: boolean;
  lastSaved: Date | null;

  // Favorites state
  favorites: Record<string, boolean>;
  favoritesLoaded: boolean;

  // Computed state
  isDark: boolean;
  currentTokens: Record<string, string>;
  hasEdits: boolean;
  canSave: boolean;

  // Theme collections
  allThemes: ThemeData[];
  tweakcnThemes: ThemeData[];
  raysoThemes: ThemeData[];
  tinteThemes: ThemeData[];
  userThemes: ThemeData[];
  favoriteThemes: ThemeData[];
  tinteTheme: TinteTheme;

  // Provider overrides
  shadcnOverride: any | null;
  vscodeOverride: any | null;
  shikiOverride: any | null;

  // Actions
  initialize: () => Promise<void>;
  setMode: (mode: ThemeMode) => void;
  toggleMode: (coords?: { x: number; y: number }) => void;
  selectTheme: (theme: ThemeData) => void;
  editToken: (key: string, value: string) => void;
  resetTokens: () => void;
  navigateTheme: (direction: "prev" | "next" | "random") => void;
  updateTinteTheme: (mode: ThemeMode, updates: Partial<TinteBlock>) => void;

  // Override actions (now unified)
  updateShadcnOverride: (override: any) => void;
  updateVscodeOverride: (override: any) => void;
  updateShikiOverride: (override: any) => void;
  resetOverrides: (provider?: "shadcn" | "vscode" | "shiki") => void;

  // Persistence actions
  saveTheme: (name?: string, makePublic?: boolean, additionalShadcnOverride?: any, concept?: string) => Promise<{ success: boolean; savedTheme: any | null }>;
  deleteTheme: (themeId: string) => Promise<boolean>;
  loadUserThemes: () => Promise<void>;
  createNewTheme: (name: string) => void;
  duplicateTheme: (theme: ThemeData, name: string) => void;

  // Anonymous user actions
  signInAnonymously: () => Promise<void>;
  linkAccount: () => Promise<void>;
  syncAnonymousThemes: () => Promise<void>;

  // Utility actions
  exportTheme: (format: string) => string;
  importTheme: (themeData: any, format: string) => boolean;
  addTheme: (theme: ThemeData) => void;
  forkTheme: (theme: ThemeData, newName?: string) => void;

  // Favorites actions
  toggleFavorite: (themeId: string) => Promise<boolean>;
  getFavoriteStatus: (themeId: string) => boolean;
  loadFavorites: () => Promise<void>;
}

// Simplified initial state computation
const getInitialState = () => {
  const { theme, mode } = loadFromStorage();
  const computedTokens = computeThemeTokens(theme);
  const baseTokens = computedTokens[mode];
  const processedTokens: Record<string, string> = {};

  // Populate with base tokens
  for (const [key, value] of Object.entries(baseTokens)) {
    if (typeof value === "string") {
      processedTokens[key] = convertColorToHex(value);
    }
  }

  // Apply overrides from storage
  const themeOverrides = (theme as any).overrides || {};
  const overrides: ThemeOverrides = {
    shadcn: themeOverrides.shadcn ?? undefined,
    vscode: themeOverrides.vscode ?? undefined,
    shiki: themeOverrides.shiki ?? undefined,
  };

  if (overrides.shadcn?.[mode]) {
    Object.entries(overrides.shadcn[mode]).forEach(([key, value]) => {
      if (typeof value === "string") {
        processedTokens[key] = convertColorToHex(value);
      }
    });
  }

  // Extract TinteTheme
  let tinteTheme: TinteTheme;
  if (theme?.rawTheme && typeof theme.rawTheme === "object") {
    if ("light" in theme.rawTheme && "dark" in theme.rawTheme) {
      const possibleTinte = theme.rawTheme as TinteTheme;
      if (possibleTinte.light.tx && possibleTinte.light.ui) {
        tinteTheme = possibleTinte;
      } else {
        tinteTheme = shadcnToTinte(theme.rawTheme as ShadcnTheme);
      }
    } else {
      tinteTheme = shadcnToTinte(theme.rawTheme as ShadcnTheme);
    }
  } else if (theme && "light_bg" in theme && "dark_bg" in theme) {
    // Database theme with flat structure
    const flatTheme = theme as any;
    tinteTheme = {
      light: {
        bg: flatTheme.light_bg,
        bg_2: flatTheme.light_bg_2,
        ui: flatTheme.light_ui,
        ui_2: flatTheme.light_ui_2,
        ui_3: flatTheme.light_ui_3,
        tx: flatTheme.light_tx,
        tx_2: flatTheme.light_tx_2,
        tx_3: flatTheme.light_tx_3,
        pr: flatTheme.light_pr,
        sc: flatTheme.light_sc,
        ac_1: flatTheme.light_ac_1,
        ac_2: flatTheme.light_ac_2,
        ac_3: flatTheme.light_ac_3,
      },
      dark: {
        bg: flatTheme.dark_bg,
        bg_2: flatTheme.dark_bg_2,
        ui: flatTheme.dark_ui,
        ui_2: flatTheme.dark_ui_2,
        ui_3: flatTheme.dark_ui_3,
        tx: flatTheme.dark_tx,
        tx_2: flatTheme.dark_tx_2,
        tx_3: flatTheme.dark_tx_3,
        pr: flatTheme.dark_pr,
        sc: flatTheme.dark_sc,
        ac_1: flatTheme.dark_ac_1,
        ac_2: flatTheme.dark_ac_2,
        ac_3: flatTheme.dark_ac_3,
      },
    };
  } else {
    tinteTheme = DEFAULT_THEME.rawTheme as TinteTheme;
  }

  return {
    mounted: false,
    currentMode: mode,
    activeTheme: theme,
    editedTokens: {},
    user: null,
    isAuthenticated: false,
    isAnonymous: false,
    savedThemes: [],
    unsavedChanges: false,
    isSaving: false,
    lastSaved: null,
    isDark: mode === "dark",
    currentTokens: processedTokens,
    hasEdits: false,
    canSave: false,
    allThemes: [
      theme.id === DEFAULT_THEME.id ? DEFAULT_THEME : theme,
      DEFAULT_THEME,
    ],
    tweakcnThemes: [],
    raysoThemes: [],
    tinteThemes: [],
    userThemes: [],
    favoriteThemes: [],
    tinteTheme,
    shadcnOverride: overrides.shadcn,
    vscodeOverride: overrides.vscode,
    shikiOverride: overrides.shiki,
    favorites: {},
    favoritesLoaded: false,
  };
};

export const usePersistentThemeStore = create<PersistentThemeState>()(
  devtools(
    subscribeWithSelector((set, get) => {
      const sanitizeFavorites = (input: any): Record<string, boolean> => {
        try {
          return Object.fromEntries(
            Object.entries((input || {}) as Record<string, unknown>).map(
              ([key, value]) => [key, !!value]
            )
          );
        } catch {
          return {};
        }
      };
      // Create override handlers using the factory
      const updateShadcnOverride = createOverrideHandler("shadcn", get, set);
      const updateVscodeOverride = createOverrideHandler("vscode", get, set);
      const updateShikiOverride = createOverrideHandler("shiki", get, set);
      const resetOverrides = createResetOverridesHandler(get, set);

      return {
        // Initial state
        ...getInitialState(),

        // Actions
        initialize: async () => {
          const { theme, mode } = loadFromStorage();
          const currentState = get();

          // Skip reapplying theme if already applied
          const themeAlreadyApplied =
            theme.id === currentState.activeTheme.id &&
            mode === currentState.currentMode &&
            typeof window !== "undefined" &&
            (window as any).__TINTE_THEME__?.theme?.id === theme.id;

          // Get auth session
          const sessionResult = await authClient.getSession();
          const session = sessionResult.data;
          const user = session?.user || null;
          const isAuthenticated = !!user && !user.isAnonymous;
          const isAnonymous = !!user?.isAnonymous;

          // Load theme collections from database (empty arrays for now)
          // These will be populated by passing props from server components
          const tweakcnThemes: ThemeData[] = [];
          const raysoThemes: ThemeData[] = [];
          const tinteThemes: ThemeData[] = [];

          // Load user themes
          let userThemes: ThemeData[] = [];
          if (isAuthenticated) {
            try {
              const response = await fetch("/api/user/themes");
              if (response.ok) {
                userThemes = await response.json();
              }
            } catch (error) {
              console.error("Error loading user themes:", error);
            }
          } else if (isAnonymous) {
            userThemes = loadAnonymousThemes();
          }

          // Load favorite themes
          let favoriteThemes: ThemeData[] = [];
          if (isAuthenticated) {
            try {
              const response = await fetch("/api/user/favorites");
              if (response.ok) {
                favoriteThemes = await response.json();
              }
            } catch (error) {
              console.error("Error loading favorite themes:", error);
            }
          }

          // Load favorites: DB as source of truth, localStorage as initial fallback
          let favorites: Record<string, boolean> = {};
          if (isAuthenticated && user?.id) {
            // First, try localStorage as initial state
            if (typeof window !== "undefined") {
              const stored = localStorage.getItem(`favorites_${user.id}`);
              if (stored) {
                try {
                  favorites = sanitizeFavorites(JSON.parse(stored));
                } catch (error) {
                  console.error(
                    "Error parsing favorites from localStorage:",
                    error
                  );
                }
              }
            }

            // Then fetch from DB to get authoritative state
            try {
              const { getUserFavorites } = await import(
                "@/lib/actions/favorites"
              );
              const dbResult = await getUserFavorites();
              if (dbResult.favorites) {
                favorites = sanitizeFavorites(dbResult.favorites);
                // Update localStorage with DB state
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    `favorites_${user.id}`,
                    JSON.stringify(favorites)
                  );
                }
              }
            } catch (error) {
              console.error("Error loading favorites from DB:", error);
              // Keep localStorage state as fallback
            }
          }

          const allThemes = [
            DEFAULT_THEME,
            ...tinteThemes,
            ...raysoThemes,
            ...tweakcnThemes,
            ...userThemes,
          ].filter(
            (theme, index, arr) =>
              arr.findIndex((t) => t.id === theme.id) === index
          );

          // Resolve theme priority (simplified)
          let finalTheme = theme;
          if (isAuthenticated && theme.id) {
            const dbTheme = userThemes.find((t) => t.id === theme.id);
            if (dbTheme) {
              const localEditTimestamp = (theme as any).lastEditTimestamp;
              if (!localEditTimestamp) {
                finalTheme = dbTheme;
              }
            }
          }

          // Compute final tokens
          const themeOverrides = (finalTheme as any).overrides || {};
          const overrides: ThemeOverrides = {
            shadcn: themeOverrides.shadcn ?? undefined,
            vscode: themeOverrides.vscode ?? undefined,
            shiki: themeOverrides.shiki ?? undefined,
          };

          const processedTokens = computeProcessedTokens(
            finalTheme,
            mode,
            overrides
          );

          // Extract TinteTheme (same logic as initial state)
          let tinteTheme: TinteTheme;
          if (finalTheme?.rawTheme && typeof finalTheme.rawTheme === "object") {
            if (
              "light" in finalTheme.rawTheme &&
              "dark" in finalTheme.rawTheme
            ) {
              const possibleTinte = finalTheme.rawTheme as TinteTheme;
              if (possibleTinte.light.tx && possibleTinte.light.ui) {
                tinteTheme = possibleTinte;
              } else {
                tinteTheme = shadcnToTinte(finalTheme.rawTheme as ShadcnTheme);
              }
            } else {
              tinteTheme = shadcnToTinte(finalTheme.rawTheme as ShadcnTheme);
            }
          } else if (
            finalTheme &&
            "light_bg" in finalTheme &&
            "dark_bg" in finalTheme
          ) {
            const flatTheme = finalTheme as any;
            tinteTheme = {
              light: {
                bg: flatTheme.light_bg,
                bg_2: flatTheme.light_bg_2,
                ui: flatTheme.light_ui,
                ui_2: flatTheme.light_ui_2,
                ui_3: flatTheme.light_ui_3,
                tx: flatTheme.light_tx,
                tx_2: flatTheme.light_tx_2,
                tx_3: flatTheme.light_tx_3,
                pr: flatTheme.light_pr,
                sc: flatTheme.light_sc,
                ac_1: flatTheme.light_ac_1,
                ac_2: flatTheme.light_ac_2,
                ac_3: flatTheme.light_ac_3,
              },
              dark: {
                bg: flatTheme.dark_bg,
                bg_2: flatTheme.dark_bg_2,
                ui: flatTheme.dark_ui,
                ui_2: flatTheme.dark_ui_2,
                ui_3: flatTheme.dark_ui_3,
                tx: flatTheme.dark_tx,
                tx_2: flatTheme.dark_tx_2,
                tx_3: flatTheme.dark_tx_3,
                pr: flatTheme.dark_pr,
                sc: flatTheme.dark_sc,
                ac_1: flatTheme.dark_ac_1,
                ac_2: flatTheme.dark_ac_2,
                ac_3: flatTheme.dark_ac_3,
              },
            };
          } else {
            tinteTheme = DEFAULT_THEME.rawTheme as TinteTheme;
          }

          set({
            mounted: true,
            currentMode: mode,
            activeTheme: finalTheme,
            user,
            isAuthenticated,
            isAnonymous,
            isDark: mode === "dark",
            currentTokens: processedTokens,
            hasEdits: false,
            unsavedChanges: false,
            canSave: isAuthenticated || isAnonymous,
            allThemes,
            tweakcnThemes,
            raysoThemes,
            tinteThemes,
            userThemes,
            favoriteThemes,
            tinteTheme,
            shadcnOverride: overrides.shadcn,
            vscodeOverride: overrides.vscode,
            shikiOverride: overrides.shiki,
            favorites,
            favoritesLoaded: true,
          });

          // Apply to DOM if needed
          if (!themeAlreadyApplied) {
            applyProcessedTokensToDOM(finalTheme, mode, processedTokens);
          }

          saveToStorage(finalTheme, mode, overrides, false);
        },

        setMode: (mode) => {
          const { activeTheme } = get();

          set((state) => {
            const overrides: ThemeOverrides = {
              shadcn: state.shadcnOverride,
              vscode: state.vscodeOverride,
              shiki: state.shikiOverride,
            };

            const processedTokens = computeProcessedTokens(
              activeTheme,
              mode,
              overrides
            );

            return {
              currentMode: mode,
              isDark: mode === "dark",
              currentTokens: { ...processedTokens, ...state.editedTokens },
              unsavedChanges: state.hasEdits,
            };
          });

          const {
            shadcnOverride,
            vscodeOverride,
            shikiOverride,
            currentTokens,
          } = get();
          saveToStorage(
            activeTheme,
            mode,
            {
              shadcn: shadcnOverride,
              vscode: vscodeOverride,
              shiki: shikiOverride,
            },
            false
          );
          applyProcessedTokensToDOM(activeTheme, mode, currentTokens);
        },

        toggleMode: (coords) => {
          const { currentMode } = get();
          const newMode = currentMode === "light" ? "dark" : "light";

          if (typeof window === "undefined") {
            get().setMode(newMode);
            return;
          }

          const root = document.documentElement;
          const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

          if (!document.startViewTransition || prefersReducedMotion) {
            get().setMode(newMode);
            return;
          }

          if (coords) {
            root.style.setProperty("--x", `${coords.x}px`);
            root.style.setProperty("--y", `${coords.y}px`);
          }

          document.startViewTransition(() => {
            get().setMode(newMode);
          });
        },

        selectTheme: (theme) => {
          const { currentMode, allThemes, isAuthenticated } = get();

          // Simplified theme priority resolution
          let finalTheme = theme;
          let hasUnsyncedChanges = false;

          if (isAuthenticated && theme.id && typeof window !== "undefined") {
            try {
              const storedTheme = localStorage.getItem("tinte-selected-theme");
              if (storedTheme) {
                const localTheme = JSON.parse(storedTheme);
                if (
                  localTheme.id === theme.id &&
                  localTheme.lastEditTimestamp
                ) {
                  const selectedTimestamp =
                    (theme as any).updatedAt || theme.createdAt;
                  if (
                    !selectedTimestamp ||
                    new Date(localTheme.lastEditTimestamp).getTime() >
                      new Date(selectedTimestamp).getTime()
                  ) {
                    finalTheme = localTheme;
                    hasUnsyncedChanges = true;
                  }
                }
              }
            } catch (error) {
              console.warn("Error checking localStorage theme:", error);
            }
          }

          // Navigate to workbench with theme ID, preserving query parameters
          if (typeof window !== "undefined" && theme.id) {
            const currentPath = window.location.pathname;
            if (currentPath.startsWith("/workbench/")) {
              import("next/navigation").then(({ useRouter }) => {
                try {
                  // Preserve existing query parameters
                  const currentSearch = window.location.search;
                  const newUrl = `/workbench/${theme.id}${currentSearch}`;
                  window.history.replaceState(null, "", newUrl);
                } catch (error) {
                  console.warn("Error updating URL:", error);
                }
              });
            }
          }

          set((state) => {
            const themeOverrides = (finalTheme as any).overrides || {};
            const overrides: ThemeOverrides = {
              shadcn: themeOverrides.shadcn || null,
              vscode: themeOverrides.vscode || null,
              shiki: themeOverrides.shiki || null,
            };

            const processedTokens = computeProcessedTokens(
              finalTheme,
              currentMode,
              overrides
            );

            // Extract TinteTheme (same logic as before)
            let tinteTheme: TinteTheme;
            if (
              finalTheme?.rawTheme &&
              typeof finalTheme.rawTheme === "object"
            ) {
              if (
                "light" in finalTheme.rawTheme &&
                "dark" in finalTheme.rawTheme
              ) {
                const possibleTinte = finalTheme.rawTheme as TinteTheme;
                if (possibleTinte.light.tx && possibleTinte.light.ui) {
                  tinteTheme = possibleTinte;
                } else {
                  tinteTheme = shadcnToTinte(
                    finalTheme.rawTheme as ShadcnTheme
                  );
                }
              } else {
                tinteTheme = shadcnToTinte(finalTheme.rawTheme as ShadcnTheme);
              }
            } else if (
              finalTheme &&
              "light_bg" in finalTheme &&
              "dark_bg" in finalTheme
            ) {
              const flatTheme = finalTheme as any;
              tinteTheme = {
                light: {
                  bg: flatTheme.light_bg,
                  bg_2: flatTheme.light_bg_2,
                  ui: flatTheme.light_ui,
                  ui_2: flatTheme.light_ui_2,
                  ui_3: flatTheme.light_ui_3,
                  tx: flatTheme.light_tx,
                  tx_2: flatTheme.light_tx_2,
                  tx_3: flatTheme.light_tx_3,
                  pr: flatTheme.light_pr,
                  sc: flatTheme.light_sc,
                  ac_1: flatTheme.light_ac_1,
                  ac_2: flatTheme.light_ac_2,
                  ac_3: flatTheme.light_ac_3,
                },
                dark: {
                  bg: flatTheme.dark_bg,
                  bg_2: flatTheme.dark_bg_2,
                  ui: flatTheme.dark_ui,
                  ui_2: flatTheme.dark_ui_2,
                  ui_3: flatTheme.dark_ui_3,
                  tx: flatTheme.dark_tx,
                  tx_2: flatTheme.dark_tx_2,
                  tx_3: flatTheme.dark_tx_3,
                  pr: flatTheme.dark_pr,
                  sc: flatTheme.dark_sc,
                  ac_1: flatTheme.dark_ac_1,
                  ac_2: flatTheme.dark_ac_2,
                  ac_3: flatTheme.dark_ac_3,
                },
              };
            } else {
              tinteTheme = DEFAULT_THEME.rawTheme as TinteTheme;
            }

            const updatedAllThemes = [...allThemes];
            const existingThemeIndex = allThemes.findIndex(
              (t) => t.id === finalTheme.id
            );
            if (existingThemeIndex === -1) {
              updatedAllThemes.push(finalTheme);
            } else {
              updatedAllThemes[existingThemeIndex] = finalTheme;
            }

            return {
              activeTheme: finalTheme,
              allThemes: updatedAllThemes,
              currentTokens: processedTokens,
              editedTokens: {},
              hasEdits: hasUnsyncedChanges,
              unsavedChanges: hasUnsyncedChanges,
              tinteTheme,
              shadcnOverride: overrides.shadcn,
              vscodeOverride: overrides.vscode,
              shikiOverride: overrides.shiki,
            };
          });

          const {
            shadcnOverride,
            vscodeOverride,
            shikiOverride,
            currentTokens,
          } = get();
          saveToStorage(
            finalTheme,
            currentMode,
            {
              shadcn: shadcnOverride,
              vscode: vscodeOverride,
              shiki: shikiOverride,
            },
            false
          );
          applyProcessedTokensToDOM(finalTheme, currentMode, currentTokens);
        },

        editToken: (key, value) => {
          const processedValue =
            key.includes("font") ||
            key.includes("shadow") ||
            key === "radius" ||
            key === "spacing" ||
            key === "letter-spacing"
              ? value
              : convertColorToHex(value);

          set((state) => {
            const ownership = getThemeOwnershipInfo(
              state.activeTheme,
              state.user
            );
            const updatedActiveTheme = createUpdatedThemeForEdit(
              state.activeTheme,
              state.user,
              ownership
            );

            return {
              editedTokens: { ...state.editedTokens, [key]: processedValue },
              currentTokens: { ...state.currentTokens, [key]: processedValue },
              activeTheme: updatedActiveTheme,
              hasEdits: true,
              unsavedChanges: true,
            };
          });

          if (typeof window !== "undefined") {
            document.documentElement.style.setProperty(
              `--${key}`,
              processedValue
            );
          }
        },

        resetTokens: () => {
          const { activeTheme, currentMode } = get();

          set(() => {
            const overrides: ThemeOverrides = {
              shadcn: undefined,
              vscode: undefined,
              shiki: undefined,
            };
            const processedTokens = computeProcessedTokens(
              activeTheme,
              currentMode,
              overrides
            );

            return {
              editedTokens: {},
              currentTokens: processedTokens,
              hasEdits: false,
              unsavedChanges: false,
              shadcnOverride: undefined,
              vscodeOverride: undefined,
              shikiOverride: undefined,
            };
          });

          const { currentTokens } = get();
          applyProcessedTokensToDOM(activeTheme, currentMode, currentTokens);
        },

        updateTinteTheme: (mode, updates) => {
          set((state: PersistentThemeState) => {
            const newTinteTheme = {
              ...state.tinteTheme,
              [mode]: {
                ...state.tinteTheme[mode],
                ...updates,
              },
            };

            const ownership = getThemeOwnershipInfo(
              state.activeTheme,
              state.user
            );
            let updatedTheme;

            if (ownership.isUserOwnedTheme) {
              // For own themes, ensure we show "(unsaved)" to indicate edits
              let themeName = state.activeTheme.name;
              if (!themeName.includes("(unsaved)")) {
                themeName =
                  themeName === "Custom"
                    ? "Custom (unsaved)"
                    : `${themeName} (unsaved)`;
              }
              updatedTheme = {
                ...state.activeTheme,
                rawTheme: newTinteTheme,
                name: themeName,
              };
            } else {
              updatedTheme = {
                id: `custom_${Date.now()}`,
                name: "Custom (unsaved)",
                description: "Custom theme with modifications",
                author: "You",
                provider: "tinte" as const,
                downloads: 0,
                likes: 0,
                installs: 0,
                tags: ["custom", "unsaved"],
                createdAt: new Date().toISOString(),
                colors: {
                  primary: newTinteTheme.light.pr,
                  secondary: newTinteTheme.light.sc,
                  accent: newTinteTheme.light.ac_1,
                  foreground: newTinteTheme.light.tx,
                  background: newTinteTheme.light.bg,
                },
                rawTheme: newTinteTheme,
                user: state.user
                  ? {
                      id: state.user.id,
                      name: state.user.name,
                      email: state.user.email,
                      image: state.user.image,
                    }
                  : null,
              };
            }

            delete (updatedTheme as any).computedTokens;

            const overrides: ThemeOverrides = {
              shadcn: state.shadcnOverride,
              vscode: state.vscodeOverride,
              shiki: state.shikiOverride,
            };

            const processedTokens = computeProcessedTokens(
              updatedTheme,
              state.currentMode,
              overrides
            );

            // Handle tweakcn conversion if needed
            let finalActiveTheme = updatedTheme;
            if (
              state.activeTheme.author === "tweakcn" &&
              !ownership.isUserOwnedTheme
            ) {
              const {
                convertTinteToShadcn,
              } = require("@/lib/providers/shadcn");
              const convertedShadcnTheme = convertTinteToShadcn(newTinteTheme);
              finalActiveTheme = {
                ...updatedTheme,
                rawTheme: convertedShadcnTheme,
              };
            }

            return {
              tinteTheme: newTinteTheme,
              activeTheme: finalActiveTheme,
              currentTokens: processedTokens,
              hasEdits: true,
              unsavedChanges: true,
            };
          });

          const {
            activeTheme,
            currentMode,
            shadcnOverride,
            vscodeOverride,
            shikiOverride,
            currentTokens,
          } = get();
          saveToStorage(
            activeTheme,
            currentMode,
            {
              shadcn: shadcnOverride,
              vscode: vscodeOverride,
              shiki: shikiOverride,
            },
            true
          );
          applyProcessedTokensToDOM(activeTheme, currentMode, currentTokens);
        },

        navigateTheme: (direction) => {
          const { activeTheme, allThemes } = get();
          if (!activeTheme || allThemes.length <= 1) return;

          const currentIndex = allThemes.findIndex(
            (t) => t.id === activeTheme.id
          );
          let nextTheme: ThemeData;

          switch (direction) {
            case "prev": {
              const prevIndex =
                currentIndex <= 0 ? allThemes.length - 1 : currentIndex - 1;
              nextTheme = allThemes[prevIndex];
              break;
            }
            case "next": {
              const nextIndex =
                currentIndex >= allThemes.length - 1 ? 0 : currentIndex + 1;
              nextTheme = allThemes[nextIndex];
              break;
            }
            case "random": {
              const availableThemes = allThemes.filter(
                (t) => t.id !== activeTheme.id
              );
              const randomIndex = Math.floor(
                Math.random() * availableThemes.length
              );
              nextTheme = availableThemes[randomIndex];
              break;
            }
            default:
              return;
          }

          if (nextTheme) {
            get().selectTheme(nextTheme);
          }
        },

        // Use the factory-created handlers
        updateShadcnOverride,
        updateVscodeOverride,
        updateShikiOverride,
        resetOverrides,

        // Persistence actions
        ...createPersistenceActions(get, set),

        // Theme actions
        ...createThemeActions(get, set),

        // Favorites actions
        getFavoriteStatus: (themeId: string) => {
          const { favorites } = get();
          return favorites[themeId] ?? false;
        },

        loadFavorites: async () => {
          const { isAuthenticated, user } = get();

          if (!isAuthenticated || !user?.id) {
            set({ favorites: {}, favoritesLoaded: true });
            return;
          }

          try {
            const { getUserFavorites } = await import(
              "@/lib/actions/favorites"
            );
            const { favorites } = await getUserFavorites();

            // Update state and localStorage
            set({
              favorites: sanitizeFavorites(favorites),
              favoritesLoaded: true,
            });
            if (typeof window !== "undefined") {
              localStorage.setItem(
                `favorites_${user.id}`,
                JSON.stringify(favorites)
              );
            }
          } catch (error) {
            console.error("Error loading favorites from DB:", error);
            // Fallback to localStorage
            if (typeof window !== "undefined") {
              const stored = localStorage.getItem(`favorites_${user.id}`);
              if (stored) {
                try {
                  const favorites = sanitizeFavorites(JSON.parse(stored));
                  set({ favorites, favoritesLoaded: true });
                } catch (parseError) {
                  console.error(
                    "Error parsing localStorage favorites:",
                    parseError
                  );
                  set({ favorites: {}, favoritesLoaded: true });
                }
              } else {
                set({ favorites: {}, favoritesLoaded: true });
              }
            } else {
              set({ favorites: {}, favoritesLoaded: true });
            }
          }
        },

        toggleFavorite: async (themeId: string) => {
          const { isAuthenticated, user, favorites } = get();

          if (!isAuthenticated || !user?.id) {
            return false;
          }

          const currentStatus = !!favorites[themeId];
          const newStatus = !currentStatus;

          // Immediate optimistic update in both state and localStorage
          const newFavorites = { ...favorites, [themeId]: newStatus };
          set({ favorites: newFavorites });

          // Immediately persist to localStorage for instant availability
          if (typeof window !== "undefined") {
            localStorage.setItem(
              `favorites_${user.id}`,
              JSON.stringify(newFavorites)
            );
          }

          // Sync with DB in background
          try {
            const { toggleFavorite } = await import("@/lib/actions/favorites");
            const result = await toggleFavorite(themeId);

            if (!result.success) {
              // Revert optimistic update on error
              set({ favorites });
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  `favorites_${user.id}`,
                  JSON.stringify(favorites)
                );
              }
              return false;
            }

            // Verify result matches our optimistic update
            if (result.isFavorite !== newStatus) {
              const correctedFavorites = {
                ...newFavorites,
                [themeId]: !!result.isFavorite,
              };
              set({ favorites: correctedFavorites });
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  `favorites_${user.id}`,
                  JSON.stringify(correctedFavorites)
                );
              }
            }

            // Reload favorite themes to update the favorites list
            try {
              const response = await fetch("/api/user/favorites");
              if (response.ok) {
                const updatedFavoriteThemes = await response.json();
                set({ favoriteThemes: updatedFavoriteThemes });
              }
            } catch (error) {
              console.error("Error reloading favorite themes:", error);
            }

            return true;
          } catch (error) {
            console.error("Error syncing favorite with DB:", error);
            // Revert both state and localStorage on DB sync error
            set({ favorites });
            if (typeof window !== "undefined") {
              localStorage.setItem(
                `favorites_${user.id}`,
                JSON.stringify(favorites)
              );
            }
            return false;
          }
        },
      };
    }),
    { name: "persistent-theme-store" }
  )
);
