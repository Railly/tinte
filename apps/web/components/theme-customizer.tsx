/* eslint-disable @next/next/no-img-element */
"use client";
import { Header } from "@/components/header";
import { ThemeConfigPanel } from "@/components/theme-config-panel";
import { PreviewEditor } from "@/components/preview-editor";
import { useThemeConfig } from "@/lib/hooks/use-theme-config";
import { useCodeSample } from "@/lib/hooks/use-code-sample";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RHLogoIcon from "@/public/rh-logo.svg";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
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
import { cn } from "@/lib/utils";
import { ThemeSelector } from "@/components/theme-selector";
import { defaultThemeConfig } from "@/lib/core/config";
import { CircularGradient } from "@/components/circular-gradient";
import { ThemeControlBar } from "./theme-control-bar";
import { IconUser } from "./ui/icons";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

export function ThemeCustomizer({
  allThemes,
}: {
  allThemes: ThemeConfig[];
}): JSX.Element {
  const {
    vsCodeTheme,
    themes,
    isBackgroundless,
    toggleBackgroundless,
    updatePaletteColor,
    themeConfig,
    setThemeConfig,
    currentTheme,
    applyTheme,
    setNextTheme,
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
  const [isSaving, setIsSaving] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [isColorModified, setIsColorModified] = useState(false);
  const user = useUser();

  const updateThemeConfig = (newConfig: Partial<ThemeConfig>) => {
    const newThemeConfig = { ...themeConfig, ...newConfig };
    setThemeConfig(newThemeConfig);
    applyTheme(newThemeConfig.displayName);
  };

  const updateThemeStates = (themeName: string, palette: DarkLightPalette) => {
    const name = themeName.toLowerCase().replace(/\s/g, "-");

    updateThemeConfig({
      name,
      displayName: themeName,
      palette: palette,
      category: "user",
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
          <Dialog open={openCreateTheme} onOpenChange={setOpenCreateTheme}>
            <DialogTrigger asChild>
              <Button className="w-10 h-10" variant="outline" size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Theme</DialogTitle>
                <DialogDescription>
                  Create a new theme by providing a name and selecting a base
                  theme
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="newThemeName">Theme Name</Label>
                    <Input
                      id="newThemeName"
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      placeholder="Enter new theme name"
                    />
                  </div>
                  <ThemeSelector
                    label="Base theme"
                    labelClassName="text-foreground"
                    themes={themes}
                    currentTheme={currentTheme}
                    themeConfig={themeConfig}
                    onSelectTheme={applyTheme}
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
            <SheetContent side="left" className="w-[250px] top-14 left-16 p-0">
              <div className="py-4 z-[55]">
                <h2 className="text-sm font-bold  border-b pb-4 px-4 mb-4">
                  Your Themes
                </h2>
                {themes.filter((theme) => theme.category === "user").length ===
                0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <SignedIn>
                      <img
                        src={user.user?.imageUrl}
                        className="w-12 h-12 mb-4 rounded-full"
                      />
                    </SignedIn>
                    <SignedOut>
                      <IconUser className="w-12 h-12 mb-4 text-muted-foreground" />
                    </SignedOut>
                    <h3 className="text-lg font-semibold mb-2">
                      No Custom Themes Yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Create your first theme to see it here.
                    </p>
                  </div>
                ) : (
                  themes.map(
                    (theme) =>
                      theme.category === "user" && (
                        <div
                          key={theme.name}
                          className="flex items-center justify-between px-2 mx-2 py-1 mb-2 rounded-md cursor-pointer hover:bg-primary/10"
                          onClick={() => {
                            updateThemeStates(theme.displayName, theme.palette);
                            setIsSheetOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <CircularGradient
                              palette={theme.palette[currentTheme]}
                            />
                            <span className="truncate text-sm max-w-[13rem]">
                              {theme.displayName}
                            </span>
                          </div>
                        </div>
                      )
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] h-full">
        <Header themeConfig={themeConfig} setThemeConfig={setThemeConfig} />
        <div className="grid grid-cols-2 gap-2 w-full h-full max-h-screen p-2 self-start overflow-auto">
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
            currentTheme={currentTheme}
            applyTheme={applyTheme}
            setIsColorModified={setIsColorModified}
          />
          <ThemeConfigPanel
            colorPickerShouldBeHighlighted={colorPickerShouldBeHighlighted}
            themeConfig={themeConfig}
            currentTheme={currentTheme as "light" | "dark"}
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
            toggleBackgroundless={toggleBackgroundless}
            themeConfig={themeConfig}
            currentTheme={currentTheme as "light" | "dark"}
            applyTheme={applyTheme}
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
