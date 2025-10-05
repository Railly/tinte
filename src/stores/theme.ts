"use client";

import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import {
  mergeOverrides,
  normalizeOverrides,
  validateOverride,
} from "@/lib/override-normalization";
import {
  computeFinalTokens,
  convertColorToHex,
  extractTinteTheme,
} from "@/lib/theme-computation";
import type { ThemeData } from "@/lib/theme-tokens";
import { useAuthStore } from "@/stores/auth";
import type { NormalizedOverrides } from "@/types/overrides";
import type { TinteBlock, TinteTheme } from "@/types/tinte";
import { DEFAULT_THEME } from "@/utils/default-theme";
import { extractFontFamily, loadGoogleFont } from "@/utils/fonts";

type ThemeMode = "light" | "dark";

interface ThemeState {
  mounted: boolean;
  mode: ThemeMode;
  activeTheme: ThemeData;
  editedTokens: Record<string, string>;
  overrides: NormalizedOverrides;
  unsavedChanges: boolean;
}

interface ThemeActions {
  initialize: () => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: (coords?: { x: number; y: number }) => void;
  selectTheme: (theme: ThemeData) => void;
  editToken: (key: string, value: string) => void;
  resetTokens: () => void;
  updateTinteTheme: (mode: ThemeMode, updates: Partial<TinteBlock>) => void;
  updateOverride: (provider: keyof NormalizedOverrides, override: any) => void;
  resetOverrides: (provider?: keyof NormalizedOverrides) => void;
  markAsSaved: () => void;
}

interface ThemeComputed {
  isDark: boolean;
  currentTokens: Record<string, string>;
  hasEdits: boolean;
  tinteTheme: TinteTheme;
}

type ThemeStore = ThemeState & ThemeActions & ThemeComputed;

const loadFromStorage = (): { theme: ThemeData; mode: ThemeMode } => {
  if (typeof window === "undefined") {
    return { theme: DEFAULT_THEME, mode: "light" };
  }

  try {
    const storedTheme = localStorage.getItem("tinte-selected-theme");
    const storedMode = localStorage.getItem("tinte-theme-mode") as ThemeMode;

    return {
      theme: storedTheme ? JSON.parse(storedTheme) : DEFAULT_THEME,
      mode: storedMode || "light",
    };
  } catch {
    return { theme: DEFAULT_THEME, mode: "light" };
  }
};

const saveToStorageDebounced = (() => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (
    theme: ThemeData,
    mode: ThemeMode,
    overrides: NormalizedOverrides,
  ) => {
    if (typeof window === "undefined") return;

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      try {
        const themeToSave = { ...theme, overrides };
        localStorage.setItem(
          "tinte-selected-theme",
          JSON.stringify(themeToSave),
        );
        localStorage.setItem("tinte-theme-mode", mode);
      } catch (error) {
        console.warn("Failed to save to localStorage:", error);
      }
    }, 300);
  };
})();

const applyToDOMDebounced = (() => {
  const timeoutId: NodeJS.Timeout | null = null;
  let rafId: number | null = null;

  return (
    theme: ThemeData,
    mode: ThemeMode,
    tokens: Record<string, string>,
  ) => {
    if (typeof window === "undefined") return;

    if (timeoutId) clearTimeout(timeoutId);
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      const root = document.documentElement;
      root.setAttribute("data-theme", mode);

      Object.entries(tokens).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });

      const fontTokens = Object.entries(tokens).filter(([key]) =>
        key.startsWith("font-"),
      );
      fontTokens.forEach(([_, value]) => {
        const fontFamily = extractFontFamily(value);
        if (fontFamily) {
          loadGoogleFont(fontFamily, ["400", "500", "600"]);

          if (fontFamily === "Press Start 2P") {
            setTimeout(() => {
              const specialLink = document.createElement("link");
              specialLink.rel = "stylesheet";
              specialLink.href =
                "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";

              specialLink.onload = () => {
                document.documentElement.style.setProperty(
                  "--font-sans",
                  '"Press Start 2P", monospace',
                );
                document.body.offsetHeight;
              };

              document.head.appendChild(specialLink);
            }, 200);
          }
        }
      });

      (window as any).__TINTE_THEME__ = { theme, mode };
    });
  };
})();

const createThemeForEdit = (theme: ThemeData, userId?: string): ThemeData => {
  if (theme.name.includes("(unsaved)")) {
    return theme;
  }

  // Check if this is the user's own theme
  const isOwnTheme =
    (theme.user?.id && theme.user.id === userId) ||
    theme.author === "You" ||
    (theme.id?.startsWith("theme_") && userId);

  // If it's your own theme, keep the same name and ID
  if (isOwnTheme) {
    return theme;
  }

  // If it's someone else's theme, create Custom (unsaved)
  return {
    ...theme,
    id: `custom_${Date.now()}`,
    name: "Custom (unsaved)",
  };
};

export const useThemeStore = create<ThemeStore>()(
  devtools(
    subscribeWithSelector((set, get) => {
      const { theme, mode } = loadFromStorage();
      const initialOverrides = normalizeOverrides(theme);
      const initialTokens = computeFinalTokens(
        theme,
        mode,
        initialOverrides,
        {},
      );

      return {
        mounted: false,
        mode,
        activeTheme: theme,
        editedTokens: {},
        overrides: initialOverrides,
        unsavedChanges: false,
        isDark: mode === "dark",
        currentTokens: initialTokens,
        hasEdits: false,
        tinteTheme: extractTinteTheme(theme),

        initialize: () => {
          const state = get();
          set({ mounted: true });
          applyToDOMDebounced(
            state.activeTheme,
            state.mode,
            state.currentTokens,
          );
          saveToStorageDebounced(
            state.activeTheme,
            state.mode,
            state.overrides,
          );
        },

        setMode: (newMode) => {
          const { activeTheme, overrides, editedTokens } = get();
          const newTokens = computeFinalTokens(
            activeTheme,
            newMode,
            overrides,
            editedTokens,
          );

          set({
            mode: newMode,
            isDark: newMode === "dark",
            currentTokens: newTokens,
          });

          applyToDOMDebounced(activeTheme, newMode, newTokens);
          saveToStorageDebounced(activeTheme, newMode, overrides);
        },

        toggleMode: (coords) => {
          const { mode } = get();
          const newMode = mode === "light" ? "dark" : "light";

          if (typeof window === "undefined") {
            get().setMode(newMode);
            return;
          }

          const root = document.documentElement;
          const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
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
          const normalizedOverrides = normalizeOverrides(theme);
          const { mode } = get();
          const newTokens = computeFinalTokens(
            theme,
            mode,
            normalizedOverrides,
            {},
          );
          const newTinteTheme = extractTinteTheme(theme);

          set({
            activeTheme: theme,
            editedTokens: {},
            overrides: normalizedOverrides,
            unsavedChanges: false,
            currentTokens: newTokens,
            hasEdits: false,
            tinteTheme: newTinteTheme,
          });

          applyToDOMDebounced(theme, mode, newTokens);
          saveToStorageDebounced(theme, mode, normalizedOverrides);

          if (typeof window !== "undefined") {
            import("@/stores/auth").then(({ useAuthStore }) => {
              useAuthStore.setState({
                isSaving: false,
                lastSaved: null,
              });
            });

            const currentPath = window.location.pathname;
            if (currentPath.startsWith("/workbench/") && theme.slug) {
              const newUrl = `/workbench/${theme.slug}${window.location.search}`;
              window.history.replaceState(null, "", newUrl);
            }
          }
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
            const userId = useAuthStore.getState().user?.id;
            const updatedTheme = createThemeForEdit(state.activeTheme, userId);
            const newEditedTokens = {
              ...state.editedTokens,
              [key]: processedValue,
            };
            const newCurrentTokens = {
              ...state.currentTokens,
              [key]: processedValue,
            };

            return {
              activeTheme: updatedTheme,
              editedTokens: newEditedTokens,
              currentTokens: newCurrentTokens,
              unsavedChanges: true,
              hasEdits: true,
            };
          });

          if (typeof window !== "undefined") {
            document.documentElement.style.setProperty(
              `--${key}`,
              processedValue,
            );
          }
        },

        resetTokens: () => {
          const { activeTheme, mode } = get();
          const newTokens = computeFinalTokens(activeTheme, mode, {}, {});

          set({
            editedTokens: {},
            overrides: {},
            unsavedChanges: false,
            hasEdits: false,
            currentTokens: newTokens,
          });

          applyToDOMDebounced(activeTheme, mode, newTokens);
          saveToStorageDebounced(activeTheme, mode, {});
        },

        updateTinteTheme: (targetMode, updates) => {
          set((state) => {
            const newTinteTheme = {
              ...state.tinteTheme,
              [targetMode]: { ...state.tinteTheme[targetMode], ...updates },
            };

            const userId = useAuthStore.getState().user?.id;
            const updatedTheme = createThemeForEdit(
              {
                ...state.activeTheme,
                rawTheme: newTinteTheme,
              },
              userId,
            );

            // Clear overrides that conflict with canonical colors being edited
            const updatedKeys = Object.keys(updates);
            const clearedOverrides = { ...state.overrides };

            // If editing canonical colors, clear shadcn overrides for those colors
            if (clearedOverrides.shadcn?.palettes?.[targetMode]) {
              const modePalette = clearedOverrides.shadcn.palettes[targetMode];
              // Map canonical keys to shadcn token names
              const keysToRemove = new Set<string>();
              updatedKeys.forEach((key) => {
                if (key === "pr") keysToRemove.add("primary");
                if (key === "sc") keysToRemove.add("secondary");
                if (key === "bg") keysToRemove.add("background");
                if (key === "tx") keysToRemove.add("foreground");
                if (key.startsWith("ac_")) {
                  keysToRemove.add("accent");
                  keysToRemove.add("destructive");
                }
              });

              keysToRemove.forEach((tokenKey) => {
                delete modePalette[tokenKey];
              });
            }

            const newTokens = computeFinalTokens(
              updatedTheme,
              state.mode,
              clearedOverrides,
              state.editedTokens,
            );

            return {
              activeTheme: updatedTheme,
              tinteTheme: newTinteTheme,
              overrides: clearedOverrides,
              currentTokens: newTokens,
              unsavedChanges: true,
              hasEdits: true,
            };
          });

          const { activeTheme, mode, overrides, currentTokens } = get();
          applyToDOMDebounced(activeTheme, mode, currentTokens);
          saveToStorageDebounced(activeTheme, mode, overrides);
        },

        updateOverride: (provider, override) => {
          set((state) => {
            const validatedOverride = validateOverride(provider, override);
            const newOverrides = mergeOverrides(state.overrides, {
              [provider]: validatedOverride,
            });
            const newTokens = computeFinalTokens(
              state.activeTheme,
              state.mode,
              newOverrides,
              state.editedTokens,
            );

            return {
              overrides: newOverrides,
              currentTokens: newTokens,
              unsavedChanges: true,
              hasEdits: true,
            };
          });

          const { activeTheme, mode, overrides, currentTokens } = get();
          applyToDOMDebounced(activeTheme, mode, currentTokens);
          saveToStorageDebounced(activeTheme, mode, overrides);
        },

        resetOverrides: (provider) => {
          set((state) => {
            const newOverrides = { ...state.overrides };

            if (provider) {
              delete newOverrides[provider];
            } else {
              (
                Object.keys(newOverrides) as Array<keyof NormalizedOverrides>
              ).forEach((key) => {
                delete newOverrides[key];
              });
            }

            const newTokens = computeFinalTokens(
              state.activeTheme,
              state.mode,
              newOverrides,
              state.editedTokens,
            );

            return {
              overrides: newOverrides,
              currentTokens: newTokens,
              unsavedChanges: Object.keys(newOverrides).length > 0,
              hasEdits:
                Object.keys(newOverrides).length > 0 ||
                Object.keys(state.editedTokens).length > 0,
            };
          });

          const { activeTheme, mode, overrides, currentTokens } = get();
          applyToDOMDebounced(activeTheme, mode, currentTokens);
          saveToStorageDebounced(activeTheme, mode, overrides);
        },

        markAsSaved: () => {
          set({
            unsavedChanges: false,
            hasEdits: false,
          });
        },
      };
    }),
    { name: "theme-store-v2" },
  ),
);
