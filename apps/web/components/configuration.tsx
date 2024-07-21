import { Palette, ThemeConfig } from "@/lib/core/types";
import { useCallback, useEffect, useState } from "react";
import { ColorPalette } from "./color-palette";
import { ThemeGenerator } from "./theme-generator";

interface ConfigurationProps {
  themeConfig: ThemeConfig;
  currentTheme: "light" | "dark";
  onPaletteColorChange: (colorKey: keyof Palette, value: string) => void;
  colorPickerShouldBeHighlighted: {
    key: string;
    value: boolean;
  };
  onGenerateTheme: (description: string) => void;
  isGenerating: boolean;
  isEnhancing: boolean;
  themeDescription: string;
  setThemeDescription: (description: string) => void;
  onEnhanceDescription: () => void;
  advancedMode: boolean;
  onMultiplePaletteColorsChange: (colorUpdates: Partial<Palette>) => void;
  presets: Record<string, ThemeConfig>;
  applyPreset: (preset: string) => void;
}

export const Configuration: React.FC<ConfigurationProps> = ({
  themeConfig,
  currentTheme,
  onPaletteColorChange,
  colorPickerShouldBeHighlighted,
  advancedMode,
  onGenerateTheme,
  isGenerating,
  isEnhancing,
  themeDescription,
  setThemeDescription,
  onEnhanceDescription,
  onMultiplePaletteColorsChange,
  presets,
  applyPreset,
}) => {
  const [isColorModified, setIsColorModified] = useState(false);

  const handleShuffleTheme = useCallback(() => {
    if (isColorModified) {
      const confirmShuffle = window.confirm(
        "You have unsaved changes. Do you want to proceed without saving?"
      );
      if (!confirmShuffle) {
        setIsColorModified(false);
        return;
      }
    }
    const presetNames = Object.keys(presets);
    const randomPresetName =
      presetNames[Math.floor(Math.random() * presetNames.length)];
    if (randomPresetName) applyPreset(randomPresetName);
  }, [presets, applyPreset, isColorModified]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && event.target instanceof HTMLElement) {
        const targetTag = event.target.tagName.toLowerCase();
        if (
          !["input", "textarea"].includes(targetTag) &&
          !event.target.isContentEditable
        ) {
          event.preventDefault();
          handleShuffleTheme();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleShuffleTheme]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isColorModified) {
        event.preventDefault();
        event.returnValue = "";
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isColorModified]);

  return (
    <div className="h-max w-full overflow-y-auto">
      <ColorPalette
        themeConfig={themeConfig}
        currentTheme={currentTheme}
        onPaletteColorChange={onPaletteColorChange}
        colorPickerShouldBeHighlighted={colorPickerShouldBeHighlighted}
        advancedMode={advancedMode}
        onMultiplePaletteColorsChange={onMultiplePaletteColorsChange}
        setIsColorModified={setIsColorModified}
        handleShuffleTheme={handleShuffleTheme}
      />
      <ThemeGenerator
        onGenerateTheme={onGenerateTheme}
        isGenerating={isGenerating}
        isEnhancing={isEnhancing}
        themeDescription={themeDescription}
        setThemeDescription={setThemeDescription}
        onEnhanceDescription={onEnhanceDescription}
      />
    </div>
  );
};
