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

  // Try different sources for extended properties
  if ((theme as any).shadcn_override) {
    extendedProps = (theme as any).shadcn_override;
    console.log("Using theme.shadcn_override for extended props:", extendedProps);
  } else if (overrides.shadcn?.[mode]) {
    extendedProps = overrides.shadcn[mode];
    console.log("Using overrides.shadcn[mode] for extended props:", extendedProps);
  } else if (overrides.shadcn?.light || overrides.shadcn?.dark) {
    extendedProps = overrides.shadcn[mode];
    console.log("Using overrides.shadcn from DB structure for extended props:", extendedProps);
  }

  if (extendedProps) {
    console.log("Applying extended properties:", extendedProps);

    if (extendedProps.fonts) {
      if (extendedProps.fonts.sans) processedTokens["font-sans"] = extendedProps.fonts.sans;
      if (extendedProps.fonts.serif) processedTokens["font-serif"] = extendedProps.fonts.serif;
      if (extendedProps.fonts.mono) processedTokens["font-mono"] = extendedProps.fonts.mono;
    }
    if (extendedProps.radius) processedTokens["radius"] = extendedProps.radius;
    if (extendedProps.letter_spacing) processedTokens["letter-spacing"] = extendedProps.letter_spacing;
    if (extendedProps.shadow) {
      const shadow = extendedProps.shadow;
      if (shadow.color) processedTokens["shadow-color"] = shadow.color;
      if (shadow.opacity) processedTokens["shadow-opacity"] = shadow.opacity;
      if (shadow.blur) processedTokens["shadow-blur"] = shadow.blur;
      if (shadow.spread) processedTokens["shadow-spread"] = shadow.spread;
      if (shadow.offset_x) processedTokens["shadow-offset-x"] = shadow.offset_x;
      if (shadow.offset_y) processedTokens["shadow-offset-y"] = shadow.offset_y;
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

  return {
    ...theme,
    id: `custom_${Date.now()}`,
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
          console.log("🎨 Theme Store selectTheme called with:", theme);
          console.log("Theme shadcn_override:", (theme as any).shadcn_override);
          console.log("Theme vscode_override:", (theme as any).vscode_override);
          console.log("Theme shiki_override:", (theme as any).shiki_override);

          const themeOverrides = (theme as any).overrides || {};

          // Check if we have database overrides and map them correctly
          const dbOverrides = {
            shadcn: (theme as any).shadcn_override || null,
            vscode: (theme as any).vscode_override || null,
            shiki: (theme as any).shiki_override || null,
          };

          console.log("Extracted DB overrides:", dbOverrides);
          console.log("Legacy theme.overrides:", themeOverrides);

          const finalOverrides = {
            ...themeOverrides,
            ...Object.fromEntries(
              Object.entries(dbOverrides).filter(([_, value]) => value !== null)
            )
          };

          console.log("Final overrides to use:", finalOverrides);

          const { mode } = get();
          const newTokens = computeTokens(theme, mode, finalOverrides, {});
          const newTinteTheme = extractTinteTheme(theme);

          set({
            activeTheme: theme,
            editedTokens: {},
            overrides: finalOverrides,
            unsavedChanges: false,
            currentTokens: newTokens,
            hasEdits: false,
            tinteTheme: newTinteTheme,
          });

          applyToDOM(theme, mode, newTokens);
          saveToStorage(theme, mode, themeOverrides);
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
          set((state) => {
            console.log(`🔧 Theme Store updateOverride for ${provider}:`, override);
            console.log("Current overrides before update:", state.overrides);

            const updatedTheme = createThemeForEdit(state.activeTheme);
            const newOverrides = {
              ...state.overrides,
              [provider]: { ...state.overrides[provider], ...override },
            };

            console.log("New overrides after update:", newOverrides);

            const newTokens = computeTokens(updatedTheme, state.mode, newOverrides, state.editedTokens);

            return {
              activeTheme: updatedTheme,
              overrides: newOverrides,
              currentTokens: newTokens,
              unsavedChanges: true,
              hasEdits: true,
            };
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
          saveToStorage(activeTheme, mode, overrides);
        },
      };
    }),
    { name: "theme-store" }
  )
);