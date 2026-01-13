"use client";

import { useCallback, useMemo } from "react";
import { convertThemeToVSCode } from "@/lib/providers/vscode";
import { useThemeContext } from "@/providers/theme";

export type ProviderType = "shadcn" | "vscode" | "shiki" | "zed";

export interface ProviderOverrideHook<T extends object = Record<string, any>> {
  // Current override data for the active mode
  overrides: T;
  // All override data (both light and dark modes)
  allOverrides: Record<string, T> | null;
  // Check if override exists for a specific key
  hasOverride: (key: string) => boolean;
  // Get override value for a key (falls back to base theme if no override)
  getValue: (key: string, fallback?: string) => string | undefined;
  // Set override for current mode
  setOverride: (key: string, value: string) => void;
  // Set multiple overrides for current mode
  setOverrides: (overrides: Partial<T>) => void;
  // Clear override for current mode
  clearOverride: (key: string) => void;
  // Clear all overrides for current mode
  clearAllOverrides: () => void;
  // Clear all overrides for all modes
  resetAllOverrides: () => void;
  // Check if any overrides exist
  hasAnyOverrides: boolean;
  // Merge base tokens with overrides for current mode
  getMergedTokens: (
    baseTokens: Record<string, string>,
  ) => Record<string, string>;
}

/**
 * Standardized hook for managing provider-specific overrides
 *
 * Usage:
 * ```typescript
 * const shadcnOverrides = useProviderOverrides("shadcn");
 * const vscodeOverrides = useProviderOverrides("vscode");
 * const shikiOverrides = useProviderOverrides("shiki");
 * ```
 */
export function useProviderOverrides<T extends object = Record<string, any>>(
  provider: ProviderType,
): ProviderOverrideHook<T> {
  const context = useThemeContext();
  const {
    currentMode,
    tinteTheme,
    shadcnOverride,
    vscodeOverride,
    shikiOverride,
    zedOverride,
    updateShadcnOverride,
    updateVscodeOverride,
    updateShikiOverride,
    updateZedOverride,
    resetOverrides,
  } = context;

  // Get the appropriate override data based on provider
  const allOverrides = useMemo(() => {
    let override;
    switch (provider) {
      case "shadcn":
        override = shadcnOverride;
        break;
      case "vscode":
        override = vscodeOverride;
        break;
      case "shiki":
        override = shikiOverride;
        break;
      case "zed":
        override = zedOverride;
        break;
      default:
        return null;
    }

    // For shadcn: overrides have structure { palettes: { light: {...}, dark: {...} } }
    // For vscode/shiki/zed: overrides are directly { light: {...}, dark: {...} }
    if (provider === "shadcn" && override?.palettes) {
      return override.palettes as Record<string, T>;
    }

    return override || null;
  }, [
    provider,
    shadcnOverride,
    vscodeOverride,
    shikiOverride,
    zedOverride,
  ]) as Record<string, T> | null;

  // Get overrides for current mode
  const overrides = useMemo<T>(() => {
    if (!allOverrides || !allOverrides[currentMode]) {
      return {} as T;
    }
    return allOverrides[currentMode] as T;
  }, [allOverrides, currentMode]);

  // Get base theme values for VSCode provider (for fallback)
  const baseThemeValues = useMemo(() => {
    if (provider !== "vscode" || !tinteTheme) return {};

    try {
      // Pass current overrides to get merged theme
      const vscodeTheme = convertThemeToVSCode(
        { rawTheme: tinteTheme },
        {} as any,
        allOverrides || {},
      );
      const currentTheme = vscodeTheme[currentMode as keyof typeof vscodeTheme];
      const values: Record<string, string> = {};

      // Add editor colors
      if (currentTheme?.colors) {
        Object.assign(values, currentTheme.colors);
      }

      // Add token colors
      if (currentTheme?.tokenColors) {
        currentTheme.tokenColors.forEach((tokenColor: any) => {
          if (tokenColor.name && tokenColor.settings?.foreground) {
            values[tokenColor.name] = tokenColor.settings.foreground;
          }
        });
      }

      return values;
    } catch (error) {
      console.warn("Failed to convert theme to VSCode for fallback:", error);
      return {};
    }
  }, [provider, tinteTheme, currentMode, allOverrides]);

  // Get the appropriate update function
  const updateFunction = useMemo(() => {
    switch (provider) {
      case "shadcn":
        return updateShadcnOverride;
      case "vscode":
        return updateVscodeOverride;
      case "shiki":
        return updateShikiOverride;
      case "zed":
        return updateZedOverride;
      default:
        return () => {};
    }
  }, [
    provider,
    updateShadcnOverride,
    updateVscodeOverride,
    updateShikiOverride,
    updateZedOverride,
  ]);

  // Check if override exists for a key
  const hasOverride = useCallback(
    (key: string): boolean => {
      return key in overrides && overrides[key as keyof T] !== undefined;
    },
    [overrides],
  );

  // Get value with fallback to base theme
  const getValue = useCallback(
    (key: string, fallback?: string): string | undefined => {
      if (hasOverride(key)) {
        const value = overrides[key as keyof T];
        return typeof value === "string" ? value : fallback;
      }

      // For VSCode provider, use base theme values as fallback
      if (provider === "vscode" && baseThemeValues[key]) {
        return baseThemeValues[key];
      }

      return fallback;
    },
    [overrides, hasOverride, provider, baseThemeValues],
  );

  // Set single override
  const setOverride = useCallback(
    (key: string, value: string) => {
      const currentOverrides = allOverrides || {};
      const modeOverrides = currentOverrides[currentMode] || {};

      // For shadcn: wrap in palettes, for vscode/shiki: direct structure
      if (provider === "shadcn") {
        updateFunction({
          palettes: {
            ...currentOverrides,
            [currentMode]: {
              ...modeOverrides,
              [key]: value,
            },
          },
        });
      } else {
        updateFunction({
          ...currentOverrides,
          [currentMode]: {
            ...modeOverrides,
            [key]: value,
          },
        });
      }
    },
    [allOverrides, currentMode, updateFunction, provider],
  );

  // Set multiple overrides
  const setOverrides = useCallback(
    (newOverrides: Partial<T>) => {
      const currentOverrides = allOverrides || {};
      const modeOverrides = currentOverrides[currentMode] || {};

      // For shadcn: wrap in palettes, for vscode/shiki: direct structure
      if (provider === "shadcn") {
        updateFunction({
          palettes: {
            ...currentOverrides,
            [currentMode]: {
              ...modeOverrides,
              ...newOverrides,
            },
          },
        });
      } else {
        updateFunction({
          ...currentOverrides,
          [currentMode]: {
            ...modeOverrides,
            ...newOverrides,
          },
        });
      }
    },
    [allOverrides, currentMode, updateFunction, provider],
  );

  // Clear single override
  const clearOverride = useCallback(
    (key: string) => {
      if (!allOverrides || !allOverrides[currentMode]) return;

      const currentOverrides = { ...allOverrides };
      const modeOverrides = {
        ...(currentOverrides[currentMode] as Record<string, any>),
      };
      delete modeOverrides[key];

      // For shadcn: wrap in palettes, for vscode/shiki: direct structure
      if (provider === "shadcn") {
        updateFunction({
          palettes: {
            ...currentOverrides,
            [currentMode]: modeOverrides,
          },
        });
      } else {
        updateFunction({
          ...currentOverrides,
          [currentMode]: modeOverrides,
        });
      }
    },
    [allOverrides, currentMode, updateFunction, provider],
  );

  // Clear all overrides for current mode
  const clearAllOverrides = useCallback(() => {
    if (!allOverrides) return;

    const currentOverrides = { ...allOverrides };
    delete currentOverrides[currentMode];

    // For shadcn: wrap in palettes, for vscode/shiki: direct structure
    if (provider === "shadcn") {
      updateFunction({
        palettes: currentOverrides,
      });
    } else {
      updateFunction(currentOverrides);
    }
  }, [allOverrides, currentMode, updateFunction, provider]);

  // Clear all overrides for all modes
  const resetAllOverrides = useCallback(() => {
    resetOverrides(provider);
  }, [provider, resetOverrides]);

  // Check if any overrides exist
  const hasAnyOverrides = useMemo(() => {
    if (!allOverrides) return false;

    return Object.keys(allOverrides).some((mode) => {
      const modeOverrides = allOverrides[mode as keyof typeof allOverrides];
      return (
        modeOverrides &&
        typeof modeOverrides === "object" &&
        Object.keys(modeOverrides).length > 0
      );
    });
  }, [allOverrides]);

  // Merge base tokens with current mode overrides
  const getMergedTokens = useCallback(
    (baseTokens: Record<string, string>) => {
      const merged = { ...baseTokens };

      if (overrides && typeof overrides === "object") {
        Object.entries(overrides).forEach(([key, value]) => {
          if (typeof value === "string") {
            merged[key] = value;
          }
        });
      }

      return merged;
    },
    [overrides],
  );

  return {
    overrides,
    allOverrides,
    hasOverride,
    getValue,
    setOverride,
    setOverrides,
    clearOverride,
    clearAllOverrides,
    resetAllOverrides,
    hasAnyOverrides,
    getMergedTokens,
  };
}

/**
 * Type-safe helpers for specific providers
 */
export const useShadcnOverrides = () => useProviderOverrides("shadcn");
export const useVSCodeOverrides = () => useProviderOverrides("vscode");
export const useShikiOverrides = () => useProviderOverrides("shiki");
export const useZedOverrides = () => useProviderOverrides("zed");
