import { formatHex, parse } from "culori";
import { convertTheme } from "@/lib/providers";
import {
  computeShadowVars,
  convertTinteToShadcn,
} from "@/lib/providers/shadcn";
import { shadcnToTinte } from "@/lib/shadcn-to-tinte";
import type { ThemeData } from "@/lib/theme-tokens";
import type { ShadcnTheme } from "@/types/shadcn";
import type { TinteTheme } from "@/types/tinte";
import { DEFAULT_THEME } from "@/utils/default-theme";
import type { ThemeMode, ThemeOverrides } from "../types";

export const convertColorToHex = (colorValue: string): string => {
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
};

export const computeThemeTokens = (
  theme: ThemeData,
): {
  light: Record<string, string>;
  dark: Record<string, string>;
} => {
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
};

export const computeProcessedTokens = (
  theme: ThemeData,
  mode: ThemeMode,
  overrides: ThemeOverrides,
): Record<string, string> => {
  const computedTokens = computeThemeTokens(theme);
  const baseTokens = computedTokens[mode];
  const processedTokens: Record<string, string> = {};

  // First, populate with base extrapolated tokens
  for (const [key, value] of Object.entries(baseTokens)) {
    if (typeof value === "string") {
      processedTokens[key] = convertColorToHex(value);
    }
  }

  // Apply overrides in order: shadcn -> vscode -> shiki
  const applyOverridesForMode = (providerOverrides: any) => {
    if (providerOverrides?.[mode]) {
      Object.entries(providerOverrides[mode]).forEach(([key, value]) => {
        if (typeof value === "string") {
          processedTokens[key] = convertColorToHex(value);
        }
      });
    }
  };

  applyOverridesForMode(overrides.shadcn);
  applyOverridesForMode(overrides.vscode);
  applyOverridesForMode(overrides.shiki);

  return processedTokens;
};

export const applyProcessedTokensToDOM = (
  theme: ThemeData,
  mode: ThemeMode,
  processedTokens: Record<string, string>,
): void => {
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
};
