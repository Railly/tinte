import { HelpModal } from "./help-modal";
import { LanguageSwitcher } from "./language-switcher";
import { PresetSelector } from "./preset-selector";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { IconCopy, IconDownload, IconLoading } from "./ui/icons";
import { DarkLightPalette } from "@/lib/core/types";

export function ThemeConfigurationPanel({
  presets,
  setPresets,
  isBackgroundless,
  toggleBackgroundless,
  themeConfig,
  currentTheme,
  applyPreset,
  customThemesJSON,
  setNextTheme,
  selectedLanguage,
  handleLanguageChange,
  loading,
  exportVSIX,
  advancedMode,
  setAdvancedMode,
}: {
  presets: any;
  setPresets: React.Dispatch<React.SetStateAction<any>>;
  isBackgroundless: boolean;
  toggleBackgroundless: () => void;
  themeConfig: any;
  currentTheme: "light" | "dark";
  applyPreset: (preset: string) => void;
  customThemesJSON: Record<string, DarkLightPalette>;
  setNextTheme?: (theme: "light" | "dark") => void;
  selectedLanguage: string;
  handleLanguageChange: (language: string) => void;
  loading: boolean;
  exportVSIX: (themeConfig: any, isDark: boolean) => void;
  advancedMode: boolean;
  setAdvancedMode: (enabled: boolean) => void;
}) {
  return (
    <div className="flex justify-center flex-wrap md:flex-nowrap gap-8 py-6 px-4 bg-muted/30 border rounded-t-md">
      <PresetSelector
        presets={presets}
        setPresets={setPresets}
        customThemes={customThemesJSON}
        currentTheme={currentTheme as "light" | "dark"}
        themeConfig={themeConfig}
        onPresetSelect={applyPreset}
      />
      <div className="flex flex-col gap-3">
        <Label htmlFor="backgroundless-mode" className="text-muted-foreground">
          Background
        </Label>
        <div className="flex items-center mt-1">
          <Switch
            id="backgroundless-mode"
            checked={!isBackgroundless}
            onCheckedChange={toggleBackgroundless}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="light/dark-mode" className="text-muted-foreground">
          Dark Mode
        </Label>
        <div className="flex items-center mt-1">
          <Switch
            id="light/dark-mode"
            onCheckedChange={(checked) =>
              setNextTheme?.(checked ? "dark" : "light")
            }
            checked={currentTheme === "dark"}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="advanced-mode" className="text-muted-foreground">
          Advanced Mode
        </Label>
        <div className="flex items-center mt-1">
          <Switch
            id="advanced-mode"
            checked={advancedMode}
            onCheckedChange={setAdvancedMode}
          />
        </div>
      </div>
      <LanguageSwitcher
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <div className="flex flex-col gap-3">
        <Label htmlFor="how-to-install" className="text-muted-foreground">
          Help
        </Label>
        <HelpModal />
      </div>
      {/* <div className="flex flex-col gap-3">
        <Label htmlFor="how-to-install" className="text-muted-foreground">
          Actions
        </Label>
        <div className="flex flex-wrap md:flex-nowrap gap-5">
          <Button
            variant="outline"
            onClick={() => {
              const jsonString = JSON.stringify(
                themeConfig.palette[currentTheme as "light" | "dark"],
                null,
                2
              );
              navigator.clipboard.writeText(jsonString);
            }}
          >
            <IconCopy className="mr-2" />
            Copy Theme
            <span className="text-xs font-mono ml-1">(.json)</span>
          </Button>
          <Button
            onClick={() => exportVSIX(themeConfig, currentTheme === "dark")}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <IconLoading />
                <span>Exporting...</span>
              </div>
            ) : (
              <span className="flex items-center">
                <IconDownload className="mr-2" />
                Export Theme
                <span className="text-xs font-mono ml-1">(.vsix)</span>
              </span>
            )}
          </Button>
        </div>
      </div> */}
    </div>
  );
}
