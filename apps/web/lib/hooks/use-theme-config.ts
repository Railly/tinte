import { useState } from "react";
import { Palette, ThemeConfig } from "@/lib/core/types";
import { defaultThemeConfig } from "@/lib/core/config";
import { useTheme } from "next-themes";
import { BACKGROUND_LESS_PALETTE, PRESETS } from "../constants";
import { debounce } from "../utils";
import { generateVSCodeTheme } from "../core";

export const useThemeConfig = () => {
  if (typeof window === "undefined")
    return {
      presets: {},
      setPresets: () => {},
      isBackgroundless: false,
      currentTheme: "light",
      themeConfig: defaultThemeConfig,
      updatePaletteColor: () => {},
      setThemeConfig: () => {},
      applyPreset: () => {},
      toggleBackgroundless: () => {},
    };

  const customThemesRaw = window.localStorage.getItem("customThemes") || "{}";
  const customThemesJSON = JSON.parse(customThemesRaw);
  const lastPreset = window.localStorage.getItem("lastPreset");
  const defaultPresetName = lastPreset || defaultThemeConfig.displayName;
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme();
  const currentTheme = (
    nextTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : nextTheme
  ) as "light" | "dark";

  const [presets, setPresets] = useState({
    ...PRESETS,
    ...customThemesJSON,
  });
  const [isBackgroundless, setIsBackgroundless] = useState(false);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    ...defaultThemeConfig,
    displayName: defaultPresetName,
    name: defaultPresetName.toLowerCase().replace(/\s/g, "-"),
    palette: presets[defaultPresetName] as ThemeConfig["palette"],
  });

  const tinteTheme = generateVSCodeTheme(themeConfig);

  const toggleBackgroundless = () => {
    if (!currentTheme) return;
    setIsBackgroundless((prevMode) => !prevMode);
    setThemeConfig((prevConfig) => ({
      ...prevConfig,
      palette: {
        ...prevConfig.palette,
        [currentTheme]: !isBackgroundless
          ? {
              ...prevConfig.palette[currentTheme],
              ...BACKGROUND_LESS_PALETTE[currentTheme],
            }
          : presets[prevConfig.displayName]?.[currentTheme],
      },
    }));
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

  const applyPreset = (presetName: string, newPresets?: typeof presets) => {
    if (!currentTheme) return;
    const _presets = newPresets || presets;
    setThemeConfig((prevConfig) => ({
      ...prevConfig,
      displayName: presetName,
      palette: {
        light: isBackgroundless
          ? {
              ..._presets[presetName]?.light,
              ...BACKGROUND_LESS_PALETTE.light,
            }
          : _presets[presetName]?.light,
        dark: isBackgroundless
          ? {
              ..._presets[presetName]?.dark,
              ...BACKGROUND_LESS_PALETTE.dark,
            }
          : _presets[presetName]?.dark,
      },
    }));
    window.localStorage.setItem("lastPreset", presetName);
  };

  return {
    tinteTheme,
    presets,
    setPresets,
    isBackgroundless,
    currentTheme,
    themeConfig,
    updatePaletteColor,
    setThemeConfig,
    applyPreset,
    toggleBackgroundless,
    customThemesJSON,
    setNextTheme,
  };
};
