"use client";

import { formatHex, parse } from "culori";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { convertTheme } from "@/lib/providers";
import { computeShadowVars } from "@/lib/providers/shadcn";
import { shadcnToTinte } from "@/lib/shadcn-to-tinte";
import type { ThemeData } from "@/lib/theme-tokens";
import type { ShadcnTheme } from "@/types/shadcn";
import type { TinteTheme } from "@/types/tinte";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { DEFAULT_THEME, extractTinteThemeData } from "@/utils/tinte-presets";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";

const THEME_STORAGE_KEY = "tinte-selected-theme";
const MODE_STORAGE_KEY = "tinte-current-mode";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  // Core state
  mounted: boolean;
  currentMode: ThemeMode;
  activeTheme: ThemeData;
  editedTokens: Record<string, string>;

  // Computed state
  isDark: boolean;
  currentTokens: Record<string, string>;
  hasEdits: boolean;

  // Theme collections (computed on mount)
  allThemes: ThemeData[];
  tweakcnThemes: ThemeData[];
  raysoThemes: ThemeData[];
  tinteThemes: ThemeData[];
  tinteTheme: TinteTheme;

  // Actions
  initialize: () => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: (coords?: { x: number; y: number }) => void;
  selectTheme: (theme: ThemeData) => void;
  editToken: (key: string, value: string) => void;
  resetTokens: () => void;
  navigateTheme: (direction: "prev" | "next" | "random") => void;
  updateTinteTheme: (mode: ThemeMode, updates: Partial<any>) => void;
  addTheme: (theme: ThemeData) => void;
}

// Utility functions
function convertColorToHex(colorValue: string): string {
  try {
    if (colorValue.startsWith("#")) return colorValue;
    const parsed = parse(colorValue);
    if (parsed) {
      return formatHex(parsed) || colorValue;
    }
    return colorValue;
  } catch {
    return colorValue;
  }
}

function computeThemeTokens(theme: ThemeData): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  if ((theme as any).computedTokens) {
    return (theme as any).computedTokens;
  }

  let computedTokens: { light: any; dark: any };

  if (theme.author === "tweakcn" && theme.rawTheme) {
    // TweakCN themes already have shadcn-style tokens
    computedTokens = {
      light: theme.rawTheme.light,
      dark: theme.rawTheme.dark,
    };
  } else if (theme.rawTheme) {
    try {
      // Check if this is an extended theme with fonts/radius/shadows
      const extendedTheme = theme.rawTheme as any;
      const hasExtendedProps =
        extendedTheme.fonts || extendedTheme.radius || extendedTheme.shadows;

      if (hasExtendedProps) {
        // Use the convertTinteToShadcn function directly with extended theme data
        const { convertTinteToShadcn } = require("@/lib/providers/shadcn");
        const shadcnTheme = convertTinteToShadcn(extendedTheme) as ShadcnTheme;

        if (shadcnTheme?.light && shadcnTheme.dark) {
          computedTokens = {
            light: shadcnTheme.light,
            dark: shadcnTheme.dark,
          };
        } else {
          computedTokens = DEFAULT_THEME.computedTokens;
        }
      } else {
        // Standard conversion for normal themes
        const shadcnTheme = convertTheme(
          "shadcn",
          theme.rawTheme as TinteTheme,
        ) as ShadcnTheme;
        if (shadcnTheme?.light && shadcnTheme.dark) {
          computedTokens = {
            light: shadcnTheme.light,
            dark: shadcnTheme.dark,
          };
        } else {
          console.warn(
            "Failed to convert theme to shadcn:",
            theme.name,
            theme.author,
          );
          computedTokens = DEFAULT_THEME.computedTokens;
        }
      }
    } catch (error) {
      console.error(
        "Error converting theme to shadcn:",
        theme.name,
        theme.author,
        error,
      );
      computedTokens = DEFAULT_THEME.computedTokens;
    }
  } else {
    computedTokens = DEFAULT_THEME.computedTokens;
  }

  return computedTokens;
}

function applyThemeToDOM(theme: ThemeData, mode: ThemeMode): void {
  if (typeof window === "undefined") return;

  const computedTokens = computeThemeTokens(theme);
  let tokens = computedTokens[mode];

  // Generate shadow variables from the base shadow properties
  const shadowVars = computeShadowVars(tokens);

  // Merge shadow vars with base tokens
  tokens = { ...tokens, ...shadowVars };

  const root = document.documentElement;

  // Apply mode class
  if (mode === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }

  // Apply tokens
  Object.entries(tokens).forEach(([key, value]) => {
    if (typeof value === "string" && value.trim()) {
      root.style.setProperty(`--${key}`, value);
    }
  });

  // Update global reference
  (window as any).__TINTE_THEME__ = { theme, mode, tokens };

  // Force repaint to ensure shadow changes are applied
  if (typeof window !== "undefined") {
    requestAnimationFrame(() => {
      // Force DOM recalculation
      const forceRepaint = document.createElement("div");
      forceRepaint.style.cssText =
        "position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;";
      document.body.appendChild(forceRepaint);
      forceRepaint.offsetHeight; // Trigger reflow
      document.body.removeChild(forceRepaint);
    });
  }
}

function applyThemeWithTransition(theme: ThemeData, mode: ThemeMode): void {
  const applyChanges = () => applyThemeToDOM(theme, mode);

  if (typeof window === "undefined") {
    applyChanges();
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!document.startViewTransition || prefersReducedMotion) {
    applyChanges();
    return;
  }

  document.startViewTransition(applyChanges);
}

function loadFromStorage(): { theme: ThemeData; mode: ThemeMode } {
  if (typeof window === "undefined") {
    return { theme: DEFAULT_THEME, mode: "light" };
  }

  // Check preloaded data first
  const preloaded = (window as any).__TINTE_THEME__;
  if (preloaded) {
    return { theme: preloaded.theme, mode: preloaded.mode };
  }

  // Fallback to localStorage
  let theme = DEFAULT_THEME;
  let mode: ThemeMode = "light";

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
      theme = JSON.parse(storedTheme);
    }

    const storedMode = localStorage.getItem(MODE_STORAGE_KEY);
    if (storedMode === "dark" || storedMode === "light") {
      mode = storedMode;
    } else {
      mode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
  } catch {
    // Silent fail
  }

  return { theme, mode };
}

function saveToStorage(theme: ThemeData, mode: ThemeMode): void {
  if (typeof window === "undefined") return;

  try {
    const computedTokens = computeThemeTokens(theme);
    const themeWithTokens = { ...theme, computedTokens };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeWithTokens));
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // Silent fail
  }
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      mounted: false,
      currentMode: "light",
      activeTheme: DEFAULT_THEME,
      editedTokens: {},
      isDark: false,
      currentTokens: {},
      hasEdits: false,
      allThemes: [DEFAULT_THEME],
      tweakcnThemes: [],
      raysoThemes: [],
      tinteThemes: [],
      tinteTheme: DEFAULT_THEME.rawTheme as TinteTheme,

      // Actions
      initialize: () => {
        const { theme, mode } = loadFromStorage();

        // Load theme collections
        const tweakcnThemes = extractTweakcnThemeData(false).map(
          (themeData, index) => ({
            ...themeData,
            description: `Beautiful ${themeData.name.toLowerCase()} theme with carefully crafted color combinations`,
            author: "tweakcn",
            provider: "tweakcn" as const,
            downloads: 8000 + index * 500,
            likes: 400 + index * 50,
            views: 15000 + index * 2000,
            tags: [
              themeData.name.split(" ")[0].toLowerCase(),
              "modern",
              "preset",
              "community",
            ],
          }),
        );

        const raysoThemes = extractRaysoThemeData(false).map(
          (themeData, index) => ({
            ...themeData,
            description: `Beautiful ${themeData.name.toLowerCase()} theme from ray.so with carefully crafted color combinations`,
            author: "ray.so",
            provider: "rayso" as const,
            downloads: 6000 + index * 400,
            likes: 300 + index * 40,
            views: 12000 + index * 1500,
            tags: [
              themeData.name.toLowerCase(),
              "rayso",
              "modern",
              "community",
            ],
          }),
        );

        const tinteThemes = extractTinteThemeData(false).map(
          (themeData, index) => ({
            ...themeData,
            description: `Stunning ${themeData.name.toLowerCase()} theme created by tinte with modern design principles`,
            author: "tinte",
            provider: "tinte" as const,
            downloads: 5000 + index * 350,
            likes: 250 + index * 35,
            views: 10000 + index * 1200,
            tags: [
              themeData.name.toLowerCase().split(" ")[0],
              "tinte",
              "premium",
              "design",
            ],
          }),
        );

        const allThemes = [
          DEFAULT_THEME,
          ...tinteThemes,
          ...raysoThemes,
          ...tweakcnThemes,
        ].filter(
          (theme, index, arr) =>
            arr.findIndex((t) => t.id === theme.id) === index,
        );

        // Compute tokens
        const computedTokens = computeThemeTokens(theme);
        const baseTokens = computedTokens[mode];
        const processedTokens: Record<string, string> = {};

        for (const [key, value] of Object.entries(baseTokens)) {
          if (typeof value === "string") {
            processedTokens[key] = convertColorToHex(value);
          }
        }

        // Extract TinteTheme - convert through shadcnToTinte for consistency
        let tinteTheme: TinteTheme;
        if (theme?.rawTheme && typeof theme.rawTheme === "object") {
          if ("light" in theme.rawTheme && "dark" in theme.rawTheme) {
            // If already TinteTheme structure, use as-is
            const possibleTinte = theme.rawTheme as TinteTheme;
            if (possibleTinte.light.tx && possibleTinte.light.ui) {
              tinteTheme = possibleTinte;
            } else {
              // Convert shadcn-style theme to canonical TinteTheme
              tinteTheme = shadcnToTinte(theme.rawTheme as ShadcnTheme);
            }
          } else {
            // Convert shadcn-style theme to canonical TinteTheme
            tinteTheme = shadcnToTinte(theme.rawTheme as ShadcnTheme);
          }
        } else {
          tinteTheme = DEFAULT_THEME.rawTheme as TinteTheme;
        }

        set({
          mounted: true,
          currentMode: mode,
          activeTheme: theme,
          isDark: mode === "dark",
          currentTokens: processedTokens,
          hasEdits: false,
          allThemes,
          tweakcnThemes,
          raysoThemes,
          tinteThemes,
          tinteTheme,
        });

        // Apply theme to DOM
        applyThemeToDOM(theme, mode);
      },

      setMode: (mode) => {
        const { activeTheme } = get();

        set((state) => {
          const computedTokens = computeThemeTokens(activeTheme);
          const baseTokens = computedTokens[mode];
          const processedTokens: Record<string, string> = {};

          for (const [key, value] of Object.entries(baseTokens)) {
            if (typeof value === "string") {
              processedTokens[key] = convertColorToHex(value);
            }
          }

          return {
            currentMode: mode,
            isDark: mode === "dark",
            currentTokens: { ...processedTokens, ...state.editedTokens },
          };
        });

        saveToStorage(activeTheme, mode);
        applyThemeToDOM(activeTheme, mode);
      },

      toggleMode: (coords) => {
        const { currentMode, activeTheme } = get();
        const newMode = currentMode === "light" ? "dark" : "light";

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
          // Update state
          set((state) => {
            const computedTokens = computeThemeTokens(activeTheme);
            const baseTokens = computedTokens[newMode];
            const processedTokens: Record<string, string> = {};

            for (const [key, value] of Object.entries(baseTokens)) {
              if (typeof value === "string") {
                processedTokens[key] = convertColorToHex(value);
              }
            }

            return {
              currentMode: newMode,
              isDark: newMode === "dark",
              currentTokens: { ...processedTokens, ...state.editedTokens },
            };
          });

          // Apply to DOM and save
          saveToStorage(activeTheme, newMode);
          applyThemeToDOM(activeTheme, newMode);
        });
      },

      selectTheme: (theme) => {
        const { currentMode, allThemes } = get();

        set((state) => {
          const computedTokens = computeThemeTokens(theme);
          const baseTokens = computedTokens[currentMode];
          const processedTokens: Record<string, string> = {};

          for (const [key, value] of Object.entries(baseTokens)) {
            if (typeof value === "string") {
              processedTokens[key] = convertColorToHex(value);
            }
          }

          // Extract TinteTheme - convert through shadcnToTinte for consistency
          let tinteTheme: TinteTheme;
          if (theme?.rawTheme && typeof theme.rawTheme === "object") {
            if ("light" in theme.rawTheme && "dark" in theme.rawTheme) {
              // If already TinteTheme structure, use as-is
              const possibleTinte = theme.rawTheme as TinteTheme;
              if (possibleTinte.light.tx && possibleTinte.light.ui) {
                tinteTheme = possibleTinte;
              } else {
                // Convert shadcn-style theme to canonical TinteTheme
                tinteTheme = shadcnToTinte(theme.rawTheme as ShadcnTheme);
              }
            } else {
              // Convert shadcn-style theme to canonical TinteTheme
              tinteTheme = shadcnToTinte(theme.rawTheme as ShadcnTheme);
            }
          } else {
            tinteTheme = DEFAULT_THEME.rawTheme as TinteTheme;
          }

          // Add theme to allThemes if it's not already there
          let updatedAllThemes = [...allThemes];
          const existingThemeIndex = allThemes.findIndex(t => t.id === theme.id);
          if (existingThemeIndex === -1) {
            updatedAllThemes.push(theme);
          } else {
            // Update existing theme with latest data
            updatedAllThemes[existingThemeIndex] = theme;
          }

          return {
            activeTheme: theme,
            allThemes: updatedAllThemes,
            currentTokens: processedTokens,
            editedTokens: {},
            hasEdits: false,
            tinteTheme,
          };
        });

        saveToStorage(theme, currentMode);
        applyThemeWithTransition(theme, currentMode);
      },

      editToken: (key, value) => {
        // Only convert to hex for color tokens
        const processedValue =
          key.includes("font") ||
          key.includes("shadow") ||
          key === "radius" ||
          key === "spacing" ||
          key === "letter-spacing"
            ? value
            : convertColorToHex(value);

        set((state) => ({
          editedTokens: { ...state.editedTokens, [key]: processedValue },
          currentTokens: { ...state.currentTokens, [key]: processedValue },
          hasEdits: true,
        }));

        // Apply immediately to DOM
        if (typeof window !== "undefined") {
          document.documentElement.style.setProperty(
            `--${key}`,
            processedValue,
          );

          // If it's a shadow property, recompute and apply shadow vars
          if (key.startsWith("shadow-")) {
            const { activeTheme, currentMode, editedTokens } = get();
            const updatedEditedTokens = {
              ...editedTokens,
              [key]: processedValue,
            };

            // Get base tokens and merge with updated edited tokens
            const computedTokens = computeThemeTokens(activeTheme);
            const baseTokens = computedTokens[currentMode];
            const finalTokens = { ...baseTokens, ...updatedEditedTokens };

            // Compute shadow vars using imported function
            const shadowVars = computeShadowVars(finalTokens);

            // Apply all shadow vars
            Object.entries(shadowVars).forEach(([shadowKey, shadowValue]) => {
              document.documentElement.style.setProperty(
                `--${shadowKey}`,
                shadowValue,
              );
            });
          }
        }
      },

      resetTokens: () => {
        const { activeTheme, currentMode } = get();

        set(() => {
          const computedTokens = computeThemeTokens(activeTheme);
          const baseTokens = computedTokens[currentMode];
          const processedTokens: Record<string, string> = {};

          for (const [key, value] of Object.entries(baseTokens)) {
            if (typeof value === "string") {
              processedTokens[key] = convertColorToHex(value);
            }
          }

          return {
            editedTokens: {},
            currentTokens: processedTokens,
            hasEdits: false,
          };
        });

        // Re-apply original theme
        applyThemeWithTransition(activeTheme, currentMode);
      },

      updateTinteTheme: (mode, updates) => {
        set((state) => {
          const newTinteTheme = {
            ...state.tinteTheme,
            [mode]: {
              ...state.tinteTheme[mode],
              ...updates,
            },
          };

          // Create updated theme data with new TinteTheme
          const updatedTheme = {
            ...state.activeTheme,
            rawTheme: newTinteTheme,
            // Temporarily change author to force proper conversion for TweakCN
            author: state.activeTheme.author === "tweakcn" ? "tinte" : state.activeTheme.author,
          };

          // Force clear cached tokens
          delete (updatedTheme as any).computedTokens;

          // Recompute tokens
          const computedTokens = computeThemeTokens(updatedTheme);
          const baseTokens = computedTokens[state.currentMode];
          const processedTokens: Record<string, string> = {};

          for (const [key, value] of Object.entries(baseTokens)) {
            if (typeof value === "string") {
              processedTokens[key] = convertColorToHex(value);
            }
          }

          // For TweakCN themes, update rawTheme with converted ShadcnTheme
          let finalActiveTheme;
          if (state.activeTheme.author === "tweakcn") {
            // Convert TinteTheme back to ShadcnTheme for TweakCN themes
            const { convertTinteToShadcn } = require("@/lib/providers/shadcn");
            const convertedShadcnTheme = convertTinteToShadcn(newTinteTheme);
            finalActiveTheme = {
              ...updatedTheme,
              author: state.activeTheme.author, // Restore original author
              rawTheme: convertedShadcnTheme, // Use converted ShadcnTheme
            };
          } else {
            finalActiveTheme = {
              ...updatedTheme,
              author: state.activeTheme.author, // Restore original author
            };
          }

          return {
            tinteTheme: newTinteTheme,
            activeTheme: finalActiveTheme,
            currentTokens: processedTokens,
            hasEdits: true,
          };
        });

        // Apply to DOM and save
        const { activeTheme, currentMode } = get();
        saveToStorage(activeTheme, currentMode);
        applyThemeToDOM(activeTheme, currentMode);
      },

      navigateTheme: (direction) => {
        const { activeTheme, allThemes } = get();
        if (!activeTheme || allThemes.length <= 1) return;

        const currentIndex = allThemes.findIndex(
          (t) => t.id === activeTheme.id,
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
              (t) => t.id !== activeTheme.id,
            );
            const randomIndex = Math.floor(
              Math.random() * availableThemes.length,
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

      addTheme: (theme: ThemeData) => {
        set((state) => {
          const existingIndex = state.allThemes.findIndex(
            (t) => t.id === theme.id,
          );
          if (existingIndex >= 0) {
            const updatedThemes = [...state.allThemes];
            updatedThemes[existingIndex] = theme;
            return { allThemes: updatedThemes };
          } else {
            return { allThemes: [...state.allThemes, theme] };
          }
        });
      },
    })),
    { name: "theme-store" },
  ),
);
