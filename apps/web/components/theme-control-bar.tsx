import { HelpModal } from "./help-modal";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSelector } from "./theme-selector";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ThemeConfig } from "@/lib/core/types";
import { useBinaryTheme } from "@/lib/hooks/use-binary-theme";

export function ThemeControlBar({
  themes,
  isBackgroundless,
  toggleBackgroundless,
  themeConfig,
  applyTheme,
  selectedLanguage,
  handleLanguageChange,
  advancedMode,
  setAdvancedMode,
}: {
  themes: ThemeConfig[];
  isBackgroundless: boolean;
  toggleBackgroundless: () => void;
  themeConfig: ThemeConfig;
  applyTheme: (preset: string) => void;
  selectedLanguage: string;
  handleLanguageChange: (language: string) => void;
  advancedMode: boolean;
  setAdvancedMode: (enabled: boolean) => void;
}) {
  const { currentTheme, setTheme } = useBinaryTheme();
  return (
    <div className="flex justify-center flex-wrap md:flex-nowrap gap-8 py-6 px-4 bg-muted/30 border rounded-t-md">
      <ThemeSelector
        themes={themes}
        currentTheme={currentTheme}
        themeConfig={themeConfig}
        onSelectTheme={applyTheme}
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
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
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
        {/* <HelpModal /> */}
      </div>
    </div>
  );
}
