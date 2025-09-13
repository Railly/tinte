"use client";

import { ChevronsUpDown, Loader2, Users, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import RaycastIcon from "@/components/shared/icons/raycast";
import TweakCNIcon from "@/components/shared/icons/tweakcn";
import Logo from "@/components/shared/logo";
import { ThemeColorPreview } from "@/components/shared/theme-color-preview";
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
import type { ThemeData } from "@/lib/theme-tokens";
import { extractThemeColors } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme";
import { useThemeSearch } from "@/hooks/use-theme-search";

export function ThemeSelector({
  themes,
  activeId,
  onSelect,
  triggerClassName,
  label = "Themes",
}: {
  themes: ThemeData[];
  activeId?: string | null;
  onSelect: (t: ThemeData) => void;
  triggerClassName?: string;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { currentMode } = useThemeContext();

  const {
    searchResults,
    isSearching,
    searchError,
    searchQuery,
    setSearchQuery,
  } = useThemeSearch();

  // Fetch popular community themes for default display
  const [popularCommunityThemes, setPopularCommunityThemes] = React.useState<ThemeData[]>([]);

  React.useEffect(() => {
    // Fetch popular community themes when component mounts
    const fetchPopularThemes = async () => {
      try {
        const response = await fetch('/api/themes/popular?limit=10');
        if (response.ok) {
          const data = await response.json();
          setPopularCommunityThemes(data.themes || []);
        }
      } catch (error) {
        console.error('Failed to fetch popular themes:', error);
      }
    };

    fetchPopularThemes();
  }, []);

  // Store the selected theme from search so it persists even when search is cleared
  const [selectedSearchTheme, setSelectedSearchTheme] = React.useState<ThemeData | null>(null);

  // Update selected search theme when a theme is selected
  const handleThemeSelect = React.useCallback((theme: ThemeData) => {
    // If this theme came from search results, store it
    if (searchResults.some(t => t.id === theme.id)) {
      setSelectedSearchTheme(theme);
    }
    onSelect(theme);
  }, [searchResults, onSelect]);

  // Combine regular themes and search results
  const allThemes = React.useMemo(() => {
    let combined = [...themes];

    // Add selected search theme if it's not already in the themes list
    if (selectedSearchTheme && !themes.some(t => t.id === selectedSearchTheme.id)) {
      combined.push(selectedSearchTheme);
    }

    // Add popular community themes when no search is active
    if (!searchQuery.trim() && popularCommunityThemes.length > 0) {
      const existingIds = new Set(combined.map(t => t.id));
      const newCommunityThemes = popularCommunityThemes.filter(t => !existingIds.has(t.id));
      combined.push(...newCommunityThemes);
    }

    if (searchQuery.trim() && searchResults.length > 0) {
      // Show search results with regular themes as fallback
      const searchIds = new Set(searchResults.map(t => t.id));
      const remainingThemes = combined.filter(t => !searchIds.has(t.id));
      return [...searchResults, ...remainingThemes];
    }

    return combined;
  }, [themes, searchResults, searchQuery, selectedSearchTheme, popularCommunityThemes]);

  // Find active theme in ALL available themes (built-in + search results + selected search theme)
  const active = React.useMemo(() => {
    // First try to find in built-in themes
    let found = themes.find((t) => t.id === activeId);

    // If not found, check selected search theme
    if (!found && selectedSearchTheme && selectedSearchTheme.id === activeId) {
      found = selectedSearchTheme;
    }

    // If still not found and we have search results, look there too
    if (!found && searchResults.length > 0) {
      found = searchResults.find((t) => t.id === activeId);
    }

    return found;
  }, [themes, searchResults, selectedSearchTheme, activeId]);

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
            {active && (
              <ThemeColorPreview
                colors={extractThemeColors(active, currentMode)}
                maxColors={3}
              />
            )}
            <span className="truncate">{active ? active.name : label}</span>
          </div>

          {/* Mobile layout - stacked */}
          <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center justify-between w-full min-w-0">
              <span className="text-xs font-medium truncate">
                {active ? active.name : label}
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
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 md:h-3 md:w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-0"
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
              {searchQuery.trim() ? "No themes found for your search." : "No theme found."}
            </CommandEmpty>

            {/* Regular themes section */}
            {themes.length > 0 && !searchQuery.trim() && (
              <CommandGroup heading="Built-in Themes">
                {themes.map((theme) => (
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
                        {theme.author && (
                          <div className="flex items-center text-[10px] text-muted-foreground truncate">
                            {theme.author === "tweakcn" ? (
                              <TweakCNIcon className="w-3 h-3" />
                            ) : theme.author === "ray.so" ? (
                              <RaycastIcon className="w-3 h-3" />
                            ) : theme.author === "tinte" ? (
                              <Logo size={12} className="invert" />
                            ) : (
                              <>
                                {theme.author && (
                                  <div className="flex items-center text-[10px] text-muted-foreground truncate">
                                    {theme.user?.image ? (
                                      <Avatar className="w-3 h-3">
                                        <AvatarImage
                                          src={theme.user.image}
                                          alt={theme.user.name || "User"}
                                        />
                                        <AvatarFallback className="text-[8px]">
                                          {(theme.user.name?.[0] || "U").toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <UserX className="w-3 h-3" />
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile layout - stacked */}
                    <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="text-xs font-medium truncate">
                          {theme.name}
                        </span>
                        {theme.author && (
                          <div className="flex items-center text-[10px] text-muted-foreground truncate ml-2">
                            {theme.author === "tweakcn" ? (
                              <TweakCNIcon className="w-3 h-3" />
                            ) : theme.author === "ray.so" ? (
                              <RaycastIcon className="w-3 h-3" />
                            ) : theme.author === "tinte" ? (
                              <Logo size={12} />
                            ) : (
                              <>
                                {theme.author && (
                                  <div className="flex items-center text-[10px] text-muted-foreground truncate">
                                    {theme.user?.image ? (
                                      <Avatar className="w-3 h-3">
                                        <AvatarImage
                                          src={theme.user.image}
                                          alt={theme.user.name || "User"}
                                        />
                                        <AvatarFallback className="text-[8px]">
                                          {(theme.user.name?.[0] || "U").toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <UserX className="w-3 h-3" />
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
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

            {/* Popular community themes section */}
            {!searchQuery.trim() && popularCommunityThemes.length > 0 && (
              <CommandGroup heading="Popular Community Themes">
                {popularCommunityThemes.map((theme) => (
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
                        {theme.author && (
                          <div className="flex items-center text-[10px] text-muted-foreground truncate">
                            {theme.user?.image ? (
                              <Avatar className="w-3 h-3">
                                <AvatarImage
                                  src={theme.user.image}
                                  alt={theme.user.name || "User"}
                                />
                                <AvatarFallback className="text-[8px]">
                                  {(theme.user.name?.[0] || "U").toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <UserX className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile layout - stacked */}
                    <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="text-xs font-medium truncate">
                          {theme.name}
                        </span>
                        {theme.author && (
                          <div className="flex items-center text-[10px] text-muted-foreground truncate ml-2">
                            {theme.user?.image ? (
                              <Avatar className="w-3 h-3">
                                <AvatarImage
                                  src={theme.user.image}
                                  alt={theme.user.name || "User"}
                                />
                                <AvatarFallback className="text-[8px]">
                                  {(theme.user.name?.[0] || "U").toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <UserX className="w-3 h-3" />
                            )}
                          </div>
                        )}
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
              <CommandGroup heading={`Search Results (${searchResults.length})`}>
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
                        {theme.author && (
                          <div className="flex items-center text-[10px] text-muted-foreground truncate">
                            {theme.author === "tweakcn" ? (
                              <TweakCNIcon className="w-3 h-3" />
                            ) : theme.author === "ray.so" ? (
                              <RaycastIcon className="w-3 h-3" />
                            ) : theme.author === "tinte" ? (
                              <Logo size={12} className="invert" />
                            ) : theme.provider === "tinte" && theme.user?.image ? (
                              // User-created theme with avatar
                              <Avatar className="w-3 h-3">
                                <AvatarImage
                                  src={theme.user.image}
                                  alt={theme.user.name || "User"}
                                />
                                <AvatarFallback className="text-[8px]">
                                  {(theme.user.name?.[0] || "U").toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : theme.provider === "tinte" ? (
                              // User-created theme without avatar (anonymous)
                              <UserX className="w-3 h-3" />
                            ) : (
                              theme.author
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile layout - stacked */}
                    <div className="flex md:hidden flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="text-xs font-medium truncate">
                          {theme.name}
                        </span>
                        {theme.author && (
                          <div className="flex items-center text-[10px] text-muted-foreground truncate ml-2">
                            {theme.author === "tweakcn" ? (
                              <TweakCNIcon className="w-3 h-3" />
                            ) : theme.author === "ray.so" ? (
                              <RaycastIcon className="w-3 h-3" />
                            ) : theme.author === "tinte" ? (
                              <Logo size={12} />
                            ) : theme.provider === "tinte" && theme.user?.image ? (
                              // User-created theme with avatar
                              <Avatar className="w-3 h-3">
                                <AvatarImage
                                  src={theme.user.image}
                                  alt={theme.user.name || "User"}
                                />
                                <AvatarFallback className="text-[8px]">
                                  {(theme.user.name?.[0] || "U").toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : theme.provider === "tinte" ? (
                              // User-created theme without avatar (anonymous)
                              <UserX className="w-3 h-3" />
                            ) : (
                              theme.author
                            )}
                          </div>
                        )}
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
