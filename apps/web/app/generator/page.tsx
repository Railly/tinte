"use client";
import { Header } from "@/components/header";
import { Configuration } from "@/components/configuration";
import { Preview } from "@/components/preview";
import { useThemeConfig } from "@/lib/hooks/use-theme-config";
import { useCodeSample } from "@/lib/hooks/use-code-sample";
import { useThemeExport } from "@/lib/hooks/use-theme-export";
import { ThemeConfigurationPanel } from "@/components/theme-configuration-panel";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RHLogoIcon from "@/public/rh-logo.svg";
import { ThemeConfig } from "@/lib/core/types";
import LoadingPage from "@/components/loading-page";
import { useUser } from "@clerk/nextjs";

export default function Page(): JSX.Element {
  const [initialThemes, setInitialThemes] = useState<ThemeConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch("/api/themes");
        if (!response.ok) throw new Error("Failed to fetch themes");
        const themes = await response.json();
        setInitialThemes(themes);
      } catch (error) {
        console.error("Error fetching themes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return <PageContent initialThemes={initialThemes} />;
}

function PageContent({
  initialThemes,
}: {
  initialThemes: ThemeConfig[];
}): JSX.Element {
  const {
    tinteTheme,
    presets,
    setPresets,
    isBackgroundless,
    toggleBackgroundless,
    updatePaletteColor,
    themeConfig,
    currentTheme,
    applyPreset,
    customThemes,
    setNextTheme,
  } = useThemeConfig(initialThemes);

  const {
    selectedLanguage,
    code,
    handleCodeChange,
    handleLanguageChange,
    colorPickerShouldBeHighlighted,
    setColorPickerShouldBeHighlighted,
  } = useCodeSample();

  const [advancedMode, setAdvancedMode] = useState(false);
  const { user } = useUser();

  const handleThemeSaved = () => {
    // Refresh themes or update state as needed
    // For example, you might want to refetch the themes:
    // fetchThemes();
  };

  return (
    <div className="flex h-screen">
      <div className="w-16 flex flex-col border-r z-[60]">
        <a
          className="flex items-center justify-center h-14 border-b"
          href="https://railly.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <RHLogoIcon />
        </a>
        <div className="flex flex-col items-center py-4 gap-4">
          <Button className="w-10 h-10" variant="outline" size="icon">
            <PlusIcon className="h-4 w-4" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-10 h-10" variant="outline" size="icon">
                <HamburgerMenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] left-16">
              <div className="py-4 z-[55]">
                <h2 className="text-lg font-semibold mb-4">Themes</h2>
                {customThemes &&
                  Object.keys(customThemes).map((themeName, index) => (
                    <Button
                      key={`${themeName}-${index}`}
                      variant="ghost"
                      className="w-full justify-start mb-2"
                    >
                      {themeName}
                    </Button>
                  ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] h-full">
        <Header themeConfig={themeConfig} />
        <div className="grid grid-cols-2 gap-2 w-full h-full max-h-screen p-2 self-start overflow-auto">
          <Preview
            theme={tinteTheme}
            code={code}
            updateCode={handleCodeChange}
            setColorPickerShouldBeHighlighted={
              setColorPickerShouldBeHighlighted
            }
            selectedLanguage={selectedLanguage}
            themeConfig={themeConfig}
            userId={user?.id}
            onThemeSaved={handleThemeSaved}
          />
          <Configuration
            colorPickerShouldBeHighlighted={colorPickerShouldBeHighlighted}
            themeConfig={themeConfig}
            currentTheme={currentTheme as "light" | "dark"}
            onPaletteColorChange={updatePaletteColor}
            advancedMode={advancedMode}
            onGenerateTheme={(description: string) => {}}
          />
        </div>
        <div className="flex justify-center gap-4 items-center mx-2 self-end">
          <ThemeConfigurationPanel
            presets={presets}
            isBackgroundless={isBackgroundless}
            toggleBackgroundless={toggleBackgroundless}
            themeConfig={themeConfig}
            currentTheme={currentTheme as "light" | "dark"}
            applyPreset={applyPreset}
            setNextTheme={setNextTheme}
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
