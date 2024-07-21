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
import { ThemeConfig } from "@/lib/core/types";
import { FEATURED_THEME_LOGOS } from "@/lib/constants";
import { useMemo } from "react";
import { getThemeCategories } from "@/app/utils";

interface ThemeSelectorProps {
  label?: string;
  labelClassName?: string;
  className?: string;
  currentTheme: "light" | "dark";
  themeConfig: ThemeConfig;
  onSelectTheme: (presetName: string) => void;
  themes: ThemeConfig[];
}

export const ThemeSelector = ({
  label,
  labelClassName,
  className,
  currentTheme,
  themeConfig,
  onSelectTheme,
  themes,
}: ThemeSelectorProps) => {
  const themeCategories = useMemo(() => {
    return getThemeCategories(themes);
  }, [themes]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Label
        htmlFor="theme"
        className={cn("text-muted-foreground", labelClassName)}
      >
        {label || "Current Theme"}
      </Label>
      <div className="flex gap-2">
        <Select value={themeConfig.displayName} onValueChange={onSelectTheme}>
          <SelectTrigger className={cn("w-[20ch]", className)}>
            <SelectValue id="theme" placeholder="Select preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Featured</SelectLabel>
              {themeCategories.featuredThemes?.map((theme) => (
                <SelectItem key={theme.displayName} value={theme.displayName}>
                  <div className="flex items-center gap-2">
                    {
                      FEATURED_THEME_LOGOS[
                        theme.displayName as keyof typeof FEATURED_THEME_LOGOS
                      ]
                    }
                    <span className="truncate max-w-[20ch]">
                      {theme.displayName}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
            {themeCategories.userThemes.length > 0 && (
              <SelectGroup className="border-t mt-1 pt-1">
                <SelectLabel>Your Themes</SelectLabel>
                {themeCategories.userThemes.map((theme) => (
                  <SelectItem key={theme.displayName} value={theme.displayName}>
                    <div className="flex items-center gap-2">
                      <CircularGradient palette={theme.palette[currentTheme]} />
                      <span className="truncate max-w-[20ch]">
                        {theme.displayName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            <SelectGroup className="border-t pt-1 mt-1">
              <SelectLabel>Ray.so</SelectLabel>
              {themeCategories.raysoThemes.map((theme) => (
                <SelectItem key={theme.displayName} value={theme.displayName}>
                  <div className="flex items-center gap-2">
                    <CircularGradient palette={theme.palette[currentTheme]} />
                    <span className="truncate max-w-[20ch]">
                      {theme.displayName}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Community</SelectLabel>
              {themeCategories.communityThemes.map((theme) => (
                <SelectItem key={theme.displayName} value={theme.displayName}>
                  <div className="flex items-center gap-2">
                    <CircularGradient palette={theme.palette[currentTheme]} />
                    <span className="truncate max-w-[20ch]">
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
