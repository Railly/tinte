/* eslint-disable turbo/no-undeclared-env-vars */
"use client";
import { Header } from "@/components/header";
import { Configuration } from "@/components/configuration";
import { Preview } from "@/components/preview";
import { useThemeConfig } from "@/lib/hooks/use-theme-config";
import { useCodeSample } from "@/lib/hooks/use-code-sample";
import { useThemeExport } from "@/lib/hooks/use-theme-export";
import { ThemeConfigurationPanel } from "@/components/theme-configuration-panel";

export default function Page(): JSX.Element {
  if (typeof window === "undefined") return <></>;
  const {
    tinteTheme,
    presets,
    setPresets,
    isBackgroundless,
    toggleBackgroundless,
    updatePaletteColor,
    themeConfig,
    currentTheme,
    applyPreset,
    customThemesJSON,
    setNextTheme,
  } = useThemeConfig();

  const {
    selectedLanguage,
    code,
    handleCodeChange,
    handleLanguageChange,
    colorPickerShouldBeHighlighted,
    setColorPickerShouldBeHighlighted,
  } = useCodeSample();

  const { loading, exportVSIX } = useThemeExport();

  return (
    <div className="flex flex-col">
      <Header />

      <div className="flex flex-col gap-4 w-full h-full p-4 max-h-screen">
        <Preview
          theme={tinteTheme}
          code={code}
          updateCode={handleCodeChange}
          setColorPickerShouldBeHighlighted={setColorPickerShouldBeHighlighted}
          selectedLanguage={selectedLanguage}
        />
        <div className="flex flex-wrap  gap-4 items-center border p-4">
          <ThemeConfigurationPanel
            presets={presets}
            setPresets={setPresets}
            isBackgroundless={isBackgroundless}
            toggleBackgroundless={toggleBackgroundless}
            themeConfig={themeConfig}
            currentTheme={currentTheme as "light" | "dark"}
            applyPreset={applyPreset}
            customThemesJSON={customThemesJSON}
            setNextTheme={setNextTheme}
            selectedLanguage={selectedLanguage}
            handleLanguageChange={handleLanguageChange}
            loading={loading}
            exportVSIX={exportVSIX}
          />
        </div>
        <Configuration
          colorPickerShouldBeHighlighted={colorPickerShouldBeHighlighted}
          themeConfig={themeConfig}
          currentTheme={currentTheme as "light" | "dark"}
          onPaletteColorChange={updatePaletteColor}
        />
      </div>
    </div>
  );
}
