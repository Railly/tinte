"use client";

import {
  CornerDownLeft,
  Home,
  Loader2,
  MessageSquare,
  Moon,
  Palette,
  Search,
  Sun,
  UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { ThemeColorPreview } from "@/components/shared/theme-color-preview";
import RaycastIcon from "@/components/shared/icons/raycast";
import TweakCNIcon from "@/components/shared/icons/tweakcn";
import Logo from "@/components/shared/logo";
import { ALL_PROVIDERS } from "@/config/providers";
import { cn } from "@/lib/utils";
import { extractThemeColors } from "@/lib/theme-utils";
import { useThemeContext } from "@/providers/theme";
import { useThemeSearch } from "@/hooks/use-theme-search";

const NAVIGATION_ITEMS = [
  {
    id: "home",
    title: "Home",
    path: "/",
    icon: Home,
    shortcut: "h",
    description: "Go to homepage",
  },
  {
    id: "themes",
    title: "Themes",
    path: "/themes",
    icon: Palette,
    shortcut: "p",
    description: "Explore all themes",
  },
  {
    id: "workbench",
    title: "Workbench",
    path: "/workbench",
    icon: MessageSquare,
    shortcut: "w",
    description: "Create and edit themes",
  },
];

const _THEME_ACTIONS = [
  {
    id: "toggle-mode",
    title: "Toggle Theme Mode",
    shortcut: "m",
    description: "Switch between light and dark mode",
  },
];

interface TinteCommandMenuProps {
  children?: React.ReactNode;
  className?: string;
}

export function TinteCommandMenu({
  children,
  className,
}: TinteCommandMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const router = useRouter();
  const { theme, setTheme, handleThemeSelect, isDark, allThemes, currentMode } =
    useThemeContext();

  const {
    searchResults,
    isSearching,
    searchError,
    searchQuery,
    setSearchQuery,
  } = useThemeSearch();

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  // Custom keyboard shortcuts handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect cmd key by checking metaKey (works on any keyboard layout)
      if (!e.metaKey) return;

      // Check exact key characters for shortcuts
      switch (e.key.toLowerCase()) {
        case "k":
        case "/":
          e.preventDefault();
          setOpen((open) => !open);
          break;
        case "h":
          e.preventDefault();
          router.push("/");
          break;
        case "w":
          e.preventDefault();
          router.push("/workbench");
          break;
        case "m":
          if (e.shiftKey) {
            e.preventDefault();
            setTheme(theme === "dark" ? "light" : "dark");
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router, setTheme, theme]);

  const getThemeIcon = () => {
    return isDark ? Moon : Sun;
  };

  const ThemeIcon = getThemeIcon();

  return (
    <>
      {children || (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "relative w-full max-w-sm justify-start text-sm text-muted-foreground sm:pr-12",
            className,
          )}
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Search actions...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Search themes, actions, or navigate..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isSearching && (
              <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching 13k+ themes...
              </div>
            )}
            {searchError && (
              <div className="p-4 text-sm text-destructive">
                Search failed: {searchError}
              </div>
            )}
            <CommandEmpty>
              {searchQuery.trim() ? "No themes or actions found." : "No results found."}
            </CommandEmpty>

            {/* Navigation */}
            <CommandGroup heading="Navigation">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.description}`}
                    onSelect={() => {
                      runCommand(() => router.push(item.path));
                      setSelectedType("navigation");
                    }}
                    onMouseEnter={() => setSelectedType("navigation")}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                    <CommandShortcut>
                      ⌘{item.shortcut.toUpperCase()}
                    </CommandShortcut>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {/* Theme Actions */}
            <CommandGroup heading="Theme">
              <CommandItem
                value="toggle theme mode light dark"
                onSelect={() => {
                  runCommand(() =>
                    setTheme(theme === "dark" ? "light" : "dark"),
                  );
                  setSelectedType("theme");
                }}
                onMouseEnter={() => setSelectedType("theme")}
              >
                <ThemeIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>Toggle Theme Mode</span>
                  <span className="text-xs text-muted-foreground">
                    Switch between light and dark mode
                  </span>
                </div>
                <CommandShortcut>⌘⇧M</CommandShortcut>
              </CommandItem>
            </CommandGroup>

            {/* Search Results */}
            {searchQuery.trim() && searchResults.length > 0 && (
              <CommandGroup heading={`Search Results (${searchResults.length})`}>
                {searchResults.map((themeData) => (
                  <CommandItem
                    key={themeData.id}
                    value={`${themeData.name} ${themeData.author || ""} ${(themeData.tags || []).join(" ")}`}
                    onSelect={() => {
                      runCommand(() => handleThemeSelect(themeData));
                      setSelectedType("theme-search");
                    }}
                    onMouseEnter={() => setSelectedType("theme-search")}
                    className="flex items-center gap-3 py-3 px-3"
                  >
                    <ThemeColorPreview
                      colors={extractThemeColors(themeData, currentMode)}
                      maxColors={3}
                    />
                    <div className="flex flex-col min-w-0 flex-1 gap-1">
                      <div className="flex items-center gap-2 w-full min-w-0">
                        <span className="text-sm font-medium leading-none truncate">
                          {themeData.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-muted-foreground">
                          Apply {themeData.name.toLowerCase()} theme
                        </span>
                        {themeData.author && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {themeData.author === "tinte" ? (
                              <>
                                <Logo size={14} />
                                <span>Tinte</span>
                              </>
                            ) : themeData.author === "tweakcn" ? (
                              <>
                                <TweakCNIcon className="w-3.5 h-3.5" />
                                <span>TweakCN</span>
                              </>
                            ) : themeData.author === "ray.so" ? (
                              <>
                                <RaycastIcon className="w-3.5 h-3.5" />
                                <span>Ray.so</span>
                              </>
                            ) : themeData.provider === "tinte" && (themeData as any).user?.image ? (
                              <>
                                <Avatar className="w-3.5 h-3.5">
                                  <AvatarImage
                                    src={(themeData as any).user.image}
                                    alt={(themeData as any).user.name || "User"}
                                  />
                                  <AvatarFallback className="text-[8px]">
                                    {((themeData as any).user.name?.[0] || "U").toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span>by {(themeData as any).user.name || "Anonymous"}</span>
                              </>
                            ) : themeData.provider === "tinte" ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>by Anonymous</span>
                              </>
                            ) : (
                              <span>by {themeData.author}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Popular Themes */}
            {!searchQuery.trim() && (
              <CommandGroup heading="Popular Themes">
                {allThemes.slice(0, 6).map((themeData) => (
                  <CommandItem
                    key={themeData.id}
                    value={`${themeData.name} theme ${themeData.author}`}
                    onSelect={() => {
                      runCommand(() => handleThemeSelect(themeData));
                      setSelectedType("theme-select");
                    }}
                    onMouseEnter={() => setSelectedType("theme-select")}
                    className="flex items-center gap-3 py-3 px-3"
                  >
                    <ThemeColorPreview
                      colors={extractThemeColors(themeData, currentMode)}
                      maxColors={3}
                    />
                    <div className="flex flex-col min-w-0 flex-1 gap-1">
                      <div className="flex items-center gap-2 w-full min-w-0">
                        <span className="text-sm font-medium leading-none truncate">{themeData.name}</span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-muted-foreground">
                          Apply {themeData.name.toLowerCase()} theme
                        </span>
                        {themeData.author && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {themeData.author === "tinte" ? (
                              <>
                                <Logo size={14} />
                                <span>Tinte</span>
                              </>
                            ) : themeData.author === "tweakcn" ? (
                              <>
                                <TweakCNIcon className="w-3.5 h-3.5" />
                                <span>TweakCN</span>
                              </>
                            ) : themeData.author === "ray.so" ? (
                              <>
                                <RaycastIcon className="w-3.5 h-3.5" />
                                <span>Ray.so</span>
                              </>
                            ) : themeData.provider === "tinte" && (themeData as any).user?.image ? (
                              <>
                                <Avatar className="w-3.5 h-3.5">
                                  <AvatarImage
                                    src={(themeData as any).user.image}
                                    alt={(themeData as any).user.name || "User"}
                                  />
                                  <AvatarFallback className="text-[8px]">
                                    {((themeData as any).user.name?.[0] || "U").toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span>by {(themeData as any).user.name || "Anonymous"}</span>
                              </>
                            ) : themeData.provider === "tinte" ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>by Anonymous</span>
                              </>
                            ) : (
                              <span>by {themeData.author}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Export Providers */}
            {!searchQuery.trim() && (
              <CommandGroup heading="Export Formats">
                {ALL_PROVIDERS.slice(0, 4).map((provider) => {
                  const Icon = provider.icon;
                  return (
                    <CommandItem
                      key={provider.id}
                      value={`export ${provider.name} format`}
                      onSelect={() => {
                        runCommand(() => {
                          // Navigate to chat with provider focus
                          router.push(`/workbench?provider=${provider.id}`);
                        });
                        setSelectedType("export");
                      }}
                      onMouseEnter={() => setSelectedType("export")}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>Export to {provider.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Convert theme for {provider.name}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>

          {/* Footer */}
          <div className="flex items-center border-t px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono">
                <CornerDownLeft className="h-3 w-3" />
              </kbd>
              {selectedType === "navigation" && "Navigate to page"}
              {selectedType === "theme" && "Apply theme setting"}
              {selectedType === "theme-select" && "Apply theme"}
              {selectedType === "theme-search" && "Apply searched theme"}
              {selectedType === "export" && "Export theme"}
              {!selectedType && "Select action"}
            </div>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <div className="flex items-center gap-1">
              <kbd className="flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono">
                <span className="text-xs">⌘</span>K
              </kbd>
              <span>to open</span>
            </div>
          </div>
        </Command>
      </CommandDialog>
    </>
  );
}
