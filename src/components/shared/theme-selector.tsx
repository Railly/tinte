"use client";

import { ChevronsUpDown, Loader2 } from "lucide-react";
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
  const active = themes.find((t) => t.id === activeId);
  
  const {
    searchResults,
    isSearching,
    searchError,
    searchQuery,
    setSearchQuery,
  } = useThemeSearch();

  // Combine regular themes and search results
  const allThemes = React.useMemo(() => {
    if (searchQuery.trim() && searchResults.length > 0) {
      // Show search results with regular themes as fallback
      const searchIds = new Set(searchResults.map(t => t.id));
      const remainingThemes = themes.filter(t => !searchIds.has(t.id));
      return [...searchResults, ...remainingThemes];
    }
    return themes;
  }, [themes, searchResults, searchQuery]);

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
                      onSelect(theme);
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

            {/* Search results section */}
            {searchQuery.trim() && searchResults.length > 0 && (
              <CommandGroup heading={`Search Results (${searchResults.length})`}>
                {searchResults.map((theme) => (
                  <CommandItem
                    key={theme.id}
                    value={`${theme.name} ${theme.author || ""} ${(theme.tags || []).join(" ")}`}
                    onSelect={() => {
                      onSelect(theme);
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
                            ) : theme.author === "Community" ? (
                              <span className="text-xs">👥</span>
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
                            ) : theme.author === "Community" ? (
                              <span className="text-xs">👥</span>
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
