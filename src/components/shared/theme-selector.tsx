"use client";

import { ChevronsUpDown, Heart, Loader2, Users, UserX } from "lucide-react";
import * as React from "react";
import RaycastIcon from "@/components/shared/icons/raycast";
import TweakCNIcon from "@/components/shared/icons/tweakcn";
import InvertedLogo from "@/components/shared/inverted-logo";
import Logo from "@/components/shared/logo";
import { ThemeColorPreview } from "@/components/shared/theme-color-preview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useThemeSearch } from "@/hooks/use-theme-search";
import type { ThemeData } from "@/lib/theme-tokens";
import { extractThemeColors } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme";

export function ThemeSelector({
  themes,
  activeId,
  activeTheme,
  onSelect,
  triggerClassName,
  label = "Themes",
  popoverWidth,
}: {
  themes: ThemeData[];
  activeId?: string | null;
  activeTheme?: ThemeData | null;
  onSelect: (t: ThemeData) => void;
  triggerClassName?: string;
  label?: string;
  popoverWidth?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { currentMode, user, mounted, favoriteThemes, isAuthenticated } =
    useThemeContext();

  const {
    searchResults,
    isSearching,
    searchError,
    searchQuery,
    setSearchQuery,
  } = useThemeSearch();

  const [selectedSearchTheme, setSelectedSearchTheme] =
    React.useState<ThemeData | null>(null);

  // Helper function to detect temporary themes that need saving first
  const isTemporaryTheme = (id?: string): boolean => {
    if (!id) return true;
    return (
      id.startsWith("ai-generated-") ||
      id.startsWith("custom_") ||
      Boolean(id.match(/^theme_\d+$/)) || // Temporary import IDs like theme_1758412202896
      id === "theme" ||
      id === "default"
    );
  };

  // Helper function to get display name with (unsaved) indicator
  const getDisplayName = (theme: ThemeData): string => {
    const isTemp = isTemporaryTheme(theme.id);
    const name = theme.name || "Unnamed Theme";

    // If it's temporary and doesn't already show (unsaved), add it
    if (isTemp && !name.includes("(unsaved)")) {
      return `${name} (unsaved)`;
    }

    return name;
  };

  // Helper function to render author icon
  const renderAuthorIcon = (theme: ThemeData, size: number = 12) => {
    // Check for vendor-specific themes first
    if (theme.author === "tweakcn" || theme.provider === "tweakcn") {
      return <TweakCNIcon className="w-3 h-3" />;
    }

    if (theme.author === "ray.so" || theme.provider === "rayso") {
      return <RaycastIcon className="w-3 h-3" />;
    }

    if (theme.author === "tinte" || theme.provider === "tinte") {
      // If user has an image, show their avatar
      if (theme.user?.image) {
        return (
          <Avatar className="w-3 h-3">
            <AvatarImage
              src={theme.user.image}
              alt={theme.user.name || "User"}
            />
            <AvatarFallback className="text-[8px]">
              {(theme.user.name?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      }

      // If no user image but has user ID, show anonymous avatar
      if (theme.user?.id) {
        return (
          <Avatar className="w-3 h-3">
            <AvatarFallback className="text-[8px]">
              {(theme.user.name?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      }

      // Anonymous theme - show InvertedLogo
      return <InvertedLogo size={12} />;
    }

    // Fallback for other providers - show InvertedLogo for anonymous themes
    return <InvertedLogo size={12} />;
  };

  const handleThemeSelect = React.useCallback(
    (theme: ThemeData) => {
      if (searchResults.some((t) => t.id === theme.id)) {
        setSelectedSearchTheme(theme);
      }
      onSelect(theme);
    },
    [searchResults, onSelect],
  );

  // Organize themes into sections
  const organizedThemes = React.useMemo(() => {
    const combined = [...themes];

    // Add selected search theme if it's not already in the themes list
    if (
      selectedSearchTheme &&
      !themes.some((t) => t.id === selectedSearchTheme.id)
    ) {
      combined.push(selectedSearchTheme);
    }

    if (searchQuery.trim() && searchResults.length > 0) {
      // Show search results with regular themes as fallback
      const searchIds = new Set(searchResults.map((t) => t.id));
      const remainingThemes = combined.filter((t) => !searchIds.has(t.id));
      return {
        searchResults: searchResults,
        remainingThemes: remainingThemes,
        favoriteThemes: [],
        userThemes: [],
        communityThemes: [],
        builtInThemes: [],
      };
    }

    // Create a set of favorite theme IDs to avoid duplicates
    const favoriteThemeIds = new Set(favoriteThemes.map((t) => t.id));

    // Separate themes into categories, excluding those already in favorites
    const userThemes: ThemeData[] = [];
    const communityThemes: ThemeData[] = [];
    const builtInThemes: ThemeData[] = [];

    combined.forEach((theme) => {
      // Skip if this theme is already in favorites section
      if (favoriteThemeIds.has(theme.id)) {
        return;
      }

      // Check if theme belongs to current user
      const isOwnTheme = theme.user?.id === user?.id;
      const isCustomTheme =
        theme.author === "You" || theme.name?.includes("Custom");
      const isUserCreated =
        theme.provider === "tinte" && (isOwnTheme || isCustomTheme);

      // Check if it's a community theme (user-created but not own)
      const isCommunityTheme =
        theme.provider === "tinte" &&
        theme.user?.id &&
        theme.user.id !== user?.id;

      // Check if it's a built-in theme (only official presets)
      const isBuiltInTheme =
        (["tweakcn", "ray.so", "tinte"].includes(theme.author || "") ||
          ["tweakcn", "rayso", "tinte"].includes(theme.provider || "")) &&
        !theme.user?.id;

      if (isUserCreated || isOwnTheme) {
        userThemes.push(theme);
      } else if (isCommunityTheme) {
        communityThemes.push(theme);
      } else if (isBuiltInTheme) {
        builtInThemes.push(theme);
      }
      // Remove fallback - themes that don't match any category are ignored
    });

    // Sort user themes by creation date (newest first)
    userThemes.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return {
      favoriteThemes: isAuthenticated ? favoriteThemes : [],
      userThemes,
      communityThemes,
      builtInThemes,
      searchResults: [],
      remainingThemes: [],
    };
  }, [
    themes,
    searchResults,
    searchQuery,
    selectedSearchTheme,
    user,
    favoriteThemes,
    isAuthenticated,
  ]);

  // Find active theme in ALL available themes (user + built-in + search results)
  const active = React.useMemo(() => {
    // During SSR or initial render, only use activeTheme if provided to avoid hydration mismatch
    if (!mounted && activeTheme) {
      return activeTheme;
    }

    // ALWAYS prioritize activeTheme if provided directly (for modified themes)
    // This ensures that edited themes with changed names/IDs are displayed correctly
    if (activeTheme) {
      return activeTheme;
    }

    // During SSR, don't calculate complex theme lookups to avoid hydration issues
    if (!mounted) {
      return null;
    }

    // Fallback: search by activeId in organized themes only if no activeTheme provided
    // First check favorite themes
    let found = organizedThemes.favoriteThemes.find((t) => t.id === activeId);

    // Then check user themes
    if (!found) {
      found = organizedThemes.userThemes.find((t) => t.id === activeId);
    }

    // Then check community themes
    if (!found) {
      found = organizedThemes.communityThemes.find((t) => t.id === activeId);
    }

    // Then check built-in themes
    if (!found) {
      found = organizedThemes.builtInThemes.find((t) => t.id === activeId);
    }

    // If not found, check selected search theme
    if (!found && selectedSearchTheme && selectedSearchTheme.id === activeId) {
      found = selectedSearchTheme;
    }

    // If still not found and we have search results, look there too
    if (!found && organizedThemes.searchResults.length > 0) {
      found = organizedThemes.searchResults.find((t) => t.id === activeId);
    }

    return found;
  }, [mounted, activeTheme, organizedThemes, selectedSearchTheme, activeId]);

  const isLoading = !mounted;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="sm"
          className={cn(
            "justify-between gap-2 md:h-auto md:py-1.5 hover:text-muted-foreground",
            triggerClassName,
          )}
          title={label}
        >
          {/* Desktop layout - horizontal */}
          <div className="hidden md:flex items-center gap-2 min-w-0">
            {isLoading ? (
              <>
                <div className="flex gap-0.5">
                  <div className="w-4 h-4 bg-muted/30 rounded-sm animate-pulse"></div>
                  <div className="w-4 h-4 bg-muted/30 rounded-sm animate-pulse"></div>
                  <div className="w-4 h-4 bg-muted/30 rounded-sm animate-pulse"></div>
                </div>
                <div className="h-4 w-16 bg-muted/30 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                {active && (
                  <ThemeColorPreview
                    colors={extractThemeColors(active, currentMode)}
                    maxColors={3}
                  />
                )}
                <span className="truncate">
                  {active ? getDisplayName(active) : label}
                </span>
              </>
            )}
          </div>

          {/* Mobile layout - stacked */}
          <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
            {isLoading ? (
              <>
                <div className="h-3 w-20 bg-muted/30 rounded animate-pulse"></div>
                <div className="flex gap-0.5">
                  <div className="w-3 h-2 bg-muted/30 rounded-sm animate-pulse"></div>
                  <div className="w-3 h-2 bg-muted/30 rounded-sm animate-pulse"></div>
                  <div className="w-3 h-2 bg-muted/30 rounded-sm animate-pulse"></div>
                  <div className="w-3 h-2 bg-muted/30 rounded-sm animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="text-xs font-medium truncate">
                    {active ? getDisplayName(active) : label}
                  </span>
                </div>
                {active && (
                  <ThemeColorPreview
                    colors={extractThemeColors(active, currentMode)}
                    maxColors={8}
                    size="sm"
                    className="self-start"
                  />
                )}
              </>
            )}
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 md:h-3 md:w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          popoverWidth ? popoverWidth : "w-(--radix-popover-trigger-width)",
          "p-0",
        )}
      >
        <Command>
          <CommandInput
            placeholder="Search 12k+ themes..."
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[300px] w-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-border">
            {isSearching && (
              <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching themes...
              </div>
            )}
            {searchError && (
              <div className="p-2 text-sm text-destructive">
                Search failed: {searchError}
              </div>
            )}
            <CommandEmpty>
              {searchQuery.trim()
                ? "No themes found for your search."
                : "No theme found."}
            </CommandEmpty>

            {/* Favorites section - only when not searching AND only when authenticated */}
            {!searchQuery.trim() &&
              isAuthenticated &&
              organizedThemes.favoriteThemes.length > 0 && (
                <CommandGroup heading="Your Favs">
                  {organizedThemes.favoriteThemes.map((theme) => (
                    <CommandItem
                      key={theme.id}
                      value={`${theme.name} ${theme.author || ""} ${(theme.tags || []).join(" ")}`}
                      onSelect={() => {
                        handleThemeSelect(theme);
                        setOpen(false);
                      }}
                      className="gap-2 md:h-auto md:py-2"
                    >
                      {/* Desktop layout - horizontal */}
                      <div className="hidden md:flex items-center gap-2 min-w-0 flex-1">
                        <ThemeColorPreview
                          colors={extractThemeColors(theme, currentMode)}
                          maxColors={3}
                        />
                        <div className="flex justify-between gap-0.5 min-w-0 flex-1">
                          <span className="text-xs font-medium truncate">
                            {theme.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className="flex items-center text-[10px] text-muted-foreground truncate">
                              {renderAuthorIcon(theme, 12)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile layout - stacked */}
                      <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="text-xs font-medium truncate">
                            {theme.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-current text-red-500" />
                            <div className="flex items-center text-[10px] text-muted-foreground truncate">
                              {renderAuthorIcon(theme, 12)}
                            </div>
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
                  ))}
                </CommandGroup>
              )}

            {/* User themes section - only when not searching */}
            {!searchQuery.trim() && organizedThemes.userThemes.length > 0 && (
              <CommandGroup heading="Your Themes">
                {organizedThemes.userThemes.map((theme) => (
                  <CommandItem
                    key={theme.id}
                    value={`${theme.name} ${theme.author || ""} ${(theme.tags || []).join(" ")}`}
                    onSelect={() => {
                      handleThemeSelect(theme);
                      setOpen(false);
                    }}
                    className="gap-2 md:h-auto md:py-2"
                  >
                    {/* Desktop layout - horizontal - simplified for user themes */}
                    <div className="hidden md:flex items-center gap-2 min-w-0 flex-1">
                      <ThemeColorPreview
                        colors={extractThemeColors(theme, currentMode)}
                        maxColors={3}
                      />
                      <span className="text-xs font-medium truncate">
                        {theme.name}
                      </span>
                    </div>

                    {/* Mobile layout - stacked - simplified for user themes */}
                    <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
                      <span className="text-xs font-medium truncate">
                        {theme.name}
                      </span>
                      <ThemeColorPreview
                        colors={extractThemeColors(theme, currentMode)}
                        maxColors={8}
                        size="sm"
                        className="self-start"
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Community themes section - only when not searching */}
            {!searchQuery.trim() &&
              organizedThemes.communityThemes.length > 0 && (
                <CommandGroup heading="Community Themes">
                  {organizedThemes.communityThemes.map((theme) => (
                    <CommandItem
                      key={theme.id}
                      value={`${theme.name} ${theme.author || ""} ${(theme.tags || []).join(" ")}`}
                      onSelect={() => {
                        handleThemeSelect(theme);
                        setOpen(false);
                      }}
                      className="gap-2 md:h-auto md:py-2"
                    >
                      {/* Desktop layout - horizontal */}
                      <div className="hidden md:flex items-center gap-2 min-w-0 flex-1">
                        <ThemeColorPreview
                          colors={extractThemeColors(theme, currentMode)}
                          maxColors={3}
                        />
                        <div className="flex justify-between gap-0.5 min-w-0 flex-1">
                          <span className="text-xs font-medium truncate">
                            {theme.name}
                          </span>
                          <div className="flex items-center text-[10px] text-muted-foreground truncate">
                            {renderAuthorIcon(theme, 12)}
                          </div>
                        </div>
                      </div>

                      {/* Mobile layout - stacked */}
                      <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="text-xs font-medium truncate">
                            {theme.name}
                          </span>
                          <div className="flex items-center text-[10px] text-muted-foreground truncate ml-2">
                            {renderAuthorIcon(theme, 12)}
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
                  ))}
                </CommandGroup>
              )}

            {/* Built-in themes section - only when not searching */}
            {!searchQuery.trim() &&
              organizedThemes.builtInThemes.length > 0 && (
                <CommandGroup heading="Built-in Themes">
                  {organizedThemes.builtInThemes.map((theme) => (
                    <CommandItem
                      key={theme.id}
                      value={`${theme.name} ${theme.author || ""} ${(theme.tags || []).join(" ")}`}
                      onSelect={() => {
                        handleThemeSelect(theme);
                        setOpen(false);
                      }}
                      className="gap-2 md:h-auto md:py-2"
                    >
                      {/* Desktop layout - horizontal */}
                      <div className="hidden md:flex items-center gap-2 min-w-0 flex-1">
                        <ThemeColorPreview
                          colors={extractThemeColors(theme, currentMode)}
                          maxColors={3}
                        />
                        <div className="flex justify-between gap-0.5 min-w-0 flex-1">
                          <span className="text-xs font-medium truncate">
                            {theme.name}
                          </span>
                          <div className="flex items-center text-[10px] text-muted-foreground truncate">
                            {renderAuthorIcon(theme, 12)}
                          </div>
                        </div>
                      </div>

                      {/* Mobile layout - stacked */}
                      <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="text-xs font-medium truncate">
                            {theme.name}
                          </span>
                          <div className="flex items-center text-[10px] text-muted-foreground truncate ml-2">
                            {renderAuthorIcon(theme, 12)}
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
                  ))}
                </CommandGroup>
              )}

            {/* Search results section */}
            {searchQuery.trim() && searchResults.length > 0 && (
              <CommandGroup
                heading={`Search Results (${searchResults.length})`}
              >
                {searchResults.map((theme) => (
                  <CommandItem
                    key={theme.id}
                    value={`${theme.name} ${theme.author || ""} ${(theme.tags || []).join(" ")}`}
                    onSelect={() => {
                      handleThemeSelect(theme);
                      setOpen(false);
                    }}
                    className="gap-2 md:h-auto md:py-2"
                  >
                    {/* Desktop layout - horizontal */}
                    <div className="hidden md:flex items-center gap-2 min-w-0 flex-1">
                      <ThemeColorPreview
                        colors={extractThemeColors(theme, currentMode)}
                        maxColors={3}
                      />
                      <div className="flex justify-between gap-0.5 min-w-0 flex-1">
                        <span className="text-xs font-medium truncate">
                          {theme.name}
                        </span>
                        <div className="flex items-center text-[10px] text-muted-foreground truncate">
                          {renderAuthorIcon(theme, 12)}
                        </div>
                      </div>
                    </div>

                    {/* Mobile layout - stacked */}
                    <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="text-xs font-medium truncate">
                          {theme.name}
                        </span>
                        <div className="flex items-center text-[10px] text-muted-foreground truncate ml-2">
                          {renderAuthorIcon(theme, 12)}
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
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
