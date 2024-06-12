/* eslint-disable turbo/no-undeclared-env-vars */
"use client";
import {
  BACKGROUND_LESS_PALETTE,
  CODE_SAMPLES,
  DEFAULT_LANGUAGE,
  FEATURED_THEME_LOGOS,
  PRESETS,
} from "@/lib/constants";
import { generateVSCodeTheme } from "@/lib/core";
import { defaultThemeConfig } from "@/lib/core/config";
import { Palette, ThemeConfig } from "@/lib/core/types";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Header } from "@/components/header";
import { Configuration } from "@/components/configuration";
import { cn, debounce } from "@/lib/utils";
import { Preview } from "@/components/preview";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ResponsiveModal,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  IconCopy,
  IconDownload,
  IconHeart,
  IconInfo,
  IconLoading,
} from "@/components/ui/icons";
import { PresetSelector } from "@/components/preset-selector";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Separator } from "@/components/ui/separator";
import { SubscriptionForm } from "@/components/subscription-form";

export default function Page(): JSX.Element {
  const customThemesRaw = window.localStorage.getItem("customThemes") || "{}";
  const customThemesJSON = JSON.parse(customThemesRaw);
  const [presets, setPresets] = useState({
    ...PRESETS,
    ...customThemesJSON,
  });
  const lastPreset = window.localStorage.getItem("lastPreset");
  const defaultPresetName = lastPreset || defaultThemeConfig.displayName;
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    ...defaultThemeConfig,
    displayName: defaultPresetName,
    name: defaultPresetName.toLowerCase().replace(/\s/g, "-"),
    palette: presets[defaultPresetName as string],
  });
  const lastLanguage = window.localStorage.getItem("lastLanguage");
  const defaultLanguage = lastLanguage || DEFAULT_LANGUAGE;

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | undefined>(
    CODE_SAMPLES[defaultLanguage]
  );
  const [isBackgroundless, setIsBackgroundless] = useState(false);
  const [colorPickerShouldBeHighlighted, setColorPickerShouldBeHighlighted] =
    useState({
      key: "",
      value: false,
    });
  const { theme: nextTheme, setTheme } = useTheme();

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    updateCode(CODE_SAMPLES[language]);
    window.localStorage.setItem("lastLanguage", language);
  };
  const currentTheme = (
    nextTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : nextTheme
  ) as "light" | "dark";

  const updatePaletteColor = debounce(
    (colorKey: keyof Palette, value: string) => {
      if (!currentTheme) return;
      setThemeConfig((prevConfig) => ({
        ...prevConfig,
        displayName: prevConfig.displayName ? prevConfig.displayName : "Custom",
        palette: {
          ...prevConfig.palette,
          [currentTheme]: {
            ...prevConfig.palette[currentTheme],
            [colorKey]: value,
          },
        },
      }));
    },
    250
  );

  const updateCode = debounce((value: string | undefined) => {
    setCode(value);
  }, 500);

  const applyPreset = (presetName: string, newPresets?: typeof presets) => {
    if (!currentTheme) return;
    const _presets = newPresets || presets;
    // @ts-ignore
    setThemeConfig((prevConfig) => ({
      ...prevConfig,
      displayName: presetName,
      palette: {
        light: isBackgroundless
          ? {
              ..._presets[presetName]?.light,
              ...BACKGROUND_LESS_PALETTE.light,
            }
          : _presets[presetName]?.light,
        dark: isBackgroundless
          ? {
              ..._presets[presetName]?.dark,
              ...BACKGROUND_LESS_PALETTE.dark,
            }
          : _presets[presetName]?.dark,
      },
    }));
    window.localStorage.setItem("lastPreset", presetName);
  };

  const toggleBackgroundless = () => {
    if (!currentTheme) return;
    setIsBackgroundless((prevMode) => !prevMode);
    setThemeConfig((prevConfig) => ({
      ...prevConfig,
      palette: {
        ...prevConfig.palette,
        [currentTheme]: !isBackgroundless
          ? {
              ...prevConfig.palette[currentTheme],
              ...BACKGROUND_LESS_PALETTE[currentTheme],
            }
          : presets[prevConfig.displayName]?.[currentTheme],
      },
    }));
  };

  const exportThemeAsJSON = () => {
    const jsonString = JSON.stringify(theme, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${themeConfig.displayName}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportThemeAsVSIX = async () => {
    try {
      setLoading(true);
      toast.info("Exporting theme as VSIX...");
      const response = await fetch(
        process.env.NODE_ENV === "production"
          ? "api/export-vsix"
          : process.env.NEXT_PUBLIC_EXPORT_API_URL!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            themeConfig,
            isDark: currentTheme === "dark",
          }),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const contentDisposition = response.headers.get("Content-Disposition");

        const fileNameMatch =
          contentDisposition && contentDisposition.match(/filename="(.+)"/);
        const fileName = fileNameMatch
          ? fileNameMatch[1]
          : themeConfig.displayName.replace(/\s/g, "-") +
            `-${currentTheme === "dark" ? "dark" : "light"}-0.0.1.vsix`;

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "theme.vsix";
        link.click();
        window.URL.revokeObjectURL(url);
        toast.dismiss();
        toast.success("Theme exported as VSIX");
      } else {
        console.error("Failed to export VSIX:", await response.json());
        toast.dismiss();
        toast.error("Failed to export theme as VSIX");
      }
    } catch (error) {
      console.error("Failed to export VSIX:", error);
      toast.dismiss();
      toast.error("Failed to export theme as VSIX");
    } finally {
      setLoading(false);
    }
  };

  const theme = generateVSCodeTheme(themeConfig);

  const FEATURED_THEMES = Object.keys(PRESETS).slice(0, 5) as Array<
    keyof typeof FEATURED_THEME_LOGOS
  >;
  const RAY_SO_THEMES = Object.keys(PRESETS).slice(5);

  return (
    <div className="flex flex-col">
      <Header />

      <div className="flex flex-col gap-4 w-full h-full p-4 max-h-screen">
        <Preview
          theme={theme}
          code={code}
          updateCode={updateCode}
          setColorPickerShouldBeHighlighted={setColorPickerShouldBeHighlighted}
          selectedLanguage={selectedLanguage}
        />
        <div className="flex flex-wrap  gap-4 items-center border p-4">
          <div className="flex flex-wrap md:flex-nowrap gap-10">
            <PresetSelector
              presets={presets}
              setPresets={setPresets}
              customThemes={customThemesJSON}
              currentTheme={currentTheme}
              themeConfig={themeConfig}
              onPresetSelect={applyPreset}
              featuredThemes={FEATURED_THEMES}
              raySoThemes={RAY_SO_THEMES}
            />
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="backgroundless-mode"
                className="text-muted-foreground"
              >
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
              <Label
                htmlFor="light/dark-mode"
                className="text-muted-foreground"
              >
                Dark
              </Label>
              <div className="flex items-center mt-1">
                <Switch
                  id="light/dark-mode"
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                  checked={currentTheme === "dark"}
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
              <ResponsiveModal
                trigger={
                  <Button variant="outline">
                    <IconInfo className="mr-2" />
                    <span>How to Install</span>
                  </Button>
                }
              >
                <ResponsiveModalHeader>
                  <ResponsiveModalTitle>
                    How to Set Theme in VSCode
                  </ResponsiveModalTitle>
                </ResponsiveModalHeader>
                <ResponsiveModalDescription className="prose dark:prose-invert prose-neutral text-foreground leading-5">
                  <p>Ready to take your coding to the next level?</p>
                  <ol className="flex flex-col gap-2">
                    <li>
                      Export your favorite theme using the "Export VSCode Theme"
                      button.
                    </li>
                    <li>
                      Go to VSCode and open the command palette by pressing{" "}
                      <kbd>Ctrl+Shift+P</kbd> (Windows/Linux) or{" "}
                      <kbd>Cmd+Shift+P</kbd> (Mac).
                    </li>
                    <li>
                      Type "VSIX" and select{" "}
                      <b>"Extensions: Install from VSIX"</b>.
                    </li>
                    <li>
                      Choose the exported theme file and let VSCode work its
                      magic.
                    </li>
                    <li>
                      Go to the Extensions view, find your shiny new theme, and
                      click "Set Color Theme" to activate it.
                    </li>
                  </ol>
                  <p className="mt-4 mb-8">
                    Congratulations! Enjoy your personalized VSCode experience
                    and let your creativity soar. Happy coding!
                  </p>
                  <div className="flex gap-2 w-full">
                    <a
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "flex w-full items-center gap-2 no-underline"
                      )}
                      href="https://donate.railly.dev"
                      target="_blank"
                    >
                      <IconHeart />
                      Support me
                    </a>
                    <a
                      href="https://www.railly.dev"
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "flex w-full items-center gap-2 no-underline"
                      )}
                    >
                      Know more about me
                    </a>
                  </div>
                </ResponsiveModalDescription>
              </ResponsiveModal>
            </div>
            <div className="flex flex-col gap-3">
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
                <Button onClick={exportThemeAsVSIX} disabled={loading}>
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
            </div>
          </div>
        </div>
        <Configuration
          loading={loading}
          colorPickerShouldBeHighlighted={colorPickerShouldBeHighlighted}
          themeConfig={themeConfig}
          currentTheme={currentTheme}
          isBackgroundless={isBackgroundless}
          onBackgroundlessChange={toggleBackgroundless}
          onThemeChange={(checked) => setTheme(checked ? "dark" : "light")}
          onPaletteColorChange={updatePaletteColor}
          onPresetSelect={applyPreset}
          onCopyPalette={() => {
            const jsonString = JSON.stringify(
              themeConfig.palette[currentTheme as "light" | "dark"],
              null,
              2
            );
            navigator.clipboard.writeText(jsonString);
          }}
          onExportTheme={exportThemeAsVSIX}
        />
      </div>
    </div>
  );
}
