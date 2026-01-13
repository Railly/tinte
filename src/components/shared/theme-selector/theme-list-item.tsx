"use client";

import { Heart } from "lucide-react";
import { ThemeColorPreview } from "@/components/shared/theme-color-preview";
import { CommandItem } from "@/components/ui/command";
import type { ThemeData } from "@/lib/theme-tokens";
import { extractThemeColors } from "@/lib/theme-utils";
import { AuthorIcon } from "./author-icon";

interface ThemeListItemProps {
  theme: ThemeData;
  currentMode: "light" | "dark";
  onSelect: () => void;
  showAuthorIcon?: boolean;
  showFavoriteIcon?: boolean;
}

export function ThemeListItem({
  theme,
  currentMode,
  onSelect,
  showAuthorIcon = true,
  showFavoriteIcon = false,
}: ThemeListItemProps) {
  return (
    <CommandItem
      value={theme.slug || theme.id}
      keywords={[theme.name, theme.author || "", ...(theme.tags || [])]}
      onSelect={onSelect}
      className="gap-2 md:h-auto md:py-2"
    >
      <div className="hidden md:flex items-center gap-2 min-w-0 flex-1">
        <ThemeColorPreview
          colors={extractThemeColors(theme, currentMode)}
          maxColors={3}
        />
        <div className="flex justify-between gap-0.5 min-w-0 flex-1">
          <span className="text-xs font-medium truncate">{theme.name}</span>
          {showAuthorIcon && (
            <div className="flex items-center text-[10px] text-muted-foreground truncate">
              <AuthorIcon theme={theme} />
            </div>
          )}
        </div>
      </div>

      <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center justify-between w-full min-w-0">
          <span className="text-xs font-medium truncate">{theme.name}</span>
          <div className="flex items-center gap-1">
            {showFavoriteIcon && (
              <Heart className="w-3 h-3 fill-current text-red-500" />
            )}
            {showAuthorIcon && (
              <div className="flex items-center text-[10px] text-muted-foreground truncate">
                <AuthorIcon theme={theme} />
              </div>
            )}
          </div>
        </div>
        <ThemeColorPreview
          colors={extractThemeColors(theme, currentMode)}
          maxColors={8}
          size="sm"
          className="self-start"
        />
      </div>
    </CommandItem>
  );
}
