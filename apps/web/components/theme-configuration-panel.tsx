import { HelpModal } from "./help-modal";
import { LanguageSwitcher } from "./language-switcher";
import { PresetSelector } from "./preset-selector";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ThemeConfig } from "@/lib/core/types";

export function ThemeConfigurationPanel({
  presets,
  isBackgroundless,
  toggleBackgroundless,
  themeConfig,
  currentTheme,
  applyPreset,
  setNextTheme,
  selectedLanguage,
  handleLanguageChange,
  loading,
  exportVSIX,
  advancedMode,
  setAdvancedMode,
}: {
  presets: Record<string, ThemeConfig>;
  isBackgroundless: boolean;
  toggleBackgroundless: () => void;
  themeConfig: ThemeConfig;
  currentTheme: "light" | "dark";
  applyPreset: (preset: string) => void;
  setNextTheme?: (theme: "light" | "dark") => void;
  selectedLanguage: string;
  handleLanguageChange: (language: string) => void;
  loading: boolean;
  exportVSIX: (themeConfig: ThemeConfig, isDark: boolean) => void;
  advancedMode: boolean;
  setAdvancedMode: (enabled: boolean) => void;
}) {
  return (
    <div className="flex justify-center flex-wrap md:flex-nowrap gap-8 py-6 px-4 bg-muted/30 border rounded-t-md">
      <PresetSelector
        presets={presets}
        currentTheme={currentTheme}
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
    </div>
  );
}
