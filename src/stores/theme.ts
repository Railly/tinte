"use client";

import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { shadcnToTinte } from "@/lib/shadcn-to-tinte";
import { computeThemeTokens } from "@/lib/theme-utils";
import type { ThemeData } from "@/lib/theme-tokens";
import { computeShadowVars } from "@/lib/providers/shadcn";
import type { ShadcnTheme } from "@/types/shadcn";
import type { TinteBlock, TinteTheme } from "@/types/tinte";
import { DEFAULT_THEME } from "@/utils/default-theme";

type ThemeMode = "light" | "dark";

interface ThemeOverrides {
  shadcn?: Record<string, any>;
  vscode?: Record<string, any>;
  shiki?: Record<string, any>;
}

interface ThemeState {
  mounted: boolean;
  mode: ThemeMode;
  activeTheme: ThemeData;
  editedTokens: Record<string, string>;
  overrides: ThemeOverrides;
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
  updateOverride: (provider: keyof ThemeOverrides, override: any) => void;
  resetOverrides: (provider?: keyof ThemeOverrides) => void;
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
      mode: storedMode || "light"
    };
  } catch {
    return { theme: DEFAULT_THEME, mode: "light" };
  }
};

const saveToStorage = (theme: ThemeData, mode: ThemeMode, overrides: ThemeOverrides) => {
  if (typeof window === "undefined") return;

  try {
    const themeToSave = { ...theme, overrides };
    localStorage.setItem("tinte-selected-theme", JSON.stringify(themeToSave));
    localStorage.setItem("tinte-theme-mode", mode);
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
};

const convertColorToHex = (color: string): string => {
  if (!color) return color;
  if (color.startsWith("#")) return color;

  if (color.startsWith("oklch(") || color.startsWith("hsl(")) {
    try {
      const { formatHex, rgb, oklch } = require("culori");
      const parsed = oklch(color);
      if (parsed) {
        return formatHex(rgb(parsed)) || color;
      }
    } catch {
      return color;
    }
  }

  return color;
};

const computeTokens = (theme: ThemeData, mode: ThemeMode, overrides: ThemeOverrides, editedTokens: Record<string, string>): Record<string, string> => {
  console.log("🎯 computeTokens called with:", { mode, overrides, editedTokens });

  const baseTokens = computeThemeTokens(theme)[mode];
  const processedTokens: Record<string, string> = {};

  console.log("Base tokens for", mode, ":", baseTokens);

  // Safety check for baseTokens
  if (baseTokens && typeof baseTokens === 'object') {
    for (const [key, value] of Object.entries(baseTokens)) {
      if (typeof value === "string") {
        processedTokens[key] = convertColorToHex(value);
      }
    }
  }

  console.log("After base tokens processing:", processedTokens);

  // Apply overrides from shadcn - handle different override structures
  if (overrides.shadcn) {
    console.log("Found shadcn overrides:", overrides.shadcn);

    // Handle new schema: overrides.shadcn.palettes[mode]
    if (overrides.shadcn.palettes?.[mode]) {
      console.log("Using new schema format for shadcn overrides");
      Object.entries(overrides.shadcn.palettes[mode]).forEach(([key, value]) => {
        if (typeof value === "string") {
          const isColorValue = key.includes("color") || key.includes("background") || key.includes("foreground") ||
                             key.includes("border") || key.includes("ring") || key.includes("primary") ||
                             key.includes("secondary") || key.includes("accent") || key.includes("destructive") ||
                             key.includes("muted") || key.includes("card") || key.includes("popover") ||
                             key.includes("sidebar") || key.includes("chart");

          processedTokens[key] = isColorValue ? convertColorToHex(value) : value;
        }
      });
    }
    // Handle legacy schema: overrides.shadcn[mode]
    else if (overrides.shadcn[mode]) {
      console.log("Using legacy schema format for shadcn overrides");
      Object.entries(overrides.shadcn[mode]).forEach(([key, value]) => {
        if (typeof value === "string") {
          const isColorValue = key.includes("color") || key.includes("background") || key.includes("foreground") ||
                             key.includes("border") || key.includes("ring") || key.includes("primary") ||
                             key.includes("secondary") || key.includes("accent") || key.includes("destructive") ||
                             key.includes("muted") || key.includes("card") || key.includes("popover") ||
                             key.includes("sidebar") || key.includes("chart");

          processedTokens[key] = isColorValue ? convertColorToHex(value) : value;
        }
      });
    }
    // Handle current DB structure: overrides.shadcn.light/dark.palettes.light/dark
    else if (overrides.shadcn.light || overrides.shadcn.dark) {
      console.log("Using DB structure format for shadcn overrides");
      const modeOverrides = overrides.shadcn[mode];
      if (modeOverrides?.palettes?.[mode]) {
        Object.entries(modeOverrides.palettes[mode]).forEach(([key, value]) => {
          if (typeof value === "string") {
            const isColorValue = key.includes("color") || key.includes("background") || key.includes("foreground") ||
                               key.includes("border") || key.includes("ring") || key.includes("primary") ||
                               key.includes("secondary") || key.includes("accent") || key.includes("destructive") ||
                               key.includes("muted") || key.includes("card") || key.includes("popover") ||
                               key.includes("sidebar") || key.includes("chart");

            processedTokens[key] = isColorValue ? convertColorToHex(value) : value;
          }
        });
      }
    }
  }

  // Apply extended properties from theme - handle different override structures
  let extendedProps = null;

  // Apply extended properties from multiple sources with proper priority
  // 1. Start with rawTheme for AI-generated extended properties (lowest priority)
  let baseExtendedProps = null;
  if (theme.rawTheme && (theme.rawTheme as any).fonts) {
    baseExtendedProps = theme.rawTheme;
    console.log("Found base extended props in theme.rawTheme:", baseExtendedProps);
  }
  // 2. Merge with theme.shadcn_override from database
  if ((theme as any).shadcn_override) {
    baseExtendedProps = {
      ...baseExtendedProps,
      ...(theme as any).shadcn_override
    };
    console.log("Merged with theme.shadcn_override:", baseExtendedProps);
  }
  // 3. Override with current user overrides (highest priority)
  if (overrides.shadcn) {
    extendedProps = {
      ...baseExtendedProps,
      ...overrides.shadcn
    };
    console.log("Final extended props with user overrides:", extendedProps);
  } else {
    extendedProps = baseExtendedProps;
  }

  if (extendedProps) {
    console.log("Applying extended properties:", extendedProps);

    // Handle fonts
    if (extendedProps.fonts) {
      if (extendedProps.fonts.sans) processedTokens["font-sans"] = extendedProps.fonts.sans;
      if (extendedProps.fonts.serif) processedTokens["font-serif"] = extendedProps.fonts.serif;
      if (extendedProps.fonts.mono) processedTokens["font-mono"] = extendedProps.fonts.mono;
    }

    // Handle radius - support both AI format (object) and legacy format (string)
    if (extendedProps.radius) {
      if (typeof extendedProps.radius === 'object') {
        // AI format: { sm: "0.125rem", md: "0.25rem", lg: "0.5rem", xl: "0.75rem" }
        Object.entries(extendedProps.radius).forEach(([key, value]) => {
          processedTokens[`radius-${key}`] = value as string;
        });
        // Also set the default radius to the medium value
        processedTokens["radius"] = extendedProps.radius.md || extendedProps.radius.lg || "0.5rem";
      } else {
        // Legacy format: single string value
        processedTokens["radius"] = extendedProps.radius;
      }
    }

    // Handle letter spacing
    if (extendedProps.letter_spacing) processedTokens["letter-spacing"] = extendedProps.letter_spacing;

    // Handle shadows - support both AI format (shadows) and legacy format (shadow)
    const shadowData = extendedProps.shadows || extendedProps.shadow;
    if (shadowData) {
      if (shadowData.color) processedTokens["shadow-color"] = shadowData.color;
      if (shadowData.opacity) processedTokens["shadow-opacity"] = shadowData.opacity;
      if (shadowData.blur) processedTokens["shadow-blur"] = shadowData.blur;
      if (shadowData.spread) processedTokens["shadow-spread"] = shadowData.spread;
      // Handle both AI format (offsetX/offsetY) and legacy format (offset_x/offset_y)
      if (shadowData.offsetX || shadowData.offset_x) {
        processedTokens["shadow-offset-x"] = shadowData.offsetX || shadowData.offset_x;
      }
      if (shadowData.offsetY || shadowData.offset_y) {
        processedTokens["shadow-offset-y"] = shadowData.offsetY || shadowData.offset_y;
      }
    }
  }

  // Merge edited tokens and generate shadow variables once at the end
  const finalTokens = { ...processedTokens, ...editedTokens };

  console.log("Final processed tokens before shadow generation:", finalTokens);

  // Generate computed shadow variables if any shadow properties exist
  const hasShadowProps = Object.keys(finalTokens).some(key => key.startsWith("shadow-"));
  if (hasShadowProps) {
    const shadowVars = computeShadowVars(finalTokens);
    Object.assign(finalTokens, shadowVars);
    console.log("Shadow variables generated:", shadowVars);
  }

  console.log("Final tokens to return:", finalTokens);
  return finalTokens;
};

const extractTinteTheme = (theme: ThemeData): TinteTheme => {
  if (theme?.rawTheme && typeof theme.rawTheme === "object") {
    if ("light" in theme.rawTheme && "dark" in theme.rawTheme) {
      const possibleTinte = theme.rawTheme as TinteTheme;
      if (possibleTinte.light.tx && possibleTinte.light.ui) {
        return possibleTinte;
      }
      return shadcnToTinte(theme.rawTheme as ShadcnTheme);
    }
    return shadcnToTinte(theme.rawTheme as ShadcnTheme);
  }

  if (theme && "light_bg" in theme && "dark_bg" in theme) {
    const flatTheme = theme as any;
    return {
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
  }

  return DEFAULT_THEME.rawTheme as TinteTheme;
};

const applyToDOM = (theme: ThemeData, mode: ThemeMode, tokens: Record<string, string>) => {
  if (typeof window === "undefined") return;

  console.log("🎨 applyToDOM called with:", { mode, tokenCount: Object.keys(tokens).length });

  const root = document.documentElement;
  root.setAttribute("data-theme", mode);

  console.log("Set data-theme attribute to:", mode);

  // Apply all tokens (colors, fonts, shadows, radius, etc.)
  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  console.log("✅ DOM updated with", Object.keys(tokens).length, "CSS variables");

  (window as any).__TINTE_THEME__ = { theme, mode };
};

const createThemeForEdit = (theme: ThemeData): ThemeData => {
  if (theme.name.includes("(unsaved)")) {
    return theme;
  }

  // Check if this is a user's own theme (starts with "theme_" or has proper user info)
  const isOwnTheme =
    theme.id?.startsWith("theme_") ||
    theme.author === "You" ||
    (theme.user?.id && theme.id && !theme.id.startsWith("custom_"));

  return {
    ...theme,
    // Preserve original ID for owned themes, create custom ID for built-in themes
    id: isOwnTheme ? theme.id : `custom_${Date.now()}`,
    name: theme.name === "Custom" ? "Custom (unsaved)" : `${theme.name} (unsaved)`,
  };
};

export const useThemeStore = create<ThemeStore>()(
  devtools(
    subscribeWithSelector((set, get) => {
      const { theme, mode } = loadFromStorage();
      const overrides = (theme as any).overrides || {};
      const initialTokens = computeTokens(theme, mode, overrides, {});

      return {
        mounted: false,
        mode,
        activeTheme: theme,
        editedTokens: {},
        overrides,
        unsavedChanges: false,
        isDark: mode === "dark",
        currentTokens: initialTokens,
        hasEdits: false,
        tinteTheme: extractTinteTheme(theme),

        initialize: () => {
          const state = get();
          set({ mounted: true });
          applyToDOM(state.activeTheme, state.mode, state.currentTokens);
          saveToStorage(state.activeTheme, state.mode, state.overrides);
        },

        setMode: (newMode) => {
          const { activeTheme, overrides, editedTokens } = get();
          const newTokens = computeTokens(activeTheme, newMode, overrides, editedTokens);
          set({
            mode: newMode,
            isDark: newMode === "dark",
            currentTokens: newTokens
          });
          applyToDOM(activeTheme, newMode, newTokens);
          saveToStorage(activeTheme, newMode, overrides);
        },

        toggleMode: (coords) => {
          const { mode } = get();
          const newMode = mode === "light" ? "dark" : "light";

          if (typeof window === "undefined") {
            get().setMode(newMode);
            return;
          }

          const root = document.documentElement;
          const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
          console.log("🎨 [Theme Store] selectTheme called with:", theme);
          console.log("🔍 [Theme Store] theme.rawTheme:", theme.rawTheme);
          console.log("🔍 [Theme Store] theme.concept:", theme.concept);
          console.log("📊 [Theme Store] Theme shadcn_override:", (theme as any).shadcn_override);
          console.log("📊 [Theme Store] Theme vscode_override:", (theme as any).vscode_override);
          console.log("📊 [Theme Store] Theme shiki_override:", (theme as any).shiki_override);
          console.log("📊 [Theme Store] Theme overrides property:", (theme as any).overrides);

          // If theme doesn't have rawTheme but has database columns, construct it
          let themeWithRawTheme = theme;
          if (!theme.rawTheme && (theme as any).light_bg) {
            console.log("🔧 [Theme Store] Constructing rawTheme from database columns");
            const dbTheme = theme as any;
            const rawTheme = {
              light: {
                bg: dbTheme.light_bg,
                bg_2: dbTheme.light_bg_2,
                ui: dbTheme.light_ui,
                ui_2: dbTheme.light_ui_2,
                ui_3: dbTheme.light_ui_3,
                tx: dbTheme.light_tx,
                tx_2: dbTheme.light_tx_2,
                tx_3: dbTheme.light_tx_3,
                pr: dbTheme.light_pr,
                sc: dbTheme.light_sc,
                ac_1: dbTheme.light_ac_1,
                ac_2: dbTheme.light_ac_2,
                ac_3: dbTheme.light_ac_3,
              },
              dark: {
                bg: dbTheme.dark_bg,
                bg_2: dbTheme.dark_bg_2,
                ui: dbTheme.dark_ui,
                ui_2: dbTheme.dark_ui_2,
                ui_3: dbTheme.dark_ui_3,
                tx: dbTheme.dark_tx,
                tx_2: dbTheme.dark_tx_2,
                tx_3: dbTheme.dark_tx_3,
                pr: dbTheme.dark_pr,
                sc: dbTheme.dark_sc,
                ac_1: dbTheme.dark_ac_1,
                ac_2: dbTheme.dark_ac_2,
                ac_3: dbTheme.dark_ac_3,
              },
            };

            themeWithRawTheme = {
              ...theme,
              rawTheme: rawTheme
            };
            console.log("✅ [Theme Store] Constructed rawTheme:", rawTheme);
          }

          const themeOverrides = (themeWithRawTheme as any).overrides || {};

          // Check if we have database overrides and map them correctly
          const dbOverrides = {
            shadcn: (themeWithRawTheme as any).shadcn_override || null,
            vscode: (themeWithRawTheme as any).vscode_override || null,
            shiki: (themeWithRawTheme as any).shiki_override || null,
          };

          console.log("Extracted DB overrides:", dbOverrides);
          console.log("Legacy theme.overrides:", themeOverrides);

          const finalOverrides = {
            ...themeOverrides,
            ...Object.fromEntries(
              Object.entries(dbOverrides).filter(([_, value]) => value !== null)
            )
          };

          // If there are extended properties in rawTheme but no overrides, populate the overrides
          // This ensures that AI-generated themes show their extended properties in the overrides panel
          if (themeWithRawTheme.rawTheme && !finalOverrides.shadcn?.fonts && !finalOverrides.shadcn?.radius && !finalOverrides.shadcn?.shadows) {
            const rawTheme = themeWithRawTheme.rawTheme as any;
            if (rawTheme.fonts || rawTheme.radius || rawTheme.shadows) {
              finalOverrides.shadcn = {
                ...finalOverrides.shadcn,
                ...(rawTheme.fonts && { fonts: rawTheme.fonts }),
                ...(rawTheme.radius && { radius: rawTheme.radius }),
                ...(rawTheme.shadows && { shadows: rawTheme.shadows }),
              };
              console.log("🎨 [Theme Store] Auto-populated overrides from rawTheme:", finalOverrides.shadcn);
            }
          }

          console.log("🔧 [Theme Store] Final overrides to use:", finalOverrides);

          const { mode } = get();
          console.log("🎯 [Theme Store] Computing tokens for mode:", mode);
          const newTokens = computeTokens(themeWithRawTheme, mode, finalOverrides, {});
          console.log("🎨 [Theme Store] Computed tokens:", newTokens);
          const newTinteTheme = extractTinteTheme(themeWithRawTheme);

          set({
            activeTheme: themeWithRawTheme,
            editedTokens: {},
            overrides: finalOverrides,
            unsavedChanges: false,
            currentTokens: newTokens,
            hasEdits: false,
            tinteTheme: newTinteTheme,
          });

          applyToDOM(theme, mode, newTokens);
          saveToStorage(theme, mode, themeOverrides);

          // Reset save state in auth store when switching themes
          // This needs to be imported dynamically to avoid circular dependency
          if (typeof window !== "undefined") {
            import("@/stores/auth").then(({ useAuthStore }) => {
              const authStore = useAuthStore.getState();
              // Use Zustand's set method to properly update the store
              useAuthStore.setState({
                isSaving: false,
                lastSaved: null,
              });
            });

            // Update URL if we're in workbench and theme has a slug
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/workbench/') && themeWithRawTheme.slug) {
              const newUrl = `/workbench/${themeWithRawTheme.slug}${window.location.search}`;
              window.history.replaceState(null, '', newUrl);
              console.log('🔗 [Theme Store] URL updated to:', newUrl);
            }
          }
        },

        editToken: (key, value) => {
          const processedValue = key.includes("font") || key.includes("shadow") ||
                               key === "radius" || key === "spacing" || key === "letter-spacing"
                               ? value : convertColorToHex(value);

          set((state) => {
            const updatedTheme = createThemeForEdit(state.activeTheme);
            const newEditedTokens = { ...state.editedTokens, [key]: processedValue };
            const newCurrentTokens = { ...state.currentTokens, [key]: processedValue };

            return {
              activeTheme: updatedTheme,
              editedTokens: newEditedTokens,
              currentTokens: newCurrentTokens,
              unsavedChanges: true,
              hasEdits: true,
            };
          });

          if (typeof window !== "undefined") {
            document.documentElement.style.setProperty(`--${key}`, processedValue);
          }
        },

        resetTokens: () => {
          const { activeTheme, mode } = get();
          const newTokens = computeTokens(activeTheme, mode, {}, {});

          set({
            editedTokens: {},
            overrides: {},
            unsavedChanges: false,
            hasEdits: false,
            currentTokens: newTokens,
          });

          applyToDOM(activeTheme, mode, newTokens);
          saveToStorage(activeTheme, mode, {});
        },

        updateTinteTheme: (targetMode, updates) => {
          set((state) => {
            const newTinteTheme = {
              ...state.tinteTheme,
              [targetMode]: { ...state.tinteTheme[targetMode], ...updates },
            };

            const updatedTheme = createThemeForEdit({
              ...state.activeTheme,
              rawTheme: newTinteTheme,
            });

            const newTokens = computeTokens(updatedTheme, state.mode, state.overrides, state.editedTokens);

            return {
              activeTheme: updatedTheme,
              tinteTheme: newTinteTheme,
              currentTokens: newTokens,
              unsavedChanges: true,
              hasEdits: true,
            };
          });

          const { activeTheme, mode, overrides, currentTokens } = get();
          applyToDOM(activeTheme, mode, currentTokens);
          saveToStorage(activeTheme, mode, overrides);
        },

        updateOverride: (provider, override) => {
          console.log(`🔧 [updateOverride] Called for ${provider}:`, override);
          set((state) => {
            console.log("🔍 [updateOverride] Current state before update:", {
              unsavedChanges: state.unsavedChanges,
              hasEdits: state.hasEdits,
              overrides: state.overrides
            });

            // DON'T create a new theme for overrides - just update the override state
            const newOverrides = {
              ...state.overrides,
              [provider]: { ...state.overrides[provider], ...override },
            };

            console.log("🆕 [updateOverride] New overrides after update:", newOverrides);

            const newTokens = computeTokens(state.activeTheme, state.mode, newOverrides, state.editedTokens);

            const newState = {
              // Keep the same activeTheme - don't create a new one
              overrides: newOverrides,
              currentTokens: newTokens,
              unsavedChanges: true,
              hasEdits: true,
            };

            console.log("✅ [updateOverride] Setting new state:", {
              unsavedChanges: newState.unsavedChanges,
              hasEdits: newState.hasEdits
            });

            return newState;
          });

          const { activeTheme, mode, overrides, currentTokens } = get();
          applyToDOM(activeTheme, mode, currentTokens);
          saveToStorage(activeTheme, mode, overrides);
        },

        resetOverrides: (provider) => {
          set((state) => {
            const newOverrides = { ...state.overrides };

            if (provider) {
              const key = provider as keyof ThemeOverrides;
              delete newOverrides[key];
            } else {
              (Object.keys(newOverrides) as Array<keyof ThemeOverrides>).forEach(key => {
                delete newOverrides[key];
              });
            }

            const newTokens = computeTokens(state.activeTheme, state.mode, newOverrides, state.editedTokens);

            return {
              overrides: newOverrides,
              currentTokens: newTokens,
              unsavedChanges: Object.keys(newOverrides).length > 0,
              hasEdits: Object.keys(newOverrides).length > 0 || Object.keys(state.editedTokens).length > 0,
            };
          });

          const { activeTheme, mode, overrides, currentTokens } = get();
          applyToDOM(activeTheme, mode, currentTokens);
          console.log("💾 [resetOverrides] Saving to localStorage with cleared overrides:", overrides);
          saveToStorage(activeTheme, mode, overrides);
        },

        // Mark current theme as saved (clear unsaved changes)
        markAsSaved: () => {
          console.log("🧹 [markAsSaved] Clearing unsaved changes");
          set({
            unsavedChanges: false,
            hasEdits: false,
          });
          console.log("✅ [markAsSaved] State cleared");
        },
      };
    }),
    { name: "theme-store" }
  )
);