import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CircularGradient } from "./circular-gradient";
import { Label } from "./ui/label";
import {
  FEATURED_THEMES,
  FEATURED_THEME_LOGOS,
  RAY_SO_THEMES,
} from "@/lib/constants";
import { Button } from "./ui/button";
import {
  IconGenerate,
  IconLoading,
  IconSave,
  IconSend,
  IconSparkles,
} from "./ui/icons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

interface PresetSelectorProps {
  label?: string;
  className?: string;
  currentTheme: "light" | "dark";
  themeConfig: ThemeConfig;
  onPresetSelect: (
    presetName: string,
    newPResets?: Record<string, DarkLightPalette>
  ) => void;
  customThemes: Record<string, DarkLightPalette>;
  noSaveButton?: boolean;
  noGenerateButton?: boolean;
  presets: Record<string, DarkLightPalette>;
  setPresets: (presets: Record<string, DarkLightPalette>) => void;
}

export const PresetSelector = ({
  label,
  className,
  currentTheme,
  customThemes,
  themeConfig,
  onPresetSelect,
  noSaveButton = false,
  noGenerateButton = false,
  presets,
  setPresets,
}: PresetSelectorProps) => {
  const [openSave, setOpenSave] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(false);
  const [themeName, setThemeName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedTheme, setGeneratedTheme] = useState<DarkLightPalette>();
  const [generatedThemeName, setGeneratedThemeName] = useState<
    string | undefined
  >("");
  const [isGenerating, setIsGenerating] = useState(false);

  const currentPreset = presets[themeConfig.displayName]?.[currentTheme];
  const customThemeNames = Object.keys(customThemes);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Label htmlFor="theme" className="text-muted-foreground">
        {label || "Base Theme"}
      </Label>
      <div className="flex gap-2">
        <Select value={themeConfig.displayName} onValueChange={onPresetSelect}>
          <SelectTrigger className={cn("min-w-40", className)}>
            <SelectValue id="theme" placeholder="Select preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Featured</SelectLabel>
              {FEATURED_THEMES.map((presetName) => (
                <SelectItem key={presetName} value={presetName}>
                  <div className="flex items-center gap-2">
                    {FEATURED_THEME_LOGOS[presetName]}
                    <span className="truncate max-w-[5.5rem]">
                      {presetName}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
            {customThemeNames.length > 0 && (
              <SelectGroup className="border-t mt-1 pt-1">
                <SelectLabel>Custom</SelectLabel>
                {customThemeNames.map((presetName) => (
                  <SelectItem key={presetName} value={presetName}>
                    <div className="flex items-center gap-2">
                      <CircularGradient
                        presets={presets}
                        presetName={presetName}
                        currentTheme={currentTheme}
                      />
                      <span className="truncate max-w-[5.5rem]">
                        {presetName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            <SelectGroup className="border-t pt-1 mt-1">
              <SelectLabel>Ray.so</SelectLabel>
              {RAY_SO_THEMES.map((presetName) => (
                <SelectItem key={presetName} value={presetName}>
                  <div className="flex items-center gap-2">
                    <CircularGradient
                      presets={presets}
                      presetName={presetName}
                      currentTheme={currentTheme}
                    />
                    <span className="truncate max-w-[5.5rem]">
                      {presetName}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* {!noSaveButton && (
          <Dialog open={openSave} onOpenChange={setOpenSave}>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <DialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      style={{
                        backgroundColor: currentPreset?.accent,
                        color: currentPreset?.background,
                      }}
                      className={cn("hover:!brightness-110 transition-all")}
                    >
                      <IconSave className="size-5" />
                      <span className="ml-2">Save</span>
                    </Button>
                  </TooltipTrigger>
                </DialogTrigger>
                <TooltipContent>Save your local theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Your Local Theme</DialogTitle>
              </DialogHeader>
              <DialogDescription className="prose dark:prose-invert prose-neutral text-foreground leading-5">
                <p>
                  If syntax highlighting is not working, please save the theme
                  and reload the page. This is a known issue and will be fixed
                  soon.
                </p>
                <div className="flex w-full gap-4 mt-4">
                  <div className="flex w-full flex-col gap-3">
                    <Label
                      htmlFor="themeName"
                      className="text-muted-foreground"
                    >
                      Theme Name
                    </Label>
                    <Input
                      id="themeName"
                      name="themeName"
                      className="w-full"
                      placeholder="Enter theme name"
                      value={themeName}
                      onChange={(e) => setThemeName(e.target.value)}
                    />
                  </div>
                  <PresetSelector
                    className="w-full min-w-40"
                    currentTheme={currentTheme}
                    themeConfig={themeConfig}
                    onPresetSelect={onPresetSelect}
                    noSaveButton
                    noGenerateButton
                    presets={presets}
                    label="Base Theme"
                    customThemes={customThemes}
                    setPresets={setPresets}
                  />
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  <Label htmlFor="preview" className="text-muted-foreground">
                    Preview
                  </Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {Object.keys(themeConfig.palette[currentTheme]).map(
                      (colorKey) => (
                        <div
                          key={colorKey}
                          id={colorKey}
                          className={cn(
                            "h-8",
                            "p-1 rounded-full w-full",
                            "border-2 border-black/20 dark:border-white/20"
                          )}
                          style={{
                            backgroundColor:
                              themeConfig.palette[currentTheme][
                                colorKey as keyof typeof themeConfig.palette.light
                              ],
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              </DialogDescription>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenSave(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const newCustomThemes = {
                      ...customThemes,
                      [themeName]: themeConfig.palette,
                    };
                    const newPresets = {
                      ...presets,
                      ...newCustomThemes,
                    };
                    window.localStorage.setItem(
                      "customThemes",
                      JSON.stringify(newCustomThemes)
                    );
                    setPresets(newPresets);
                    onPresetSelect(themeName, newPresets);
                    toast.success("Theme created successfully");
                    setOpenSave(false);
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {!noGenerateButton && (
          <Dialog open={openGenerate} onOpenChange={setOpenGenerate}>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <DialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      style={{
                        backgroundColor: currentPreset?.["accent-2"],
                        color: currentPreset?.background,
                      }}
                      className={cn("hover:!brightness-110 transition-all")}
                    >
                      <IconGenerate className="size-5" />
                      <span className="ml-2">Generate</span>
                    </Button>
                  </TooltipTrigger>
                </DialogTrigger>
                <TooltipContent>Generate your local theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Your Local Theme ✨</DialogTitle>
              </DialogHeader>
              <DialogDescription className="prose dark:prose-invert prose-neutral text-foreground leading-5">
                <p>
                  Ask yourself the following questions to help you describe your
                  theme:
                </p>
                <ul>
                  <li>What's your theme vibe?</li>
                  <li>Key colors for your theme?</li>
                  <li>Who's your theme for?</li>
                </ul>
                <div className="flex w-full flex-col gap-3">
                  <Label htmlFor="themeName" className="text-muted-foreground">
                    Prompt
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="prompt"
                      name="prompt"
                      className="max-w-[460px] [field-sizing:content] pr-14 resize-none"
                      placeholder="Describe your theme"
                      minLength={3}
                      maxLength={150}
                      value={prompt}
                      disabled={isGenerating}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button
                      type="button"
                      className="absolute right-2 bottom-3"
                      variant="secondary"
                      disabled={isGenerating}
                      onClick={async () => {
                        try {
                          setIsGenerating(true);
                          const formData = new FormData();
                          formData.append("prompt", prompt);
                          const response = await fetch("/api/generate", {
                            method: "POST",
                            body: JSON.stringify({ prompt }),
                          }).then((res) => res.json());
                          const result = response.formattedResult;
                          const name = Object.keys(result)[0] as string;
                          setGeneratedThemeName(name);
                          setGeneratedTheme(result[name]);
                          toast.success("Theme generated successfully");
                        } catch (error) {
                          console.error(error);
                          toast.error("Failed to generate theme");
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                    >
                      {isGenerating ? <IconLoading /> : <IconSend />}
                    </Button>
                  </div>
                </div>
                <div className="flex w-full gap-4 mt-4">
                  <div className="flex w-full flex-col gap-3">
                    <Label
                      htmlFor="themeName"
                      className="text-muted-foreground"
                    >
                      Theme Name
                    </Label>
                    <div className="w-full relative">
                      <Input
                        id="generatedThemeName"
                        name="generatedThemeName"
                        className="pl-9 w-full"
                        placeholder="Theme name"
                        disabled={isGenerating}
                        value={generatedThemeName}
                        onChange={(e) => setGeneratedThemeName(e.target.value)}
                      />
                      <CircularGradient
                        className="absolute left-3 top-2.5"
                        presets={{
                          [themeConfig.displayName]: themeConfig.palette,
                          [generatedThemeName || ""]:
                            generatedTheme || themeConfig.palette,
                        }}
                        presetName={
                          generatedThemeName || themeConfig.displayName
                        }
                        currentTheme={currentTheme}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  <Label htmlFor="preview" className="text-muted-foreground">
                    Preview
                  </Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {Object.keys(
                      (generatedTheme || themeConfig.palette)[currentTheme]
                    ).map((colorKey) => (
                      <div
                        key={colorKey}
                        id={colorKey}
                        className={cn(
                          "h-8",
                          "p-1 rounded-full w-full",
                          "border-2 border-black/20 dark:border-white/20"
                        )}
                        style={{
                          backgroundColor: (generatedTheme ||
                            themeConfig.palette)[currentTheme][
                            colorKey as keyof typeof themeConfig.palette.light
                          ],
                        }}
                      />
                    ))}
                  </div>
                </div>
              </DialogDescription>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenGenerate(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isGenerating || !generatedThemeName}
                  onClick={() => {
                    if (!generatedThemeName) return;
                    const newCustomThemes = {
                      ...customThemes,
                      [generatedThemeName]:
                        generatedTheme || themeConfig.palette,
                    };
                    const newPresets = {
                      ...presets,
                      ...newCustomThemes,
                    };
                    window.localStorage.setItem(
                      "customThemes",
                      JSON.stringify(newCustomThemes)
                    );
                    setPresets(newPresets);
                    onPresetSelect(generatedThemeName, newPresets);
                    toast.success("Generated Theme created successfully");
                    setOpenGenerate(false);
                  }}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )} */}
      </div>
    </div>
  );
};
