import { useState, useEffect, useMemo, useRef } from "react";
import { ThemeConfig, DarkLightPalette, Palette } from "@/lib/core/types";
import { defaultThemeConfig } from "@/lib/core/config";
import { useTheme } from "next-themes";
import { generateVSCodeTheme } from "../core";
import { useUser } from "@clerk/nextjs";
import { BACKGROUND_LESS_PALETTE } from "../constants";
import { debounce } from "../utils";
import { useSearchParams } from "next/navigation";

export const useThemeConfig = (allThemes: ThemeConfig[]) => {
  const { isLoaded } = useUser();
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme();
  const searchParams = useSearchParams();
  const decodedThemeName = decodeURIComponent(searchParams?.get("theme") || "");

  const themeParam = searchParams?.get("theme");
  const defaultTheme =
    allThemes.find((theme) => theme.name === decodedThemeName) ||
    allThemes[0] ||
    defaultThemeConfig;

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultTheme);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme.displayName);
  const [isBackgroundless, setIsBackgroundless] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadRef = useRef(false);

  const vsCodeTheme = useMemo(
    () => generateVSCodeTheme(themeConfig),
    [themeConfig]
  );

  const currentTheme = (
    nextTheme === "system"
      ? typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : nextTheme
  ) as "light" | "dark";

  useEffect(() => {
    if (isLoaded && !initialLoadRef.current) {
      loadThemes();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoading && themeParam && !initialLoadRef.current) {
      const matchingTheme = allThemes.find((theme) => {
        return theme.name.toLowerCase() === decodedThemeName.toLowerCase();
      });
      if (matchingTheme) {
        applyTheme(matchingTheme.displayName);
      } else {
        applyTheme(defaultTheme.displayName);
      }
      initialLoadRef.current = true;
    }
  }, [isLoading, themeParam, allThemes]);

  const loadThemes = () => {
    applyTheme(defaultTheme.displayName);
    setThemeConfig(defaultTheme);
    setSelectedTheme(defaultTheme.displayName);
    setIsLoading(false);
  };

  const toggleBackgroundless = () => {
    if (!currentTheme) return;
    setIsBackgroundless((prevMode) => !prevMode);
    setThemeConfig((prevConfig) => {
      const currentPalette = prevConfig.palette;

      const newPalette = {
        ...currentPalette,
        [currentTheme]: !isBackgroundless
          ? {
              ...currentPalette[currentTheme],
              ...BACKGROUND_LESS_PALETTE[currentTheme],
            }
          : currentPalette[currentTheme],
      };

      return {
        ...prevConfig,
        palette: newPalette,
      };
    });
  };

  const updatePaletteColor = debounce(
    (colorKey: keyof Palette, value: string) => {
      if (!currentTheme) return;
      setThemeConfig((prevConfig) => ({
        ...prevConfig,
        displayName: prevConfig.displayName ? prevConfig.displayName : "Custom",
        palette: {
          ...prevConfig.palette,
          [currentTheme]: {
            ...prevConfig.palette[currentTheme],
            [colorKey]: value.startsWith("#") ? value : `#${value}`,
          },
        },
      }));
    },
    250
  );

  const updatePaletteColors = debounce((colorUpdates: Partial<Palette>) => {
    if (!currentTheme) return;
    setThemeConfig((prevConfig) => ({
      ...prevConfig,
      displayName: prevConfig.displayName ? prevConfig.displayName : "Custom",
      palette: {
        ...prevConfig.palette,
        [currentTheme]: {
          ...prevConfig.palette[currentTheme],
          ...colorUpdates,
        },
      },
    }));
  }, 250);

  const applyTheme = (themeName: string) => {
    const theme = allThemes.find((theme) => theme.displayName === themeName);
    if (!theme) return;

    setThemeConfig((prev) => {
      let palette: DarkLightPalette = {
        light: { ...theme.palette.light },
        dark: { ...theme.palette.dark },
      };

      if (isBackgroundless) {
        palette = {
          light: { ...palette.light, ...BACKGROUND_LESS_PALETTE.light },
          dark: { ...palette.dark, ...BACKGROUND_LESS_PALETTE.dark },
        };
      }

      return {
        id: theme.id,
        name: themeName,
        category: theme.category,
        displayName: theme.displayName || themeName,
        isPublic: theme.isPublic,
        palette,
        tokenColors: prev.tokenColors,
        createdAt: theme.createdAt,
      };
    });

    setSelectedTheme(themeName);
  };

  return {
    vsCodeTheme,
    themeConfig,
    setThemeConfig,
    selectedTheme,
    themes: allThemes,
    isBackgroundless,
    currentTheme,
    isLoading,
    setSelectedTheme,
    toggleBackgroundless,
    updatePaletteColor,
    applyTheme,
    setNextTheme,
    updatePaletteColors,
  };
};
