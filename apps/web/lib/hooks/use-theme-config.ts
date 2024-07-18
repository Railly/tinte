import { useState, useEffect, useMemo, useRef } from "react";
import { ThemeConfig, DarkLightPalette, Palette } from "@/lib/core/types";
import { defaultThemeConfig } from "@/lib/core/config";
import { useTheme } from "next-themes";
import { generateVSCodeTheme } from "../core";
import { useUser } from "@clerk/nextjs";
import { BACKGROUND_LESS_PALETTE } from "../constants";
import { debounce } from "../utils";
import { useSearchParams } from "next/navigation";

export const useThemeConfig = (initialThemes: ThemeConfig[]) => {
  const { user, isLoaded } = useUser();
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme();
  const searchParams = useSearchParams();

  const themeParam = searchParams?.get("theme");
  const defaultTheme = initialThemes[0] || defaultThemeConfig;

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultTheme);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme.displayName);
  const [customThemes, setCustomThemes] = useState<
    Record<string, DarkLightPalette>
  >({});
  const [presets, setPresets] = useState<Record<string, ThemeConfig>>({});
  const [isBackgroundless, setIsBackgroundless] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadRef = useRef(false);

  const tinteTheme = useMemo(
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
      const decodedThemeName = decodeURIComponent(themeParam);
      const matchingTheme = Object.entries(presets).find(([name, theme]) => {
        if ("displayName" in theme) {
          return (
            theme.displayName.toLowerCase() === decodedThemeName.toLowerCase()
          );
        } else {
          return name.toLowerCase() === decodedThemeName.toLowerCase();
        }
      });
      if (matchingTheme) {
        applyPreset(matchingTheme[0]);
      }
      initialLoadRef.current = true;
    }
  }, [isLoading, themeParam, presets]);

  const loadThemes = () => {
    const customThemesRaw = window.localStorage.getItem("customThemes") || "{}";
    const customThemesJSON = JSON.parse(customThemesRaw);
    setCustomThemes(customThemesJSON);

    const initialPresets = initialThemes.reduce(
      (acc, theme) => {
        acc[theme.name] = theme;
        return acc;
      },
      {} as Record<string, ThemeConfig>
    );
    const allPresets = { ...initialPresets, ...customThemesJSON };
    setPresets(allPresets);

    const defaultTheme = initialThemes[0] || defaultThemeConfig;
    setThemeConfig(defaultTheme);
    setSelectedTheme(defaultTheme.displayName);

    setIsLoading(false);
  };

  const toggleBackgroundless = () => {
    if (!currentTheme) return;
    setIsBackgroundless((prevMode) => !prevMode);
    setThemeConfig((prevConfig) => {
      const currentPreset = presets[prevConfig.displayName];
      let currentPalette = prevConfig.palette;

      if (currentPreset) {
        if ("palette" in currentPreset) {
          // Case: preset is ThemeConfig
          currentPalette = currentPreset.palette;
        } else {
          // Case: preset is DarkLightPalette
          currentPalette = currentPreset as DarkLightPalette;
        }
      }

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
            [colorKey]: value,
          },
        },
      }));
    },
    250
  );

  const applyPreset = (presetName: string) => {
    const preset = presets[presetName];
    if (!preset) return;

    setThemeConfig((prev) => {
      let newPalette: DarkLightPalette;
      let newTokenColors = prev.tokenColors;

      if ("palette" in preset && "tokenColors" in preset) {
        newPalette = preset.palette;
        newTokenColors = preset.tokenColors;
      } else {
        newPalette = preset as DarkLightPalette;
      }

      if (isBackgroundless) {
        newPalette = {
          light: { ...newPalette.light, ...BACKGROUND_LESS_PALETTE.light },
          dark: { ...newPalette.dark, ...BACKGROUND_LESS_PALETTE.dark },
        };
      }

      return {
        ...prev,
        name: presetName,
        displayName: preset.displayName || presetName,
        palette: newPalette,
        tokenColors: newTokenColors,
      };
    });

    setSelectedTheme(presetName);

    if (!user) {
      window.localStorage.setItem("lastPreset", presetName);
    }
  };

  const saveTheme = async (theme: ThemeConfig) => {
    try {
      const response = await fetch("/api/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });
      if (!response.ok) throw new Error("Failed to save theme");
      loadThemes(); // Reload themes after saving
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const deleteTheme = async (themeName: string) => {
    try {
      const response = await fetch(`/api/themes/${themeName}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete theme");
      loadThemes(); // Reload themes after deleting
    } catch (error) {
      console.error("Error deleting theme:", error);
    }
  };

  return {
    tinteTheme,
    themeConfig,
    selectedTheme,
    customThemes,
    presets,
    isBackgroundless,
    currentTheme,
    isLoading,
    setSelectedTheme,
    setPresets,
    toggleBackgroundless,
    updatePaletteColor,
    applyPreset,
    setNextTheme,
    saveTheme,
    deleteTheme,
  };
};
