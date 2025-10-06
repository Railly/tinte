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
    searchLocal,
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
    const name = theme.name || "Unnamed Theme";

    // Check if theme has been properly saved (has a database ID starting with "theme_")
    const isSaved =
      theme.id?.startsWith("theme_") && !theme.id.includes("custom_");

    // If it's saved, remove any (unsaved) indicator
    if (isSaved && name.includes("(unsaved)")) {
      return name.replace(" (unsaved)", "").replace("(unsaved)", "").trim();
    }

    // For unsaved/temporary themes, add (unsaved) if not already present
    const isTemp = isTemporaryTheme(theme.id);
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

      // Call the original onSelect callback
      onSelect(theme);

      // Update URL without navigation to prevent page reload, preserving query params
      if (theme.slug && theme.slug !== "default" && theme.slug !== "theme") {
        const currentUrl = new URL(window.location.href);
        const newUrl = `/workbench/${theme.slug}${currentUrl.search}`;
        window.history.replaceState(null, "", newUrl);
      }
    },
    [searchResults, onSelect],
  );

  // Organize themes into sections with smart local + remote search
  const organizedThemes = React.useMemo(() => {
    const combined = [...themes];

    if (
      selectedSearchTheme &&
      !themes.some((t) => t.id === selectedSearchTheme.id)
    ) {
      combined.push(selectedSearchTheme);
    }

    // Search mode
    if (searchQuery.trim()) {
      const localResults = searchLocal(combined, searchQuery);
      const localIds = new Set(localResults.map((t) => t.id));
      const remoteOnlyResults = searchResults.filter(
        (t) => !localIds.has(t.id),
      );

      return {
        localSearchResults: localResults,
        remoteSearchResults: remoteOnlyResults,
        favoriteThemes: [],
        userThemes: [],
        communityThemes: [],
        builtInThemes: [],
      };
    }

    // Normal mode - categorize all themes
    const favoriteThemeIds = new Set(favoriteThemes.map((t) => t.id));
    const userThemes: ThemeData[] = [];
    const communityThemes: ThemeData[] = [];
    const builtInThemes: ThemeData[] = [];

    combined.forEach((theme) => {
      if (favoriteThemeIds.has(theme.id)) return;

      const isOwnTheme = theme.user?.id === user?.id;
      const isBuiltIn = ["tweakcn", "tinte", "rayso"].includes(
        theme.vendor || "",
      );

      if (isOwnTheme) {
        userThemes.push(theme);
      } else if (isBuiltIn) {
        builtInThemes.push(theme);
      } else {
        communityThemes.push(theme);
      }
    });

    userThemes.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return {
      favoriteThemes: isAuthenticated ? favoriteThemes : [],
      userThemes,
      communityThemes,
      builtInThemes,
      localSearchResults: [],
      remoteSearchResults: [],
    };
  }, [
    themes,
    searchResults,
    searchQuery,
    selectedSearchTheme,
    user,
    favoriteThemes,
    isAuthenticated,
    searchLocal,
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

    // If still not found, check search results
    if (!found && organizedThemes.localSearchResults?.length > 0) {
      found = organizedThemes.localSearchResults.find((t) => t.id === activeId);
    }

    if (!found && organizedThemes.remoteSearchResults?.length > 0) {
      found = organizedThemes.remoteSearchResults.find(
        (t) => t.id === activeId,
      );
    }

    return found;
  }, [mounted, activeTheme, organizedThemes, selectedSearchTheme, activeId]);

  const isLoading = !mounted;

  const flatThemes = React.useMemo(() => {
    if (searchQuery.trim()) {
      return [
        ...organizedThemes.localSearchResults,
        ...organizedThemes.remoteSearchResults,
      ];
    }
    return [
      ...organizedThemes.favoriteThemes,
      ...organizedThemes.userThemes,
      ...organizedThemes.communityThemes,
      ...organizedThemes.builtInThemes,
    ];
  }, [organizedThemes, searchQuery]);

  React.useEffect(() => {
    if (open || !mounted || flatThemes.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA";
      if (isInputFocused) return;

      e.preventDefault();

      const currentIndex = flatThemes.findIndex(
        (t) => t.id === (active?.id || activeId),
      );

      if (currentIndex === -1) return;

      const nextIndex =
        e.key === "ArrowDown"
          ? (currentIndex + 1) % flatThemes.length
          : (currentIndex - 1 + flatThemes.length) % flatThemes.length;

      const nextTheme = flatThemes[nextIndex];
      if (nextTheme) {
        handleThemeSelect(nextTheme);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, mounted, flatThemes, active, activeId, handleThemeSelect]);

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
            placeholder="Search your library & 12k+ themes..."
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[300px] w-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-border">
            {isSearching && searchQuery.trim() && (
              <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching online...</span>
              </div>
            )}
            {searchError && (
              <div className="flex flex-col items-center justify-center gap-2 p-4">
                <div className="text-sm text-destructive text-center">
                  Search failed: {searchError}
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center gap-3 py-8 px-4">
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">
                    {searchQuery.trim() ? "No themes found" : "No theme found"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {searchQuery.trim()
                      ? "Try a different search term"
                      : "Start typing to search"}
                  </p>
                </div>
              </div>
            </CommandEmpty>

            {/* Favorites section - only when not searching AND only when authenticated */}
            {!searchQuery.trim() &&
              isAuthenticated &&
              organizedThemes.favoriteThemes.length > 0 && (
                <CommandGroup heading="Your Favs">
                  {organizedThemes.favoriteThemes.map((theme) => (
                    <CommandItem
                      key={theme.id}
                      value={theme.slug || theme.id}
                      keywords={[
                        theme.name,
                        theme.author || "",
                        ...(theme.tags || []),
                      ]}
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
                    value={theme.slug || theme.id}
                    keywords={[
                      theme.name,
                      theme.author || "",
                      ...(theme.tags || []),
                    ]}
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
                      value={theme.slug || theme.id}
                      keywords={[
                        theme.name,
                        theme.author || "",
                        ...(theme.tags || []),
                      ]}
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
                      value={theme.slug || theme.id}
                      keywords={[
                        theme.name,
                        theme.author || "",
                        ...(theme.tags || []),
                      ]}
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

            {/* Local search results section */}
            {searchQuery.trim() &&
              organizedThemes.localSearchResults &&
              organizedThemes.localSearchResults.length > 0 && (
                <CommandGroup
                  heading={
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">
                        Your Library
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal px-1.5 py-0.5 rounded-md bg-muted/50">
                        {organizedThemes.localSearchResults.length}
                      </span>
                    </div>
                  }
                >
                  {organizedThemes.localSearchResults.map((theme) => (
                    <CommandItem
                      key={theme.id}
                      value={theme.slug || theme.id}
                      keywords={[
                        theme.name,
                        theme.author || "",
                        ...(theme.tags || []),
                      ]}
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

            {/* Divider between local and remote results */}
            {searchQuery.trim() &&
              organizedThemes.localSearchResults &&
              organizedThemes.localSearchResults.length > 0 &&
              organizedThemes.remoteSearchResults &&
              organizedThemes.remoteSearchResults.length > 0 && (
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center px-2">
                    <div className="w-full border-t border-border/50"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-popover px-2 text-[10px] text-muted-foreground/70">
                      12k+ online themes
                    </span>
                  </div>
                </div>
              )}

            {/* Remote search results section */}
            {searchQuery.trim() &&
              organizedThemes.remoteSearchResults &&
              organizedThemes.remoteSearchResults.length > 0 && (
                <CommandGroup
                  heading={
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">Browse All</span>
                      <span className="text-[10px] text-muted-foreground font-normal px-1.5 py-0.5 rounded-md bg-muted/50">
                        {organizedThemes.remoteSearchResults.length}
                      </span>
                    </div>
                  }
                >
                  {organizedThemes.remoteSearchResults.map((theme) => (
                    <CommandItem
                      key={theme.id}
                      value={theme.slug || theme.id}
                      keywords={[
                        theme.name,
                        theme.author || "",
                        ...(theme.tags || []),
                      ]}
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
