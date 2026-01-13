"use client";

import { useEffect } from "react";
import type { ThemeData } from "@/lib/theme";
import { loadGoogleFont } from "@/utils/fonts";

export function useThemeFonts(theme: ThemeData | null) {
  useEffect(() => {
    if (!theme || typeof window === "undefined") return;

    try {
      // Extract fonts from different theme structures
      let fonts: any = null;

      // Check rawTheme for fonts (tinte/AI generated themes)
      if (
        "rawTheme" in theme &&
        theme.rawTheme &&
        typeof theme.rawTheme === "object"
      ) {
        const rawTheme = theme.rawTheme as any;

        // Check for nested fonts object first
        if ("fonts" in rawTheme) {
          fonts = rawTheme.fonts;
        }
      }

      // Check shadcn_override for fonts (database themes)
      const themeWithOverride = theme as any;
      if (!fonts && themeWithOverride.shadcn_override?.fonts) {
        fonts = themeWithOverride.shadcn_override.fonts;
      }

      // Preload fonts if found
      if (fonts) {
        // Preload sans-serif font
        if (fonts.sans) {
          const sansFamily = fonts.sans
            .split(",")[0]
            .trim()
            .replace(/['"]/g, "");
          loadGoogleFont(sansFamily, ["400", "500", "600"]);
        }

        // Preload serif font
        if (fonts.serif) {
          const serifFamily = fonts.serif
            .split(",")[0]
            .trim()
            .replace(/['"]/g, "");
          loadGoogleFont(serifFamily, ["400", "600"]);
        }

        // Preload mono font
        if (fonts.mono) {
          const monoFamily = fonts.mono
            .split(",")[0]
            .trim()
            .replace(/['"]/g, "");
          loadGoogleFont(monoFamily, ["400", "500"]);
        }
      }
    } catch (error) {
      console.warn("Failed to load theme fonts:", error);
    }
  }, [theme]);
}
