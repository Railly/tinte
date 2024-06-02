"use client";
import {
  BACKGROUND_LESS_PALETTE,
  CODE_SAMPLES,
  presets,
} from "@/lib/constants";
import { generateVSCodeTheme } from "@/lib/core";
import { defaultThemeConfig } from "@/lib/core/config";
import { Palette, ThemeConfig } from "@/lib/core/types";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Header } from "@/components/header";
import { Configuration } from "@/components/configuration";
import { debounce } from "@/lib/utils";
import { Preview } from "@/components/preview";

export default function Page(): JSX.Element {
  const [themeConfig, setThemeConfig] =
    useState<ThemeConfig>(defaultThemeConfig);
  const [code, setCode] = useState<string | undefined>(CODE_SAMPLES.typescript);
  const [isBackgroundless, setIsBackgroundless] = useState(false);
  const { theme: nextTheme, setTheme } = useTheme();
  const currentTheme = (
    nextTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : nextTheme
  ) as "light" | "dark";

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

  const updateCode = debounce((value: string | undefined) => {
    setCode(value);
  }, 500);

  const applyPreset = (presetName: string) => {
    if (!currentTheme) return;
    // @ts-ignore
    setThemeConfig((prevConfig) => ({
      ...prevConfig,
      displayName: presetName,
      palette: {
        light: isBackgroundless
          ? {
              ...presets[presetName]?.light,
              ...BACKGROUND_LESS_PALETTE.light,
            }
          : presets[presetName]?.light,
        dark: isBackgroundless
          ? {
              ...presets[presetName]?.dark,
              ...BACKGROUND_LESS_PALETTE.dark,
            }
          : presets[presetName]?.dark,
      },
    }));
  };

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

  const exportTheme = () => {
    const jsonString = JSON.stringify(theme, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${themeConfig.displayName}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const theme = generateVSCodeTheme(themeConfig);

  return (
    <div className="flex flex-col gap-2">
      <Header />
      <div className="flex flex-col md:flex-row gap-4 w-full h-full px-8 py-4 max-h-screen">
        <Preview theme={theme} code={code} updateCode={updateCode} />
        <Configuration
          themeConfig={themeConfig}
          currentTheme={currentTheme}
          isBackgroundless={isBackgroundless}
          onBackgroundlessChange={toggleBackgroundless}
          onThemeChange={(checked) => setTheme(checked ? "light" : "dark")}
          onPaletteColorChange={updatePaletteColor}
          onPresetSelect={applyPreset}
          onCopyPalette={() => {
            const jsonString = JSON.stringify(
              themeConfig.palette[currentTheme as "light" | "dark"],
              null,
              2
            );
            navigator.clipboard.writeText(jsonString);
          }}
          onExportTheme={exportTheme}
          presets={presets}
        />
      </div>
    </div>
  );
}
