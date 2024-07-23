"use client";
import { Header } from "@/components/header";
import { ThemeConfigPanel } from "@/components/theme-config-panel";
import { PreviewEditor } from "@/components/preview-editor";
import { useThemeConfig } from "@/lib/hooks/use-theme-config";
import { useCodeSample } from "@/lib/hooks/use-code-sample";
import { useState } from "react";
import RHLogoIcon from "@/public/rh-logo.svg";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import { defaultThemeConfig } from "@/lib/core/config";
import { ThemeControlBar } from "./theme-control-bar";
import { getThemeName } from "@/app/utils";
import { CreateThemeDialog } from "./create-theme-dialog";
import { ThemeSheet } from "./theme-sheet";
import { IconPlus, IconSave } from "./ui/icons";
import { Button } from "./ui/button";

export function ThemeCustomizer({
  allThemes,
}: {
  allThemes: ThemeConfig[];
}): JSX.Element {
  const {
    vsCodeTheme,
    themes,
    isBackgroundless,
    setBackgroundlessMode,
    updatePaletteColor,
    themeConfig,
    setThemeConfig,
    applyTheme,
    updatePaletteColors,
  } = useThemeConfig(allThemes);

  const {
    selectedLanguage,
    code,
    handleCodeChange,
    handleLanguageChange,
    colorPickerShouldBeHighlighted,
    setColorPickerShouldBeHighlighted,
  } = useCodeSample();

  const [advancedMode, setAdvancedMode] = useState(false);
  const [openCreateTheme, setOpenCreateTheme] = useState(false);
  const [isColorModified, setIsColorModified] = useState(false);
  const [themeDescription, setThemeDescription] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSelectTheme = async (
    themeName: string,
    palette?: DarkLightPalette
  ) => {
    const updatedConfig: ThemeConfig = {
      ...themeConfig,
      name: getThemeName(themeName),
      displayName: themeName,
      palette: palette || themeConfig.palette,
      category: "user",
      tokenColors: defaultThemeConfig.tokenColors,
    };
    setThemeConfig(updatedConfig);
    applyTheme(themeName);
  };

  return (
    <div className="flex h-screen">
      <div className="w-16 flex flex-col border-r z-50">
        <a
          className="flex items-center justify-center h-14 border-b"
          href="https://railly.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <RHLogoIcon />
        </a>
        <div className="flex flex-col items-center py-4 gap-4">
          <Button
            onClick={() => setOpenCreateTheme(true)}
            className="w-10 h-10"
            variant="outline"
            size="icon"
          >
            <IconPlus className="h-4 w-4" />
          </Button>
          <CreateThemeDialog
            title="New Theme"
            description="Create a new theme by providing a name and selecting a base theme"
            saveButtonContent={
              <>
                <IconSave className="w-4 h-4 mr-2" />
                Create Theme
              </>
            }
            loadingButtonText="Creating..."
            isOpen={openCreateTheme}
            onClose={() => setOpenCreateTheme(false)}
            onSelectTheme={handleSelectTheme}
            themeConfig={themeConfig}
            themes={themes}
            applyTheme={applyTheme}
          />

          <ThemeSheet
            isOpen={isSheetOpen}
            setIsOpen={setIsSheetOpen}
            themes={themes}
            onSelectTheme={handleSelectTheme}
          />
        </div>
      </div>
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] h-full">
        <Header themeConfig={themeConfig} setThemeConfig={setThemeConfig} />
        <div className="grid md:grid-cols-2 gap-2 w-full h-full max-h-screen p-2 self-start overflow-auto">
          <PreviewEditor
            vsCodeTheme={vsCodeTheme}
            code={code}
            onCodeChange={handleCodeChange}
            setColorPickerShouldBeHighlighted={
              setColorPickerShouldBeHighlighted
            }
            language={selectedLanguage}
            themeConfig={themeConfig}
            themes={themes}
            applyTheme={applyTheme}
            setIsColorModified={setIsColorModified}
            onSelectTheme={handleSelectTheme}
          />
          <ThemeConfigPanel
            colorPickerShouldBeHighlighted={colorPickerShouldBeHighlighted}
            themeConfig={themeConfig}
            onPaletteColorChange={updatePaletteColor}
            onMultiplePaletteColorsChange={updatePaletteColors}
            advancedMode={advancedMode}
            themeDescription={themeDescription}
            setThemeDescription={setThemeDescription}
            themes={themes}
            applyTheme={applyTheme}
            setThemeConfig={setThemeConfig}
            isColorModified={isColorModified}
            setIsColorModified={setIsColorModified}
          />
        </div>
        <div className="flex justify-center gap-4 items-center mx-2 self-end">
          <ThemeControlBar
            themes={themes}
            isBackgroundless={isBackgroundless}
            setBackgroundlessMode={setBackgroundlessMode}
            themeConfig={themeConfig}
            applyTheme={applyTheme}
            selectedLanguage={selectedLanguage}
            handleLanguageChange={handleLanguageChange}
            advancedMode={advancedMode}
            setAdvancedMode={setAdvancedMode}
          />
        </div>
      </div>
    </div>
  );
}
