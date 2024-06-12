import { ThemeConfig, Palette } from "@/lib/core/types";
import { entries } from "@/lib/utils";
import { TokenEditor } from "@/components/token-editor";
import { tokenToScopeMapping } from "@/lib/core/config";

interface ConfigurationProps {
  loading: boolean;
  themeConfig: ThemeConfig;
  currentTheme: "light" | "dark";
  isBackgroundless: boolean;
  onBackgroundlessChange: () => void;
  onThemeChange: (checked: boolean) => void;
  onPaletteColorChange: (colorKey: keyof Palette, value: string) => void;
  onPresetSelect: (presetName: string) => void;
  onCopyPalette: () => void;
  onExportTheme: () => void;
  colorPickerShouldBeHighlighted: {
    key: string;
    value: boolean;
  };
}

export const Configuration = ({
  themeConfig,
  currentTheme,
  onPaletteColorChange,
  colorPickerShouldBeHighlighted,
}: ConfigurationProps) => {
  const shouldHighlight = (tokenType: string) => {
    for (const key in tokenToScopeMapping) {
      const assertedKey = key as keyof typeof tokenToScopeMapping;
      const scopes = tokenToScopeMapping[assertedKey];
      if (Array.isArray(scopes)) {
        if (scopes.includes(colorPickerShouldBeHighlighted.key)) {
          return (
            themeConfig.tokenColors[assertedKey] === tokenType &&
            colorPickerShouldBeHighlighted.value
          );
        }
      } else {
        if (scopes === tokenType) {
          return (
            themeConfig.tokenColors[assertedKey] === tokenType &&
            colorPickerShouldBeHighlighted.value
          );
        }
      }
    }
    return false;
  };
  return (
    <div className="w-full flex flex-col divide-y">
      <div className="flex flex-col divide-y">
        <div className="flex flex-col w-full h-full gap-4">
          <div className="flex flex-col gap-2 border p-4">
            <h2 className="text-sm font-mono font-bold">Tokens</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-y-0 md:gap-x-2">
              {currentTheme &&
                entries(themeConfig.palette[currentTheme]).map(
                  ([colorKey, colorValue]) => (
                    <TokenEditor
                      key={colorKey}
                      colorKey={colorKey}
                      shouldHighlight={shouldHighlight(colorKey)}
                      colorValue={colorValue}
                      onColorChange={(value) =>
                        onPaletteColorChange(colorKey as keyof Palette, value)
                      }
                    />
                  )
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
