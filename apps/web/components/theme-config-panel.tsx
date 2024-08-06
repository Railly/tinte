import { Palette, ThemeConfig } from "@/lib/core/types";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { ColorPalette } from "./color-palette";
import { ThemeGenerator } from "./theme-generator";
import { useBinaryTheme } from "@/lib/hooks/use-binary-theme";

interface ThemeConfigPanelProps {
  themeConfig: ThemeConfig;
  onPaletteColorChange: (colorKey: keyof Palette, value: string) => void;
  colorPickerShouldBeHighlighted: {
    key: string;
    value: boolean;
  };
  themeDescription: string;
  setThemeDescription: (description: string) => void;
  advancedMode: boolean;
  onMultiplePaletteColorsChange: (colorUpdates: Partial<Palette>) => void;
  themes: ThemeConfig[];
  applyTheme: (preset: string) => void;
  setThemeConfig: Dispatch<SetStateAction<ThemeConfig>>;
  isColorModified: boolean;
  setIsColorModified: Dispatch<SetStateAction<boolean>>;
}

export const ThemeConfigPanel: React.FC<ThemeConfigPanelProps> = ({
  themeConfig,
  onPaletteColorChange,
  colorPickerShouldBeHighlighted,
  advancedMode,
  themeDescription,
  setThemeDescription,
  onMultiplePaletteColorsChange,
  themes,
  applyTheme,
  setThemeConfig,
  isColorModified,
  setIsColorModified,
}) => {
  const { currentTheme } = useBinaryTheme();
  const handleShuffleTheme = useCallback(() => {
    if (isColorModified) {
      const confirmShuffle = window.confirm(
        "You have unsaved changes. Do you want to proceed without saving?",
      );
      if (!confirmShuffle) {
        setIsColorModified(false);
        return;
      }
    }
    const themeNames = themes.map((theme) => theme.displayName);
    const randomPresetName =
      themeNames[Math.floor(Math.random() * themeNames.length)];
    if (randomPresetName) applyTheme(randomPresetName);
  }, [themes, applyTheme, isColorModified]);

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
        themeDescription={themeDescription}
        setThemeDescription={setThemeDescription}
        setThemeConfig={setThemeConfig}
        setIsColorModified={setIsColorModified}
      />
    </div>
  );
};
