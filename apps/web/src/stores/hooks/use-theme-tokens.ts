"use client";

import { useMemo } from "react";
import { useThemeStore } from "@/stores/theme";

export interface ThemeFonts {
  sans: string;
  serif: string;
  mono: string;
}

export interface ThemeShadows {
  color: string;
  opacity: string;
  blur: string;
  spread: string;
  offsetX: string;
  offsetY: string;
}

export function useThemeTokens() {
  const currentTokens = useThemeStore((state) => state.currentTokens);
  const editedTokens = useThemeStore((state) => state.editedTokens);
  const hasEdits = useThemeStore((state) => state.hasEdits);
  const editToken = useThemeStore((state) => state.editToken);
  const resetTokens = useThemeStore((state) => state.resetTokens);
  const activeTheme = useThemeStore((state) => state.activeTheme);

  const fonts: ThemeFonts = useMemo(
    () => ({
      sans:
        currentTokens["font-sans"] ||
        "Inter, ui-sans-serif, system-ui, sans-serif",
      serif:
        currentTokens["font-serif"] ||
        'Georgia, Cambria, "Times New Roman", serif',
      mono:
        currentTokens["font-mono"] ||
        "JetBrains Mono, ui-monospace, SFMono-Regular, monospace",
    }),
    [currentTokens],
  );

  const shadows: ThemeShadows = useMemo(
    () => ({
      color: currentTokens["shadow-color"] || "hsl(0 0% 0%)",
      opacity: currentTokens["shadow-opacity"] || "0.1",
      blur: currentTokens["shadow-blur"] || "4px",
      spread: currentTokens["shadow-spread"] || "0px",
      offsetX: currentTokens["shadow-offset-x"] || "0px",
      offsetY: currentTokens["shadow-offset-y"] || "2px",
    }),
    [currentTokens],
  );

  const radius = currentTokens.radius || "0.5rem";

  const serifHeadings = useMemo(() => {
    const override = (activeTheme as any)?.shadcn_override;
    if (override?.serifHeadings) return true;
    const raw = (activeTheme as any)?.rawTheme;
    if (raw?.fonts?.serifHeadings) return true;
    return false;
  }, [activeTheme]);

  return {
    currentTokens,
    editedTokens,
    hasEdits,
    fonts,
    shadows,
    radius,
    serifHeadings,
    editToken,
    resetTokens,
  };
}
