import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ThemeConfig, Palette } from "@/lib/core/types";
import { entries } from "@/lib/utils";
import { PresetSelector } from "@/components/preset-selector";
import { TokenEditor } from "@/components/token-editor";

interface ConfigurationProps {
  themeConfig: ThemeConfig;
  currentTheme: "light" | "dark";
  isBackgroundless: boolean;
  onBackgroundlessChange: () => void;
  onThemeChange: (checked: boolean) => void;
  onPaletteColorChange: (colorKey: keyof Palette, value: string) => void;
  onPresetSelect: (presetName: string) => void;
  onCopyPalette: () => void;
  onExportTheme: () => void;
  presets: Record<string, any>;
}

export const Configuration = ({
  themeConfig,
  currentTheme,
  isBackgroundless,
  onBackgroundlessChange,
  onThemeChange,
  onPaletteColorChange,
  onPresetSelect,
  onCopyPalette,
  onExportTheme,
  presets,
}: ConfigurationProps) => {
  return (
    <div className="w-full flex flex-col divide-y">
      <div className="flex flex-col divide-y">
        <div className="flex flex-col w-full h-full gap-4">
          <h1 className="text-sm font-mono uppercase font-bold">
            Configuration
          </h1>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="backgroundless-mode"
                checked={!isBackgroundless}
                onCheckedChange={onBackgroundlessChange}
              />
              <Label htmlFor="backgroundless-mode">Background</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="light/dark-mode"
                onCheckedChange={onThemeChange}
                checked={currentTheme === "light"}
              />
              <Label htmlFor="light/dark-mode">
                {currentTheme === "dark" ? "Dark" : "Light"} Mode
              </Label>
            </div>
          </div>

          <PresetSelector
            presets={presets}
            currentTheme={currentTheme}
            selectedPreset={themeConfig.displayName}
            onPresetSelect={onPresetSelect}
          />

          <div className="flex flex-col gap-2 border p-2">
            <h2 className="text-sm font-mono font-bold">Tokens</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-0">
              {currentTheme &&
                entries(themeConfig.palette[currentTheme]).map(
                  ([colorKey, colorValue]) => (
                    <div
                      className="w-full flex flex-col font-mono gap-2 py-2"
                      key={colorKey}
                    >
                      <TokenEditor
                        colorKey={colorKey}
                        colorValue={colorValue}
                        onColorChange={(value) =>
                          onPaletteColorChange(colorKey as keyof Palette, value)
                        }
                      />
                    </div>
                  )
                )}
            </div>
          </div>

          <div className="flex gap-2 w-full mb-4 md:mb-0">
            <Button
              className="w-full"
              variant="outline"
              onClick={onCopyPalette}
            >
              Copy Palette
            </Button>
            <Button className="w-full" onClick={onExportTheme}>
              Export VSCode Theme
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
