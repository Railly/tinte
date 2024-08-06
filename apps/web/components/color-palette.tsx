import { ThemeConfig, Palette } from "@/lib/core/types";
import { tokenToScopeMapping } from "@/lib/core/config";
import { Button } from "./ui/button";
import { IconRandom, IconSpace } from "./ui/icons";
import { SimplifiedTokenEditor } from "./simplified-token-editor";
import {
  adjustUIProgression,
  ORDERED_KEYS,
  UI_COLORS,
  UIColor,
} from "@/app/utils";

interface ColorPaletteProps {
  themeConfig: ThemeConfig;
  currentTheme: "light" | "dark";
  onPaletteColorChange: (colorKey: keyof Palette, value: string) => void;
  colorPickerShouldBeHighlighted: {
    key: string;
    value: boolean;
  };
  advancedMode: boolean;
  onMultiplePaletteColorsChange: (colorUpdates: Partial<Palette>) => void;
  setIsColorModified: (isModified: boolean) => void;
  handleShuffleTheme: () => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  themeConfig,
  currentTheme,
  onPaletteColorChange,
  colorPickerShouldBeHighlighted,
  advancedMode,
  onMultiplePaletteColorsChange,
  setIsColorModified,
  handleShuffleTheme,
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
    const updatedPalette = adjustUIProgression(
      themeConfig.palette[currentTheme],
      currentTheme,
      value,
    );

    const uiColorUpdates = UI_COLORS.reduce((acc, key) => {
      acc[key] = updatedPalette[key];
      return acc;
    }, {} as Partial<Palette>);

    setIsColorModified(true);
    onMultiplePaletteColorsChange(uiColorUpdates);
  };

  return (
    <div className="border rounded-md mb-2">
      <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
        <h2 className="text-sm font-bold">Color Palette</h2>
        <Button
          className="pr-1"
          variant="outline"
          onClick={() => handleShuffleTheme()}
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
        {ORDERED_KEYS.map((key, index) => (
          <ColorEditor
            key={key || `empty-${index}`}
            colorKey={key}
            themeConfig={themeConfig}
            currentTheme={currentTheme}
            shouldHighlight={shouldHighlight}
            onPaletteColorChange={onPaletteColorChange}
            advancedMode={advancedMode}
            setIsColorModified={setIsColorModified}
            handleUIProgressionChange={handleUIProgressionChange}
          />
        ))}
      </div>
    </div>
  );
};

interface ColorEditorProps {
  colorKey: string;
  themeConfig: ThemeConfig;
  currentTheme: "light" | "dark";
  shouldHighlight: (tokenType: string) => boolean;
  onPaletteColorChange: (colorKey: keyof Palette, value: string) => void;
  advancedMode: boolean;
  setIsColorModified: (isModified: boolean) => void;
  handleUIProgressionChange: (value: string) => void;
}

const ColorEditor: React.FC<ColorEditorProps> = ({
  colorKey,
  themeConfig,
  currentTheme,
  shouldHighlight,
  onPaletteColorChange,
  advancedMode,
  setIsColorModified,
  handleUIProgressionChange,
}) => {
  if (colorKey === "") return <div />;

  if (colorKey === "ui-progression") {
    return (
      <SimplifiedTokenEditor
        colorKey={colorKey}
        colorValue={themeConfig.palette[currentTheme].background}
        onColorChange={(value) => handleUIProgressionChange(value)}
        advancedMode={advancedMode}
        isUIColor={true}
        isProgressionToken={true}
      />
    );
  }

  const colorValue =
    themeConfig.palette[currentTheme][colorKey as keyof Palette];

  return (
    <>
      <SimplifiedTokenEditor
        colorKey={colorKey}
        shouldHighlight={shouldHighlight(colorKey)}
        colorValue={colorValue}
        onColorChange={(value) => {
          setIsColorModified(true);
          onPaletteColorChange(colorKey as keyof Palette, value);
        }}
        advancedMode={advancedMode}
        isUIColor={UI_COLORS.includes(colorKey as UIColor)}
      />
      {colorKey === "background-2" && <div />}
    </>
  );
};
