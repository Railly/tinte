"use client";

import { Loader2 } from "lucide-react";
import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useThemeSearch } from "@/hooks/use-theme-search";
import type { ThemeData } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme";
import { ThemeListItem } from "./theme-list-item";
import { ThemeTrigger } from "./theme-trigger";

export { ThemeListItem } from "./theme-list-item";
export { ThemeTrigger } from "./theme-trigger";
export { AuthorIcon } from "./author-icon";
export { isTemporaryTheme, getDisplayName } from "./utils";

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

  const handleThemeSelect = React.useCallback(
    (theme: ThemeData) => {
      if (searchResults.some((t) => t.id === theme.id)) {
        setSelectedSearchTheme(theme);
      }
      onSelect(theme);
      if (theme.slug && theme.slug !== "default" && theme.slug !== "theme") {
        const currentUrl = new URL(window.location.href);
        const newUrl = `/workbench/${theme.slug}${currentUrl.search}`;
        window.history.replaceState(null, "", newUrl);
      }
    },
    [searchResults, onSelect],
  );

  const organizedThemes = React.useMemo(() => {
    const combined = [...themes];
    if (
      selectedSearchTheme &&
      !themes.some((t) => t.id === selectedSearchTheme.id)
    ) {
      combined.push(selectedSearchTheme);
    }

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

    const favoriteThemeIds = new Set(favoriteThemes.map((t) => t.id));
    const userThemes: ThemeData[] = [];
    const communityThemes: ThemeData[] = [];
    const builtInThemes: ThemeData[] = [];

    combined.forEach((theme) => {
      if (favoriteThemeIds.has(theme.id)) return;
      const isOwnTheme = theme.user?.id === user?.id;
      const isBuiltIn = ["tweakcn", "tinte", "rayso"].includes(
        theme.provider || "",
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

    builtInThemes.sort((a, b) => {
      const providerOrder = { tinte: 0, tweakcn: 1, rayso: 2 };
      const providerA =
        providerOrder[a.provider as keyof typeof providerOrder] ?? 3;
      const providerB =
        providerOrder[b.provider as keyof typeof providerOrder] ?? 3;
      return providerA - providerB;
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

  const active = React.useMemo(() => {
    if (!mounted && activeTheme) return activeTheme;
    if (activeTheme) return activeTheme;
    if (!mounted) return null;

    let found = organizedThemes.favoriteThemes.find((t) => t.id === activeId);
    if (!found)
      found = organizedThemes.userThemes.find((t) => t.id === activeId);
    if (!found)
      found = organizedThemes.communityThemes.find((t) => t.id === activeId);
    if (!found)
      found = organizedThemes.builtInThemes.find((t) => t.id === activeId);
    if (!found && selectedSearchTheme && selectedSearchTheme.id === activeId) {
      found = selectedSearchTheme;
    }
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
      if (nextTheme) handleThemeSelect(nextTheme);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, mounted, flatThemes, active, activeId, handleThemeSelect]);

  const handleItemSelect = (theme: ThemeData) => {
    handleThemeSelect(theme);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ThemeTrigger
          active={active}
          currentMode={currentMode}
          isLoading={!mounted}
          label={label}
          triggerClassName={triggerClassName}
          open={open}
        />
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

            {!searchQuery.trim() &&
              isAuthenticated &&
              organizedThemes.favoriteThemes.length > 0 && (
                <CommandGroup heading="Your Favs">
                  {organizedThemes.favoriteThemes.map((theme) => (
                    <ThemeListItem
                      key={theme.id}
                      theme={theme}
                      currentMode={currentMode}
                      onSelect={() => handleItemSelect(theme)}
                      showFavoriteIcon
                    />
                  ))}
                </CommandGroup>
              )}

            {!searchQuery.trim() && organizedThemes.userThemes.length > 0 && (
              <CommandGroup heading="Your Themes">
                {organizedThemes.userThemes.map((theme) => (
                  <ThemeListItem
                    key={theme.id}
                    theme={theme}
                    currentMode={currentMode}
                    onSelect={() => handleItemSelect(theme)}
                    showAuthorIcon={false}
                  />
                ))}
              </CommandGroup>
            )}

            {!searchQuery.trim() &&
              organizedThemes.communityThemes.length > 0 && (
                <CommandGroup heading="Community Themes">
                  {organizedThemes.communityThemes.map((theme) => (
                    <ThemeListItem
                      key={theme.id}
                      theme={theme}
                      currentMode={currentMode}
                      onSelect={() => handleItemSelect(theme)}
                    />
                  ))}
                </CommandGroup>
              )}

            {!searchQuery.trim() &&
              organizedThemes.builtInThemes.length > 0 && (
                <CommandGroup heading="Built-in Themes">
                  {organizedThemes.builtInThemes.map((theme) => (
                    <ThemeListItem
                      key={theme.id}
                      theme={theme}
                      currentMode={currentMode}
                      onSelect={() => handleItemSelect(theme)}
                    />
                  ))}
                </CommandGroup>
              )}

            {searchQuery.trim() &&
              organizedThemes.localSearchResults &&
              organizedThemes.localSearchResults.length > 0 && (
                <CommandGroup
                  heading={
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">Your Library</span>
                      <span className="text-[10px] text-muted-foreground font-normal px-1.5 py-0.5 rounded-md bg-muted/50">
                        {organizedThemes.localSearchResults.length}
                      </span>
                    </div>
                  }
                >
                  {organizedThemes.localSearchResults.map((theme) => (
                    <ThemeListItem
                      key={theme.id}
                      theme={theme}
                      currentMode={currentMode}
                      onSelect={() => handleItemSelect(theme)}
                    />
                  ))}
                </CommandGroup>
              )}

            {searchQuery.trim() &&
              organizedThemes.localSearchResults &&
              organizedThemes.localSearchResults.length > 0 &&
              organizedThemes.remoteSearchResults &&
              organizedThemes.remoteSearchResults.length > 0 && (
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center px-2">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-popover px-2 text-[10px] text-muted-foreground/70">
                      12k+ online themes
                    </span>
                  </div>
                </div>
              )}

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
                    <ThemeListItem
                      key={theme.id}
                      theme={theme}
                      currentMode={currentMode}
                      onSelect={() => handleItemSelect(theme)}
                    />
                  ))}
                </CommandGroup>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
