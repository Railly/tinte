import React from "react";
import { ThemeConfig, Palette } from "@/lib/core/types";
import { tokenToScopeMapping } from "@/lib/core/config";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  IconGenerate,
  IconLoading,
  IconRandom,
  IconSpace,
  IconSparkles,
} from "./ui/icons";
import { SimplifiedTokenEditor } from "./simplified-token-editor";
import { adjustUIProgression, ORDERED_KEYS, UI_COLORS } from "@/app/utils.";

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
}) => {
  const shouldHighlight = (tokenType: string): boolean => {
    return Object.entries(tokenToScopeMapping).some(([key, scopes]) => {
      const isMatch = Array.isArray(scopes)
        ? scopes.includes(colorPickerShouldBeHighlighted.key)
        : scopes === tokenType;
      return (
        isMatch &&
        themeConfig.tokenColors[key as keyof typeof tokenToScopeMapping] ===
          tokenType &&
        colorPickerShouldBeHighlighted.value
      );
    });
  };

  const handleUIProgressionChange = (value: string): void => {
    console.log("UI Progression Change:", value);

    const updatedPalette = adjustUIProgression(
      themeConfig.palette[currentTheme],
      currentTheme,
      value
    );

    console.log("Updated Palette:", updatedPalette);

    const uiColorUpdates = UI_COLORS.reduce((acc, key) => {
      acc[key] = updatedPalette[key];
      return acc;
    }, {} as Partial<Palette>);

    onMultiplePaletteColorsChange(uiColorUpdates);
  };

  const renderColorEditor = (key: string, index: number) => {
    if (key === "") return <div key={`empty-${index}`} />;

    if (key === "ui-progression") {
      return (
        <SimplifiedTokenEditor
          key={key}
          colorKey={key}
          colorValue={themeConfig.palette[currentTheme].background}
          onColorChange={handleUIProgressionChange}
          advancedMode={advancedMode}
          isUIColor={true}
          isProgressionToken={true}
        />
      );
    }

    const colorValue = themeConfig.palette[currentTheme][key as keyof Palette];

    return (
      <>
        <SimplifiedTokenEditor
          key={key}
          colorKey={key}
          shouldHighlight={shouldHighlight(key)}
          colorValue={colorValue}
          onColorChange={(value) =>
            onPaletteColorChange(key as keyof Palette, value)
          }
          advancedMode={advancedMode}
          isUIColor={UI_COLORS.includes(key as any)}
        />
        {key === "background-2" && <div key={`empty-${index}`} />}
      </>
    );
  };

  return (
    <div className="h-max w-full overflow-y-auto">
      <div className="border rounded-md mb-2">
        <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
          <h2 className="text-sm font-bold">Color Palette</h2>
          <Button
            className="pr-1"
            variant="outline"
            onClick={() => onGenerateTheme(themeDescription)}
          >
            <IconRandom />
            <span className="ml-2">Shuffle</span>
            <span className="ml-4 hidden md:flex items-center border py-0.5 px-1 rounded-md">
              <kbd className="text-xs">Space</kbd>
              <IconSpace className="w-4 h-4 ml-1" />
            </span>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2">
          {ORDERED_KEYS.map(renderColorEditor)}
        </div>
      </div>

      <div className="border rounded-md">
        <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
          <h2 className="text-sm font-bold">Theme Generator</h2>
          <Button
            variant="outline"
            onClick={() => onGenerateTheme(themeDescription)}
            disabled={isGenerating || themeDescription.trim().length < 3}
          >
            {isGenerating ? (
              <IconLoading className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <IconGenerate className="w-4 h-4 mr-2" />
            )}
            <span>{isGenerating ? "Generating..." : "Generate Theme"}</span>
          </Button>
        </div>

        <div className="p-2 relative">
          <Textarea
            placeholder="Describe your theme here..."
            value={themeDescription}
            onChange={(e) => setThemeDescription(e.target.value)}
            className="resize-none w-full !h-32 !pb-10"
            minLength={3}
            maxLength={150}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onEnhanceDescription}
            className="absolute bottom-4 left-4 text-muted-foreground hover:text-foreground"
            disabled={isEnhancing || themeDescription.trim().length < 3}
          >
            {isEnhancing ? (
              <>
                <IconLoading className="w-4 h-4 mr-1 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <IconSparkles className="w-4 h-4 mr-1" />
                Enhance
              </>
            )}
          </Button>
          <span className="absolute bottom-4 right-4 text-muted-foreground text-sm">
            {themeDescription.length}/150
          </span>
        </div>
      </div>
    </div>
  );
};
