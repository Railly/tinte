"use client";

import { formatHex, parse } from "culori";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { convertTheme } from "@/lib/providers";
import { computeShadowVars } from "@/lib/providers/shadcn";
import { shadcnToTinte } from "@/lib/shadcn-to-tinte";
import type { ThemeData } from "@/lib/theme-tokens";
import type { ShadcnTheme } from "@/types/shadcn";
import type { TinteTheme, TinteBlock } from "@/types/tinte";
import type { ShadcnOverrideSchema } from "@/db/schema/theme";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { DEFAULT_THEME, extractTinteThemeData } from "@/utils/tinte-presets";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";
import { authClient } from "@/lib/auth-client";

const THEME_STORAGE_KEY = "tinte-selected-theme";
const MODE_STORAGE_KEY = "tinte-current-mode";
const ANONYMOUS_THEMES_KEY = "tinte-anonymous-themes";

export type ThemeMode = "light" | "dark";

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

  // Computed state
  isDark: boolean;
  currentTokens: Record<string, string>;
  hasEdits: boolean;
  canSave: boolean;

  // Theme collections (computed on mount)
  allThemes: ThemeData[];
  tweakcnThemes: ThemeData[];
  raysoThemes: ThemeData[];
  tinteThemes: ThemeData[];
  userThemes: ThemeData[];
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

  // Override actions
  updateShadcnOverride: (override: any) => void;
  updateVscodeOverride: (override: any) => void;
  updateShikiOverride: (override: any) => void;
  resetOverrides: (provider?: 'shadcn' | 'vscode' | 'shiki') => void;

  // Persistence actions
  saveTheme: (name?: string, makePublic?: boolean) => Promise<boolean>;
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
    computedTokens = {
      light: theme.rawTheme.light,
      dark: theme.rawTheme.dark,
    };
  } else if (theme.rawTheme) {
    try {
      const extendedTheme = theme.rawTheme as any;
      const hasExtendedProps =
        extendedTheme.fonts || extendedTheme.radius || extendedTheme.shadows;

      if (hasExtendedProps) {
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
          computedTokens = DEFAULT_THEME.computedTokens;
        }
      }
    } catch (error) {
      console.error("Error converting theme to shadcn:", theme.name, error);
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

  const shadowVars = computeShadowVars(tokens);
  tokens = { ...tokens, ...shadowVars };

  const root = document.documentElement;

  if (mode === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }

  Object.entries(tokens).forEach(([key, value]) => {
    if (typeof value === "string" && value.trim()) {
      root.style.setProperty(`--${key}`, value);
    }
  });

  (window as any).__TINTE_THEME__ = { theme, mode, tokens };

  if (typeof window !== "undefined") {
    requestAnimationFrame(() => {
      const forceRepaint = document.createElement("div");
      forceRepaint.style.cssText =
        "position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;";
      document.body.appendChild(forceRepaint);
      forceRepaint.offsetHeight;
      document.body.removeChild(forceRepaint);
    });
  }
}

// Apply processed tokens directly to DOM (used when overrides are already applied)
function applyProcessedTokensToDOM(theme: ThemeData, mode: ThemeMode, processedTokens: Record<string, string>): void {
  if (typeof window === "undefined") return;

  const shadowVars = computeShadowVars(processedTokens);
  const finalTokens = { ...processedTokens, ...shadowVars };

  const root = document.documentElement;

  if (mode === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }

  Object.entries(finalTokens).forEach(([key, value]) => {
    if (typeof value === "string" && value.trim()) {
      root.style.setProperty(`--${key}`, value);
    }
  });

  (window as any).__TINTE_THEME__ = { theme, mode, tokens: finalTokens };

  if (typeof window !== "undefined") {
    requestAnimationFrame(() => {
      const forceRepaint = document.createElement("div");
      forceRepaint.style.cssText =
        "position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;";
      document.body.appendChild(forceRepaint);
      forceRepaint.offsetHeight;
      document.body.removeChild(forceRepaint);
    });
  }
}

function loadFromStorage(): { theme: ThemeData; mode: ThemeMode } {
  if (typeof window === "undefined") {
    console.log('📱 [loadFromStorage] SSR - using defaults');
    return { theme: DEFAULT_THEME, mode: "light" };
  }

  const preloaded = (window as any).__TINTE_THEME__;
  if (preloaded) {
    console.log('📱 [loadFromStorage] Using preloaded theme:', preloaded.theme.name);
    return { theme: preloaded.theme, mode: preloaded.mode };
  }

  let theme = DEFAULT_THEME;
  let mode: ThemeMode = "light";

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const storedMode = localStorage.getItem(MODE_STORAGE_KEY);

    console.log('📱 [loadFromStorage] localStorage check:', {
      hasStoredTheme: !!storedTheme,
      hasStoredMode: !!storedMode,
      storedThemeLength: storedTheme?.length || 0
    });

    if (storedTheme) {
      theme = JSON.parse(storedTheme);
      console.log('📱 [loadFromStorage] Parsed theme:', theme.name, theme.id);
    }

    if (storedMode === "dark" || storedMode === "light") {
      mode = storedMode;
    } else {
      mode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
  } catch (error) {
    console.error('📱 [loadFromStorage] Error:', error);
  }

  console.log('📱 [loadFromStorage] Final result:', { themeName: theme.name, mode });
  return { theme, mode };
}

function saveToStorage(
  theme: ThemeData,
  mode: ThemeMode,
  overrides?: {
    shadcn?: any;
    vscode?: any;
    shiki?: any;
  }
): void {
  if (typeof window === "undefined") return;

  try {
    const computedTokens = computeThemeTokens(theme);
    const themeWithTokens = {
      ...theme,
      computedTokens,
      // Include current overrides in localStorage so they persist across refreshes
      overrides: overrides ? {
        shadcn: overrides.shadcn,
        vscode: overrides.vscode,
        shiki: overrides.shiki,
      } : (theme as any).overrides
    };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeWithTokens));
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // Silent fail
  }
}

function saveAnonymousThemes(themes: ThemeData[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ANONYMOUS_THEMES_KEY, JSON.stringify(themes));
  } catch {
    // Silent fail
  }
}

function loadAnonymousThemes(): ThemeData[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(ANONYMOUS_THEMES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

async function saveThemeToDatabase(
  theme: ThemeData,
  tinteTheme: TinteTheme,
  overrides: {
    shadcn?: any;
    vscode?: any;
    shiki?: any;
  },
  isPublic: boolean = false,
  isUpdate: boolean = false
): Promise<{ success: boolean; savedTheme?: ThemeData }> {
  try {
    let response;

    if (isUpdate && theme.id) {
      // Update existing theme
      response = await fetch(`/api/themes/${theme.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: theme.name,
          tinteTheme,
          overrides,
          isPublic,
        }),
      });
    } else {
      // Create new theme
      response = await fetch("/api/themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: theme.name,
          tinteTheme,
          overrides,
          isPublic,
        }),
      });
    }

    if (response.ok) {
      const data = await response.json();
      if (data.theme) {
        // Transform the saved theme back to ThemeData format
        const savedTheme: ThemeData = {
          ...theme,
          id: data.theme.id,
          name: data.theme.name,
          createdAt: data.theme.created_at || data.theme.createdAt || new Date().toISOString(),
        };
        return { success: true, savedTheme };
      }
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error("Error saving theme to database:", error);
    return { success: false };
  }
}

// Helper function to organize edited tokens by provider and mode
function organizeEditedTokens(editedTokens: Record<string, string>, currentMode: string) {
  const shadcnTokens: Record<string, any> = {};
  const vscodeTokens: Record<string, any> = {};
  const shikiTokens: Record<string, any> = {};

  // Organize tokens based on their key patterns
  Object.entries(editedTokens).forEach(([key, value]) => {
    // Base theme tokens (bg, ui, tx, etc.) go to shadcn
    if (key.match(/^(bg|ui|tx|pr|sc|ac|light_|dark_)/)) {
      if (!shadcnTokens[currentMode]) shadcnTokens[currentMode] = {};
      shadcnTokens[currentMode][key] = value;
    }
    // VS Code specific tokens
    else if (key.includes('vscode') || key.includes('editor') || key.includes('terminal')) {
      if (!vscodeTokens[currentMode]) vscodeTokens[currentMode] = {};
      vscodeTokens[currentMode][key] = value;
    }
    // Shiki specific tokens
    else if (key.includes('shiki') || key.includes('syntax') || key.includes('highlight')) {
      if (!shikiTokens[currentMode]) shikiTokens[currentMode] = {};
      shikiTokens[currentMode][key] = value;
    }
    // Default to shadcn for unknown tokens
    else {
      if (!shadcnTokens[currentMode]) shadcnTokens[currentMode] = {};
      shadcnTokens[currentMode][key] = value;
    }
  });

  return {
    shadcn: Object.keys(shadcnTokens).length > 0 ? shadcnTokens : null,
    vscode: Object.keys(vscodeTokens).length > 0 ? vscodeTokens : null,
    shiki: Object.keys(shikiTokens).length > 0 ? shikiTokens : null,
  };
}

// Initialize with localStorage data immediately
const getInitialState = () => {
  const { theme, mode } = loadFromStorage();
  console.log('🔧 [getInitialState] Loading from storage:', {
    themeName: theme.name,
    themeId: theme.id,
    mode,
    hasRawTheme: !!theme.rawTheme
  });
  const computedTokens = computeThemeTokens(theme);
  const baseTokens = computedTokens[mode];
  const processedTokens: Record<string, string> = {};

  // Populate with base tokens
  for (const [key, value] of Object.entries(baseTokens)) {
    if (typeof value === "string") {
      processedTokens[key] = convertColorToHex(value);
    }
  }

  // Apply overrides from localStorage theme if they exist
  const dbThemeOverrides = (theme as any).overrides || {};
  let loadedShadcnOverride = null;
  let loadedVscodeOverride = null;
  let loadedShikiOverride = null;

  if (dbThemeOverrides.shadcn) {
    loadedShadcnOverride = dbThemeOverrides.shadcn;
    if (dbThemeOverrides.shadcn[mode]) {
      Object.entries(dbThemeOverrides.shadcn[mode]).forEach(([key, value]) => {
        if (typeof value === "string") {
          processedTokens[key] = convertColorToHex(value);
        }
      });
    }
  }

  if (dbThemeOverrides.vscode) {
    loadedVscodeOverride = dbThemeOverrides.vscode;
  }

  if (dbThemeOverrides.shiki) {
    loadedShikiOverride = dbThemeOverrides.shiki;
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
    allThemes: [theme.id === DEFAULT_THEME.id ? DEFAULT_THEME : theme, DEFAULT_THEME],
    tweakcnThemes: [],
    raysoThemes: [],
    tinteThemes: [],
    userThemes: [],
    tinteTheme,
    shadcnOverride: loadedShadcnOverride,
    vscodeOverride: loadedVscodeOverride,
    shikiOverride: loadedShikiOverride,
  };
};

export const usePersistentThemeStore = create<PersistentThemeState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state - now loads from localStorage immediately
      ...getInitialState(),

      // Actions
      initialize: async () => {
        const { theme, mode } = loadFromStorage();
        const currentState = get();
        console.log('🔄 [initialize] Called after mount:', {
          themeName: theme.name,
          themeId: theme.id,
          mode,
          currentStateName: currentState.activeTheme.name,
          themeChanged: theme.id !== currentState.activeTheme.id
        });

        // Skip reapplying theme if it's already the same and DOM is already updated
        const themeAlreadyApplied = theme.id === currentState.activeTheme.id &&
                                   mode === currentState.currentMode &&
                                   typeof window !== "undefined" &&
                                   (window as any).__TINTE_THEME__?.theme?.id === theme.id;


        // Get auth session
        const sessionResult = await authClient.getSession();
        const session = sessionResult.data;
        const user = session?.user || null;
        const isAuthenticated = !!user && !user.isAnonymous;
        const isAnonymous = !!user?.isAnonymous;

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
            description: `Beautiful ${themeData.name.toLowerCase()} theme from ray.so`,
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
            description: `Stunning ${themeData.name.toLowerCase()} theme created by tinte`,
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

        // Load user themes (database or localStorage)
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

        const allThemes = [
          DEFAULT_THEME,
          ...tinteThemes,
          ...raysoThemes,
          ...tweakcnThemes,
          ...userThemes,
        ].filter(
          (theme, index, arr) =>
            arr.findIndex((t) => t.id === theme.id) === index,
        );

        // Compute tokens
        const computedTokens = computeThemeTokens(theme);
        const baseTokens = computedTokens[mode];
        const processedTokens: Record<string, string> = {};

        // First, populate with base extrapolated tokens
        for (const [key, value] of Object.entries(baseTokens)) {
          if (typeof value === "string") {
            processedTokens[key] = convertColorToHex(value);
          }
        }

        // Apply overrides - prioritize localStorage overrides over database overrides
        // This ensures fresh overrides from localStorage are used immediately after refresh
        const dbThemeOverrides = (theme as any).overrides || {};
        let loadedShadcnOverride = null;
        let loadedVscodeOverride = null;
        let loadedShikiOverride = null;

        // First, load from database
        if (dbThemeOverrides.shadcn) {
          loadedShadcnOverride = dbThemeOverrides.shadcn;
        }
        if (dbThemeOverrides.vscode) {
          loadedVscodeOverride = dbThemeOverrides.vscode;
        }
        if (dbThemeOverrides.shiki) {
          loadedShikiOverride = dbThemeOverrides.shiki;
        }

        // Then, check localStorage for more recent overrides (from theme in localStorage)
        const localStorageOverrides = (theme as any).overrides || {};
        if (localStorageOverrides.shadcn) {
          loadedShadcnOverride = localStorageOverrides.shadcn;
        }
        if (localStorageOverrides.vscode) {
          loadedVscodeOverride = localStorageOverrides.vscode;
        }
        if (localStorageOverrides.shiki) {
          loadedShikiOverride = localStorageOverrides.shiki;
        }

        // Apply shadcn overrides to processed tokens for current mode
        if (loadedShadcnOverride && loadedShadcnOverride[mode]) {
          Object.entries(loadedShadcnOverride[mode]).forEach(([key, value]) => {
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
        } else {
          tinteTheme = DEFAULT_THEME.rawTheme as TinteTheme;
        }

        set({
          mounted: true,
          currentMode: mode,
          activeTheme: theme,
          user,
          isAuthenticated,
          isAnonymous,
          isDark: mode === "dark",
          currentTokens: processedTokens,
          hasEdits: false,
          canSave: isAuthenticated || isAnonymous,
          allThemes,
          tweakcnThemes,
          raysoThemes,
          tinteThemes,
          userThemes,
          tinteTheme,
          shadcnOverride: loadedShadcnOverride,
          vscodeOverride: loadedVscodeOverride,
          shikiOverride: loadedShikiOverride,
        });

        // Only apply theme to DOM if it's not already applied by TinteThemeScript
        if (!themeAlreadyApplied) {
          console.log('🎨 [initialize] Applying theme to DOM:', theme.name);
          applyProcessedTokensToDOM(theme, mode, processedTokens);
        } else {
          console.log('✅ [initialize] Theme already applied by script, skipping DOM update');
        }

        // Save to storage with current overrides so they persist across refreshes
        saveToStorage(theme, mode, {
          shadcn: loadedShadcnOverride,
          vscode: loadedVscodeOverride,
          shiki: loadedShikiOverride
        });
      },

      setMode: (mode) => {
        const { activeTheme } = get();

        set((state) => {
          const computedTokens = computeThemeTokens(activeTheme);
          const baseTokens = computedTokens[mode];
          const processedTokens: Record<string, string> = {};

          // First, populate with base extrapolated tokens
          for (const [key, value] of Object.entries(baseTokens)) {
            if (typeof value === "string") {
              processedTokens[key] = convertColorToHex(value);
            }
          }

          // Then, apply shadcn overrides if they exist for the new mode
          if (state.shadcnOverride && state.shadcnOverride[mode]) {
            Object.entries(state.shadcnOverride[mode]).forEach(([key, value]) => {
              if (typeof value === "string") {
                processedTokens[key] = convertColorToHex(value);
              }
            });
          }

          return {
            currentMode: mode,
            isDark: mode === "dark",
            currentTokens: { ...processedTokens, ...state.editedTokens },
            unsavedChanges: state.hasEdits,
          };
        });

        // Save to storage with current overrides
        const { shadcnOverride, vscodeOverride, shikiOverride } = get();
        saveToStorage(activeTheme, mode, { shadcn: shadcnOverride, vscode: vscodeOverride, shiki: shikiOverride });
        // Use processed tokens that include overrides
        const { currentTokens } = get();
        applyProcessedTokensToDOM(activeTheme, mode, currentTokens);
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
          set((state) => {
            const computedTokens = computeThemeTokens(activeTheme);
            const baseTokens = computedTokens[newMode];
            const processedTokens: Record<string, string> = {};

            // First, populate with base extrapolated tokens
            for (const [key, value] of Object.entries(baseTokens)) {
              if (typeof value === "string") {
                processedTokens[key] = convertColorToHex(value);
              }
            }

            // Then, apply shadcn overrides if they exist for the new mode
            if (state.shadcnOverride && state.shadcnOverride[newMode]) {
              Object.entries(state.shadcnOverride[newMode]).forEach(([key, value]) => {
                if (typeof value === "string") {
                  processedTokens[key] = convertColorToHex(value);
                }
              });
            }

            return {
              currentMode: newMode,
              isDark: newMode === "dark",
              currentTokens: { ...processedTokens, ...state.editedTokens },
              unsavedChanges: state.hasEdits,
            };
          });

          // Save to storage with current overrides
          const { shadcnOverride, vscodeOverride, shikiOverride } = get();
          saveToStorage(activeTheme, newMode, { shadcn: shadcnOverride, vscode: vscodeOverride, shiki: shikiOverride });
          // Use processed tokens that include overrides
          const { currentTokens } = get();
          applyProcessedTokensToDOM(activeTheme, newMode, currentTokens);
        });
      },

      selectTheme: (theme) => {
        const { currentMode, allThemes } = get();

        set((state) => {
          const computedTokens = computeThemeTokens(theme);
          const baseTokens = computedTokens[currentMode];
          const processedTokens: Record<string, string> = {};

          // First, populate with base extrapolated tokens
          for (const [key, value] of Object.entries(baseTokens)) {
            if (typeof value === "string") {
              processedTokens[key] = convertColorToHex(value);
            }
          }

          // Then, apply overrides from database if they exist for current mode
          const dbThemeOverrides = (theme as any).overrides || {};
          if (dbThemeOverrides.shadcn && dbThemeOverrides.shadcn[currentMode]) {
            Object.entries(dbThemeOverrides.shadcn[currentMode]).forEach(([key, value]) => {
              if (typeof value === "string") {
                processedTokens[key] = convertColorToHex(value);
              }
            });
          }

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
          } else {
            tinteTheme = DEFAULT_THEME.rawTheme as TinteTheme;
          }

          let updatedAllThemes = [...allThemes];
          const existingThemeIndex = allThemes.findIndex(t => t.id === theme.id);
          if (existingThemeIndex === -1) {
            updatedAllThemes.push(theme);
          } else {
            updatedAllThemes[existingThemeIndex] = theme;
          }

          // Load overrides from theme if they exist
          const loadedThemeOverrides = (theme as any).overrides || {};

          return {
            activeTheme: theme,
            allThemes: updatedAllThemes,
            currentTokens: processedTokens,
            editedTokens: {},
            hasEdits: false,
            unsavedChanges: false,
            tinteTheme,
            shadcnOverride: loadedThemeOverrides.shadcn || null,
            vscodeOverride: loadedThemeOverrides.vscode || null,
            shikiOverride: loadedThemeOverrides.shiki || null,
          };
        });

        // Save to storage with loaded overrides from database
        const { shadcnOverride, vscodeOverride, shikiOverride } = get();
        saveToStorage(theme, currentMode, { shadcn: shadcnOverride, vscode: vscodeOverride, shiki: shikiOverride });
        // Use processed tokens that include overrides
        const { currentTokens } = get();
        applyProcessedTokensToDOM(theme, currentMode, currentTokens);
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
          // Check if this is the user's own theme (multiple ways to detect)
          const isOwnTheme =
            state.activeTheme.user?.id === state.user?.id ||
            state.activeTheme.author === "You" ||
            (state.activeTheme.id && state.activeTheme.id.startsWith("theme_") && state.user);

          let updatedActiveTheme = { ...state.activeTheme };

          if (isOwnTheme) {
            // For own themes, keep the original name and don't create a new theme
            // Just mark as having edits for save indication
            updatedActiveTheme.name = state.activeTheme.name.replace(" (unsaved)", "");
          } else {
            // For themes that are not yours, change name to indicate it's now custom
            updatedActiveTheme = {
              ...state.activeTheme,
              name: "Custom (unsaved)",
              id: `custom_${Date.now()}`, // Give it a new ID so it becomes a new theme
              author: "You",
              user: state.user ? {
                id: state.user.id,
                name: state.user.name,
                email: state.user.email,
                image: state.user.image,
              } : null,
            };
          }

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
            processedValue,
          );

          if (key.startsWith("shadow-")) {
            const { activeTheme, currentMode, editedTokens } = get();
            const updatedEditedTokens = {
              ...editedTokens,
              [key]: processedValue,
            };

            const computedTokens = computeThemeTokens(activeTheme);
            const baseTokens = computedTokens[currentMode];
            const finalTokens = { ...baseTokens, ...updatedEditedTokens };

            const shadowVars = computeShadowVars(finalTokens);

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
            unsavedChanges: false,
            shadcnOverride: null,
            vscodeOverride: null,
            shikiOverride: null,
          };
        });

        // Apply theme with current processed tokens (including overrides)
        const { currentTokens } = get();
        applyProcessedTokensToDOM(activeTheme, currentMode, currentTokens);
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

          // Check if this is the user's own theme (consistent with editToken logic)
          const isUserOwnedTheme =
            state.activeTheme.user?.id === state.user?.id ||
            state.activeTheme.author === "You" ||
            (state.activeTheme.id && state.activeTheme.id.startsWith("theme_") && state.user);

          let updatedTheme;
          if (isUserOwnedTheme) {
            // For own themes, keep the original theme structure and name
            updatedTheme = {
              ...state.activeTheme,
              rawTheme: newTinteTheme,
              name: state.activeTheme.name.replace(" (unsaved)", ""), // Remove (unsaved) for own themes
            };
          } else {
            // Create a new custom theme for themes that are not yours
            updatedTheme = {
              id: `custom_${Date.now()}`,
              name: "Custom (unsaved)",
              description: "Custom theme with modifications",
              author: "You",
              provider: "tinte" as const,
              downloads: 0,
              likes: 0,
              views: 0,
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
              user: state.user ? {
                id: state.user.id,
                name: state.user.name,
                email: state.user.email,
                image: state.user.image,
              } : null,
            };
          }

          delete (updatedTheme as any).computedTokens;

          const computedTokens = computeThemeTokens(updatedTheme);
          const baseTokens = computedTokens[state.currentMode];
          const processedTokens: Record<string, string> = {};

          for (const [key, value] of Object.entries(baseTokens)) {
            if (typeof value === "string") {
              processedTokens[key] = convertColorToHex(value);
            }
          }

          // Handle tweakcn conversion if needed
          let finalActiveTheme;
          if (state.activeTheme.author === "tweakcn" && !isUserOwnedTheme) {
            const { convertTinteToShadcn } = require("@/lib/providers/shadcn");
            const convertedShadcnTheme = convertTinteToShadcn(newTinteTheme);
            finalActiveTheme = {
              ...updatedTheme,
              rawTheme: convertedShadcnTheme,
            };
          } else {
            finalActiveTheme = updatedTheme;
          }

          return {
            tinteTheme: newTinteTheme,
            activeTheme: finalActiveTheme,
            currentTokens: processedTokens,
            hasEdits: true,
            unsavedChanges: true,
          };
        });

        const { activeTheme, currentMode, shadcnOverride, vscodeOverride, shikiOverride } = get();
        saveToStorage(activeTheme, currentMode, { shadcn: shadcnOverride, vscode: vscodeOverride, shiki: shikiOverride });
        // Apply theme with current processed tokens (including overrides)
        const { currentTokens } = get();
        applyProcessedTokensToDOM(activeTheme, currentMode, currentTokens);
      },

      updateShadcnOverride: (override) => {
        set((state) => {
          const currentOverride = state.shadcnOverride || {};
          return {
            shadcnOverride: { ...currentOverride, ...override },
            unsavedChanges: true,
          };
        });

        // Immediately persist to localStorage
        const { activeTheme, currentMode, shadcnOverride, vscodeOverride, shikiOverride } = get();
        saveToStorage(activeTheme, currentMode, {
          shadcn: shadcnOverride,
          vscode: vscodeOverride,
          shiki: shikiOverride
        });
      },

      updateVscodeOverride: (override) => {
        set((state) => {
          const currentOverride = state.vscodeOverride || {};
          return {
            vscodeOverride: { ...currentOverride, ...override },
            unsavedChanges: true,
          };
        });

        // Immediately persist to localStorage
        const { activeTheme, currentMode, shadcnOverride, vscodeOverride, shikiOverride } = get();
        saveToStorage(activeTheme, currentMode, {
          shadcn: shadcnOverride,
          vscode: vscodeOverride,
          shiki: shikiOverride
        });
      },

      updateShikiOverride: (override) => {
        set((state) => {
          const currentOverride = state.shikiOverride || {};
          return {
            shikiOverride: { ...currentOverride, ...override },
            unsavedChanges: true,
          };
        });

        // Immediately persist to localStorage
        const { activeTheme, currentMode, shadcnOverride, vscodeOverride, shikiOverride } = get();
        saveToStorage(activeTheme, currentMode, {
          shadcn: shadcnOverride,
          vscode: vscodeOverride,
          shiki: shikiOverride
        });
      },

      resetOverrides: (provider) => {
        set((state) => {
          const updates: any = {};

          if (!provider || provider === 'shadcn') {
            updates.shadcnOverride = null;
          }
          if (!provider || provider === 'vscode') {
            updates.vscodeOverride = null;
          }
          if (!provider || provider === 'shiki') {
            updates.shikiOverride = null;
          }

          return {
            ...updates,
            unsavedChanges: Object.keys(updates).length > 0,
          };
        });

        // Immediately persist to localStorage
        const { activeTheme, currentMode, shadcnOverride, vscodeOverride, shikiOverride } = get();
        saveToStorage(activeTheme, currentMode, {
          shadcn: shadcnOverride,
          vscode: vscodeOverride,
          shiki: shikiOverride
        });
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

      saveTheme: async (name, makePublic = false) => {
        const {
          activeTheme,
          tinteTheme,
          shadcnOverride,
          vscodeOverride,
          shikiOverride,
          editedTokens,
          currentMode,
          isAuthenticated,
          isAnonymous,
          userThemes,
          allThemes
        } = get();

        set({ isSaving: true });

        try {
          // Clean up the name - remove "(unsaved)" suffix and handle custom themes
          let cleanName = name || activeTheme.name;
          if (cleanName.includes("(unsaved)")) {
            cleanName = cleanName.replace(" (unsaved)", "");
          }
          if (cleanName === "Custom") {
            cleanName = "My Custom Theme";
          }

          let themeToSave = {
            ...activeTheme,
            name: cleanName,
            id: activeTheme.id || `theme_${Date.now()}`,
            tags: activeTheme.tags?.filter(tag => tag !== "unsaved") || ["custom"],
          };

          // Organize edited tokens into appropriate overrides
          const organizedTokens = organizeEditedTokens(editedTokens, currentMode);

          const overrides = {
            shadcn: {
              ...shadcnOverride,
              ...(organizedTokens.shadcn ? { [currentMode]: { ...(shadcnOverride?.[currentMode] || {}), ...organizedTokens.shadcn[currentMode] } } : {}),
            },
            vscode: {
              ...vscodeOverride,
              ...(organizedTokens.vscode ? { [currentMode]: { ...(vscodeOverride?.[currentMode] || {}), ...organizedTokens.vscode[currentMode] } } : {}),
            },
            shiki: {
              ...shikiOverride,
              ...(organizedTokens.shiki ? { [currentMode]: { ...(shikiOverride?.[currentMode] || {}), ...organizedTokens.shiki[currentMode] } } : {}),
            },
          };

          let success = false;

          if (isAuthenticated) {
            // Get current state for user comparison
            const currentState = get();

            // Determine if this is an update or creation
            // Use the same logic as editToken for consistency
            const isOwnTheme =
              activeTheme.user?.id === currentState.user?.id ||
              activeTheme.author === "You" ||
              (activeTheme.id && activeTheme.id.startsWith("theme_") && currentState.user);

            const isUpdate = isOwnTheme &&
                           activeTheme.id &&
                           !activeTheme.id.startsWith("custom_");

            // Save to database for authenticated users
            const result = await saveThemeToDatabase(
              themeToSave,
              tinteTheme,
              overrides,
              makePublic,
              Boolean(isUpdate)
            );

            success = result.success;
            if (result.savedTheme) {
              themeToSave = result.savedTheme;
            }
          } else if (isAnonymous) {
            // Save to localStorage for anonymous users
            const updatedUserThemes = [...userThemes];
            const existingIndex = updatedUserThemes.findIndex(t => t.id === themeToSave.id);

            if (existingIndex >= 0) {
              updatedUserThemes[existingIndex] = themeToSave;
            } else {
              updatedUserThemes.push(themeToSave);
            }

            saveAnonymousThemes(updatedUserThemes);
            success = true;

            set({ userThemes: updatedUserThemes });
          }

          if (success) {
            // Update the theme in allThemes and userThemes
            const updatedAllThemes = [...allThemes];
            const updatedUserThemes = [...userThemes];

            const allThemeIndex = updatedAllThemes.findIndex(t => t.id === themeToSave.id);
            const userThemeIndex = updatedUserThemes.findIndex(t => t.id === themeToSave.id);

            // Update or add to allThemes
            if (allThemeIndex >= 0) {
              updatedAllThemes[allThemeIndex] = themeToSave;
            } else {
              updatedAllThemes.push(themeToSave);
            }

            // Update or add to userThemes
            if (userThemeIndex >= 0) {
              updatedUserThemes[userThemeIndex] = themeToSave;
            } else {
              updatedUserThemes.push(themeToSave);
            }

            set({
              unsavedChanges: false,
              hasEdits: false,
              editedTokens: {},
              lastSaved: new Date(),
              activeTheme: themeToSave,
              allThemes: updatedAllThemes,
              userThemes: updatedUserThemes,
            });
          }

          return success;
        } catch (error) {
          console.error("Error saving theme:", error);
          return false;
        } finally {
          set({ isSaving: false });
        }
      },

      deleteTheme: async (themeId) => {
        const { isAuthenticated, isAnonymous, userThemes } = get();

        try {
          if (isAuthenticated) {
            const response = await fetch(`/api/themes/${themeId}`, {
              method: "DELETE",
            });
            if (!response.ok) return false;
          } else if (isAnonymous) {
            const updatedUserThemes = userThemes.filter(t => t.id !== themeId);
            saveAnonymousThemes(updatedUserThemes);
            set({ userThemes: updatedUserThemes });
          }

          await get().loadUserThemes();
          return true;
        } catch (error) {
          console.error("Error deleting theme:", error);
          return false;
        }
      },

      loadUserThemes: async () => {
        const { isAuthenticated, isAnonymous } = get();

        try {
          let userThemes: ThemeData[] = [];

          if (isAuthenticated) {
            const response = await fetch("/api/user/themes");
            if (response.ok) {
              userThemes = await response.json();
            }
          } else if (isAnonymous) {
            userThemes = loadAnonymousThemes();
          }

          set({ userThemes });
        } catch (error) {
          console.error("Error loading user themes:", error);
        }
      },

      createNewTheme: (name) => {
        const { tinteTheme } = get();

        const newTheme: ThemeData = {
          id: `theme_${Date.now()}`,
          name,
          description: "Custom theme",
          author: "You",
          provider: "tinte" as const,
          downloads: 0,
          likes: 0,
          views: 0,
          tags: ["custom"],
          createdAt: new Date().toISOString(),
          colors: {
            primary: tinteTheme.light.pr,
            secondary: tinteTheme.light.sc,
            accent: tinteTheme.light.ac_1,
            foreground: tinteTheme.light.tx,
            background: tinteTheme.light.bg,
          },
          rawTheme: tinteTheme,
        };

        get().selectTheme(newTheme);
      },

      duplicateTheme: (theme, name) => {
        const duplicatedTheme = {
          ...theme,
          id: `theme_${Date.now()}`,
          name,
          author: "You",
          createdAt: new Date().toISOString(),
        };

        get().selectTheme(duplicatedTheme);
      },

      signInAnonymously: async () => {
        try {
          const result = await authClient.signIn.anonymous();
          if (result.data) {
            await get().initialize();
          }
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      },

      linkAccount: async () => {
        try {
          // The account linking will be handled by Better Auth's onLinkAccount callback
          // This just refreshes the state after linking
          await get().initialize();
        } catch (error) {
          console.error("Error linking account:", error);
        }
      },

      syncAnonymousThemes: async () => {
        const { isAuthenticated, userThemes } = get();

        if (!isAuthenticated || userThemes.length === 0) return;

        try {
          // Sync themes from localStorage to database
          for (const theme of userThemes) {
            await saveThemeToDatabase(
              theme,
              theme.rawTheme as TinteTheme,
              {},
              false
            );
          }

          // Clear localStorage themes
          localStorage.removeItem(ANONYMOUS_THEMES_KEY);
          await get().loadUserThemes();
        } catch (error) {
          console.error("Error syncing anonymous themes:", error);
        }
      },

      exportTheme: (format) => {
        const { activeTheme, tinteTheme, shadcnOverride, vscodeOverride, shikiOverride } = get();

        switch (format) {
          case "tinte":
            return JSON.stringify({ tinteTheme, overrides: { shadcnOverride, vscodeOverride, shikiOverride } }, null, 2);
          case "shadcn":
            return JSON.stringify(convertTheme("shadcn", tinteTheme), null, 2);
          case "vscode":
            return JSON.stringify(convertTheme("vscode", tinteTheme), null, 2);
          default:
            return JSON.stringify(activeTheme, null, 2);
        }
      },

      importTheme: (themeData, format) => {
        try {
          let theme: ThemeData;

          switch (format) {
            case "tinte":
              theme = {
                id: `imported_${Date.now()}`,
                name: themeData.name || "Imported Theme",
                description: "Imported theme",
                author: "Imported",
                provider: "tinte" as const,
                downloads: 0,
                likes: 0,
                views: 0,
                tags: ["imported"],
                createdAt: new Date().toISOString(),
                colors: {
                  primary: themeData.tinteTheme.light.pr,
                  secondary: themeData.tinteTheme.light.sc,
                  accent: themeData.tinteTheme.light.ac_1,
                  foreground: themeData.tinteTheme.light.tx,
                  background: themeData.tinteTheme.light.bg,
                },
                rawTheme: themeData.tinteTheme,
              };

              if (themeData.overrides) {
                set({
                  shadcnOverride: themeData.overrides.shadcnOverride,
                  vscodeOverride: themeData.overrides.vscodeOverride,
                  shikiOverride: themeData.overrides.shikiOverride,
                });
              }
              break;

            default:
              // Handle other formats
              theme = themeData;
          }

          get().selectTheme(theme);
          return true;
        } catch (error) {
          console.error("Error importing theme:", error);
          return false;
        }
      },

      addTheme: (theme) => {
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

      forkTheme: (theme, newName) => {
        const { user } = get();

        const forkedTheme: ThemeData = {
          ...theme,
          id: `fork_${Date.now()}`,
          name: newName || `${theme.name} (Fork)`,
          author: user?.name || "You",
          provider: "tinte" as const,
          createdAt: new Date().toISOString(),
          user: user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          } : null,
          tags: [...(theme.tags || []), "fork"],
        };

        get().selectTheme(forkedTheme);
      },
    })),
    { name: "persistent-theme-store" },
  ),
);