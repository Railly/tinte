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
import { IconPlus, IconSave, IconComputer, IconPalette } from "./ui/icons";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { SignInDialog } from "./sign-in-dialog";

export function ThemeCustomizer({
  allThemes,
}: {
  allThemes: ThemeConfig[];
}): JSX.Element {
  const { user } = useUser();
  const [activeView, setActiveView] = useState<"preview" | "config">("preview");

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
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  const handleSelectTheme = async (
    themeName: string,
    palette?: DarkLightPalette,
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

  const handlePlusButtonClick = () => {
    if (user) {
      setOpenCreateTheme(true);
    } else {
      setIsSignInDialogOpen(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:flex w-full md:w-16 md:flex-col border-b md:border-r z-50">
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
            onClick={handlePlusButtonClick}
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
          <SignInDialog
            open={isSignInDialogOpen}
            setOpen={setIsSignInDialogOpen}
            redirectUrl={`/vscode?theme=${themeConfig.name}`}
          />
        </div>
      </div>
      <div className="flex-1 grid grid-rows-[auto_auto_1fr_auto] md:grid-rows-[auto_1fr_auto] h-full overflow-auto">
        <Header themeConfig={themeConfig} setThemeConfig={setThemeConfig} />
        <div className="md:hidden flex justify-center my-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setActiveView(activeView === "preview" ? "config" : "preview")
            }
          >
            {activeView === "preview" ? (
              <>
                <IconPalette className="w-4 h-4 mr-2" />
                Show Config
              </>
            ) : (
              <>
                <IconComputer className="w-4 h-4 mr-2" />
                Show Preview
              </>
            )}
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-2 w-full h-full max-h-screen p-2 self-start overflow-auto">
          <div
            className={`${activeView === "preview" ? "block" : "hidden"} md:block`}
          >
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
          </div>
          <div
            className={`${activeView === "config" ? "block" : "hidden"} md:block`}
          >
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
