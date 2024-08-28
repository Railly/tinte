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
import { Palette, ThemeConfig } from "@/lib/core/types";
import { FEATURED_THEME_LOGOS } from "@/lib/constants";
import { useMemo } from "react";
import { getThemeCategories } from "@/app/utils";
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();
  const themeCategories = useMemo(() => {
    return getThemeCategories(themes, user?.id);
  }, [themes, user?.id]);

  const defaultPalette: Palette = {
    id: "",
    text: "",
    "text-2": "",
    "text-3": "",
    interface: "",
    "interface-2": "",
    "interface-3": "",
    background: "",
    "background-2": "",
    primary: "",
    secondary: "",
    accent: "",
    "accent-2": "",
    "accent-3": "",
  };

  const getSelectValue = (theme: ThemeConfig) => {
    const category =
      theme.category.charAt(0).toUpperCase() + theme.category.slice(1);
    return `${category}:${theme.id}:${theme.displayName}`;
  };

  const renderThemeItem = (
    theme: ThemeConfig | undefined,
    category: string,
  ) => {
    if (!theme) return null;
    const uniqueKey = `${category}-${theme.id}-${theme.displayName}`;
    const displayValue = getSelectValue(theme);

    return (
      <SelectItem key={uniqueKey} value={displayValue}>
        <div className="flex items-center gap-2">
          {category === "Featured" &&
            theme.displayName &&
            FEATURED_THEME_LOGOS[
              theme.displayName as keyof typeof FEATURED_THEME_LOGOS
            ]}
          {category !== "Featured" && (
            <CircularGradient
              palette={theme.palette?.[currentTheme] || defaultPalette}
            />
          )}
          <span className="truncate max-w-[20ch]">
            {theme.displayName}
            {category !== "Featured" && (
              <span className="text-xs text-muted-foreground ml-1">
                ({category})
              </span>
            )}
          </span>
        </div>
      </SelectItem>
    );
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Label
        htmlFor="theme"
        className={cn("text-muted-foreground", labelClassName)}
      >
        {label || "Current Theme"}
      </Label>
      <div className="flex gap-2">
        <Select
          value={getSelectValue(themeConfig)}
          onValueChange={(value) => {
            const [, , themeName] = value.split(":");
            onSelectTheme(themeName as string);
          }}
        >
          <SelectTrigger className={cn("w-[20ch]", className)}>
            <SelectValue id="theme" placeholder="Select preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Featured</SelectLabel>
              {themeCategories.featuredThemes?.map((theme) =>
                renderThemeItem(theme, "Featured"),
              )}
            </SelectGroup>
            {themeCategories.userThemes.length > 0 && (
              <SelectGroup className="border-t mt-1 pt-1">
                <SelectLabel>Your Themes</SelectLabel>
                {themeCategories.userThemes.map((theme) =>
                  renderThemeItem(theme, "User"),
                )}
              </SelectGroup>
            )}
            <SelectGroup className="border-t pt-1 mt-1">
              <SelectLabel>Ray.so</SelectLabel>
              {themeCategories.raysoThemes.map((theme) =>
                renderThemeItem(theme, "Ray.so"),
              )}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Community</SelectLabel>
              {themeCategories.communityThemes.map((theme) =>
                renderThemeItem(theme, "Community"),
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
