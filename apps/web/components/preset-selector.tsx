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
import { cn } from "@/lib/utils";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import { FEATURED_THEME_LOGOS } from "@/lib/constants";
import { useEffect, useState } from "react";

interface PresetSelectorProps {
  label?: string;
  className?: string;
  currentTheme: "light" | "dark";
  themeConfig: ThemeConfig;
  onPresetSelect: (presetName: string) => void;
  presets: Record<string, ThemeConfig>;
}

export const PresetSelector = ({
  label,
  className,
  currentTheme,
  themeConfig,
  onPresetSelect,
  presets,
}: PresetSelectorProps) => {
  const featuredThemes = Object.values(presets).filter(
    (theme) => theme.category === "featured"
  );
  const raysoThemes = Object.values(presets).filter(
    (theme) => theme.category === "rayso"
  );

  const [customThemes, setCustomThemes] = useState<
    Record<string, DarkLightPalette>
  >({});

  useEffect(() => {
    const customThemesRaw = window.localStorage.getItem("customThemes") || "{}";
    const customThemesJSON = JSON.parse(customThemesRaw);
    setCustomThemes(customThemesJSON);
  }, []);

  const customThemesList = Object.entries(customThemes).map(
    ([name, palette]) => ({
      name,
      displayName: name,
      palette,
      category: "local",
    })
  ) as ThemeConfig[];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Label htmlFor="theme" className="text-muted-foreground">
        {label || "Base Theme"}
      </Label>
      <div className="flex gap-2">
        <Select value={themeConfig.name} onValueChange={onPresetSelect}>
          <SelectTrigger className={cn("min-w-40", className)}>
            <SelectValue id="theme" placeholder="Select preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Featured</SelectLabel>
              {featuredThemes.map((theme) => (
                <SelectItem key={theme.name} value={theme.name}>
                  <div className="flex items-center gap-2">
                    {
                      FEATURED_THEME_LOGOS[
                        theme.displayName as keyof typeof FEATURED_THEME_LOGOS
                      ]
                    }
                    <span className="truncate max-w-[5.5rem]">
                      {theme.displayName}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
            {customThemesList.length > 0 && (
              <SelectGroup className="border-t mt-1 pt-1">
                <SelectLabel>Local</SelectLabel>
                {customThemesList.map((theme) => (
                  <SelectItem key={theme.name} value={theme.name}>
                    <div className="flex items-center gap-2">
                      <CircularGradient palette={theme.palette[currentTheme]} />
                      <span className="truncate max-w-[5.5rem]">
                        {theme.displayName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            <SelectGroup className="border-t pt-1 mt-1">
              <SelectLabel>Ray.so</SelectLabel>
              {raysoThemes.map((theme) => (
                <SelectItem key={theme.name} value={theme.name}>
                  <div className="flex items-center gap-2">
                    <CircularGradient palette={theme.palette[currentTheme]} />
                    <span className="truncate max-w-[5.5rem]">
                      {theme.displayName}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
