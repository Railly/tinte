"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useThemeContext } from "@/providers/theme";
import type {
  ProviderOverrideHook,
  ProviderType,
} from "./use-provider-overrides";

export interface ClearOverridesConfig {
  provider: ProviderType;
  providerHook: ProviderOverrideHook;
  providerDisplayName: string;
}

export interface ClearOverridesResult {
  hasOverrides: boolean;
  isClearing: boolean;
  handleClearOverrides: () => Promise<void>;
}

/**
 * Abstraction for clearing provider-specific overrides
 * Handles both local store and database cleanup with UI state management
 */
export function useClearOverrides({
  provider,
  providerHook,
  providerDisplayName,
}: ClearOverridesConfig): ClearOverridesResult {
  const { activeTheme, saveCurrentTheme, selectTheme } = useThemeContext();
  const [isClearing, setIsClearing] = useState(false);

  // Check if there are any overrides for this provider
  const hasOverrides = useMemo(() => {
    // Check local store overrides
    const hasLocalOverrides = providerHook.hasAnyOverrides;

    // Check if theme has DB overrides
    const dbOverrideKey = `${provider}_override`;
    const hasDbOverrides =
      (activeTheme as any)?.[dbOverrideKey] &&
      Object.keys((activeTheme as any)[dbOverrideKey]).length > 0;

    return hasLocalOverrides || hasDbOverrides;
  }, [
    provider,
    providerHook.hasAnyOverrides,
    providerHook.allOverrides,
    activeTheme,
    providerDisplayName,
  ]);

  // Clear all overrides for this provider
  const handleClearOverrides = useCallback(async () => {
    if (!activeTheme?.id || !activeTheme.id.startsWith("theme_")) {
      toast.error("Can only clear overrides for saved themes");
      return;
    }

    setIsClearing(true);
    try {
      providerHook.resetAllOverrides();

      // Prepare arguments for saveCurrentTheme based on provider
      let shadcnOverride: any;
      let _vscodeOverride: any;
      let _shikiOverride: any;

      switch (provider) {
        case "shadcn":
          shadcnOverride = null;
          break;
        case "vscode":
          _vscodeOverride = null;
          break;
        case "shiki":
          _shikiOverride = null;
          break;
      }

      // Clear from database by saving with null override for this provider
      const result = await saveCurrentTheme(
        activeTheme.name,
        activeTheme.is_public ?? false,
        shadcnOverride,
      );

      if (result.success) {
        // Force UI repaint by re-selecting the theme without overrides
        const dbOverrideKey = `${provider}_override`;
        const cleanTheme = {
          ...activeTheme,
          [dbOverrideKey]: null, // Remove DB overrides
          overrides: {
            ...activeTheme.overrides,
            [provider]: null, // Remove local overrides
          },
        };

        selectTheme(cleanTheme);
        toast.success(`Cleared ${providerDisplayName} overrides`);
      } else {
        toast.error("Failed to clear overrides from database");
      }
    } catch (error) {
      console.error(`Failed to clear ${providerDisplayName} overrides:`, error);
      toast.error("Error clearing overrides");
    } finally {
      setIsClearing(false);
    }
  }, [
    activeTheme,
    provider,
    providerDisplayName,
    providerHook,
    saveCurrentTheme,
    selectTheme,
  ]);

  return {
    hasOverrides,
    isClearing,
    handleClearOverrides,
  };
}
