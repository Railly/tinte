"use client";
import { Header } from "@/components/header";
import { Configuration } from "@/components/configuration";
import { Preview } from "@/components/preview";
import { useThemeConfig } from "@/lib/hooks/use-theme-config";
import { useCodeSample } from "@/lib/hooks/use-code-sample";
import { ThemeConfigurationPanel } from "@/components/theme-configuration-panel";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RHLogoIcon from "@/public/rh-logo.svg";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import LoadingPage from "@/components/loading-page";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, entries } from "@/lib/utils";
import { PresetSelector } from "@/components/preset-selector";
import { defaultThemeConfig } from "@/lib/core/config";
import { fetchGeneratedTheme } from "../utils.";
import { CircularGradient } from "@/components/circular-gradient";
import { useRouter } from "next/navigation";

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
    isBackgroundless,
    toggleBackgroundless,
    updatePaletteColor,
    themeConfig,
    setThemeConfig,
    currentTheme,
    applyPreset,
    customThemes,
    setCustomThemes,
    setNextTheme,
    userId,
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
  const [openCreateTheme, setOpenCreateTheme] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");

  const updateThemeConfig = (newConfig: Partial<ThemeConfig>) => {
    const newThemeConfig = { ...themeConfig, ...newConfig };
    setThemeConfig(newThemeConfig);
    applyPreset(newThemeConfig.displayName);
  };

  const updateCustomThemes = (
    newCustomThemes: Record<string, DarkLightPalette>
  ) => {
    setCustomThemes(newCustomThemes);
    window.localStorage.setItem(
      "customThemes",
      JSON.stringify(newCustomThemes)
    );
  };

  const updateThemeStates = (themeName: string, palette: DarkLightPalette) => {
    const name = themeName.toLowerCase().replace(/\s/g, "-");
    const newCustomThemes = {
      [themeName]: palette,
      ...customThemes,
    };
    updateCustomThemes(newCustomThemes);
    updateThemeConfig({
      name,
      displayName: themeName,
      palette: palette,
      category: "local",
      tokenColors: defaultThemeConfig.tokenColors,
    });
  };

  const saveTheme = async () => {
    if (!newThemeName) {
      toast.error("Please enter a theme name");
      return;
    }

    setIsSaving(true);
    try {
      updateThemeStates(newThemeName, themeConfig.palette);
      toast.success("Theme saved successfully");
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Failed to save theme");
    } finally {
      setIsSaving(false);
      setOpenCreateTheme(false);
    }
  };

  const [themeDescription, setThemeDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const generateTheme = async () => {
    if (themeDescription.trim().length < 3) {
      toast.error("Please provide a longer theme description");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedTheme = await fetchGeneratedTheme(themeDescription);
      const _entries = entries(generatedTheme);
      if (entries.length === 0) {
        throw new Error("No theme generated");
      }
      const [generatedThemeName, generatedPalette] = _entries[0] as [
        string,
        DarkLightPalette,
      ];

      updateThemeStates(generatedThemeName, generatedPalette);
      toast.success("Theme generated successfully");
    } catch (error) {
      console.error("Error generating theme:", error);
      toast.error("Failed to generate theme");
    } finally {
      setIsGenerating(false);
    }
  };

  const enhanceDescription = async () => {
    if (themeDescription.trim().length < 3) {
      toast.error("Please provide a longer theme description to enhance");
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: themeDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to enhance description");
      }

      const { enhancedPrompt } = await response.json();
      setThemeDescription(enhancedPrompt);
      toast.success("Description enhanced successfully");
    } catch (error) {
      console.error("Error enhancing description:", error);
      toast.error("Failed to enhance description");
    } finally {
      setIsEnhancing(false);
    }
  };

  const router = useRouter();

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
          <Dialog open={openCreateTheme} onOpenChange={setOpenCreateTheme}>
            <DialogTrigger asChild>
              <Button className="w-10 h-10" variant="outline" size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Local Theme</DialogTitle>
                <DialogDescription>
                  This theme will be saved locally in your browser.
                </DialogDescription>
              </DialogHeader>
              <DialogDescription>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <Label htmlFor="newThemeName">Theme Name</Label>
                      <Input
                        id="newThemeName"
                        value={newThemeName}
                        onChange={(e) => setNewThemeName(e.target.value)}
                        placeholder="Enter new theme name"
                      />
                    </div>
                    <PresetSelector
                      className="w-full min-w-40"
                      presets={presets}
                      currentTheme={currentTheme}
                      themeConfig={themeConfig}
                      onPresetSelect={applyPreset}
                    />
                  </div>
                  <div>
                    <Label>Preview</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                      {Object.entries(themeConfig.palette[currentTheme]).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className={cn(
                              "h-8 rounded-full",
                              "border-2 border-black/20 dark:border-white/20"
                            )}
                            style={{ backgroundColor: value }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenCreateTheme(false)}
                >
                  Cancel
                </Button>
                <Button disabled={isSaving} onClick={saveTheme}>
                  Create Theme
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="w-10 h-10" variant="outline" size="icon">
                <HamburgerMenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] left-16 p-0 px-2">
              <div className="py-4 z-[55]">
                <h2 className="text-md font-bold mb-4 ml-3">My Local Themes</h2>
                {customThemes &&
                  Object.entries(customThemes).map(
                    ([themeName, palette], index) => (
                      <Button
                        key={`${themeName}-${index}`}
                        variant="ghost"
                        className="w-full justify-start mb-2"
                        onClick={() => {
                          router.replace(`/generator?theme=${themeName}`);
                          applyPreset(themeName);
                          setIsSheetOpen(false);
                        }}
                      >
                        <CircularGradient palette={palette[currentTheme]} />
                        <span className="ml-2">{themeName}</span>
                      </Button>
                    )
                  )}
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
            userId={userId}
          />
          <Configuration
            colorPickerShouldBeHighlighted={colorPickerShouldBeHighlighted}
            themeConfig={themeConfig}
            currentTheme={currentTheme as "light" | "dark"}
            onPaletteColorChange={updatePaletteColor}
            advancedMode={advancedMode}
            onGenerateTheme={generateTheme}
            themeDescription={themeDescription}
            setThemeDescription={setThemeDescription}
            isGenerating={isGenerating}
            isEnhancing={isEnhancing}
            onEnhanceDescription={enhanceDescription}
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
