"use client";

import { useCallback } from "react";
import { useThemeStore } from "@/stores/theme";
import type { NormalizedOverrides, ProviderOverride } from "@/types/overrides";

export function useThemeOverrides() {
  const overrides = useThemeStore((state) => state.overrides);
  const updateOverride = useThemeStore((state) => state.updateOverride);
  const resetOverrides = useThemeStore((state) => state.resetOverrides);

  const updateShadcnOverride = useCallback(
    (override: ProviderOverride) => updateOverride("shadcn", override),
    [updateOverride],
  );

  const updateVscodeOverride = useCallback(
    (override: ProviderOverride) => updateOverride("vscode", override),
    [updateOverride],
  );

  const updateShikiOverride = useCallback(
    (override: ProviderOverride) => updateOverride("shiki", override),
    [updateOverride],
  );

  const updateZedOverride = useCallback(
    (override: ProviderOverride) => updateOverride("zed", override),
    [updateOverride],
  );

  return {
    overrides,
    shadcnOverride: overrides.shadcn,
    vscodeOverride: overrides.vscode,
    shikiOverride: overrides.shiki,
    zedOverride: overrides.zed,
    updateOverride,
    resetOverrides,
    updateShadcnOverride,
    updateVscodeOverride,
    updateShikiOverride,
    updateZedOverride,
  };
}

export type { NormalizedOverrides, ProviderOverride };
