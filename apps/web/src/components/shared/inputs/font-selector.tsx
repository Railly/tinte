"use client";

import { Check, ChevronsUpDown, FunnelX, Loader2 } from "lucide-react";
import * as React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";
import {
  type FilterFontCategory,
  useFontSearch,
} from "@/components/workbench/hooks/fonts/use-font-search";
import { cn } from "@/lib/utils";
import type { FontInfo } from "@tinte/core";
import {
  buildFontFamily,
  FALLBACK_FONTS,
  getDefaultWeights,
  loadGoogleFont,
  waitForFont,
} from "@/utils/fonts";

interface FontSelectorProps {
  value?: string;
  category?: FilterFontCategory;
  onSelect: (font: FontInfo) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FontSelector({
  value,
  category,
  onSelect,
  placeholder = "Search fonts...",
  className,
  style,
}: FontSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] =
    React.useState<FilterFontCategory>(category || "all");
  const [loadingFont, setLoadingFont] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const selectedFontRef = React.useRef<HTMLDivElement>(null);
  const hasScrolledToSelectedFont = React.useRef(false);

  const debouncedSetSearchQuery = useDebouncedCallback(setSearchQuery, 300);

  React.useEffect(() => {
    debouncedSetSearchQuery(inputValue);
  }, [inputValue, debouncedSetSearchQuery]);

  const fontQuery = useFontSearch({
    query: searchQuery,
    category: selectedCategory,
    limit: 15,
    enabled: open,
  });

  // Use fallback fonts from the updated utils
  const fallbackFonts = React.useMemo(() => FALLBACK_FONTS, []);

  React.useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: 0 });
  }, [open]);

  React.useEffect(() => {
    if (open && fontQuery.data && !hasScrolledToSelectedFont.current) {
      requestAnimationFrame(() => {
        selectedFontRef.current?.scrollIntoView({
          block: "center",
          inline: "nearest",
        });
      });
      hasScrolledToSelectedFont.current = true;
    } else if (!open) {
      hasScrolledToSelectedFont.current = false;
    }
  }, [open, fontQuery.data]);

  // Flatten all pages into a single array
  const allFonts = React.useMemo(() => {
    if (!fontQuery.data || fontQuery.error) {
      // Use fallback fonts if API fails
      return fallbackFonts
        .filter((font) => {
          if (selectedCategory === "all") return true;
          return font.category === selectedCategory;
        })
        .filter((font) => {
          if (!searchQuery.trim()) return true;
          return font.family.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }
    return fontQuery.data.pages.flatMap((page) => page.fonts);
  }, [
    fontQuery.data,
    fontQuery.error,
    fallbackFonts,
    selectedCategory,
    searchQuery,
  ]);

  // Intersection Observer ref callback for infinite scroll
  const loadMoreRefCallback = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (
            entry.isIntersecting &&
            fontQuery.hasNextPage &&
            !fontQuery.isFetchingNextPage
          ) {
            fontQuery.fetchNextPage();
          }
        },
        {
          root: scrollRef.current,
          rootMargin: "100px",
          threshold: 0,
        },
      );

      observer.observe(node);
      return () => observer.unobserve(node);
    },
    [
      fontQuery.hasNextPage,
      fontQuery.isFetchingNextPage,
      fontQuery.fetchNextPage,
    ],
  );

  const handleFontSelect = React.useCallback(
    async (font: FontInfo) => {
      setLoadingFont(font.family);

      try {
        const weights = getDefaultWeights(font.variants);
        loadGoogleFont(font.family, weights);
        await waitForFont(font.family, weights[0]);
      } catch (error) {
        console.warn(`Failed to load font ${font.family}:`, error);
      }

      setLoadingFont(null);
      onSelect(font);
      setOpen(false);
    },
    [onSelect],
  );

  // Get current font info for display
  const currentFont = React.useMemo(() => {
    if (!value) return null;

    // First try to find the font in the search results
    const foundFont = allFonts.find((font: FontInfo) => font.family === value);
    if (foundFont) return foundFont;

    // If not found in search results, create a fallback FontInfo object
    // This happens when a font is selected and then the search changes
    const extractedFontName = value.split(",")[0].trim().replace(/['"]/g, "");

    return {
      family: extractedFontName,
      category: category || "sans-serif",
      variants: ["400"],
      variable: false,
    } as FontInfo;
  }, [value, allFonts, category]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="sm"
          className={cn(
            "bg-input/25 w-full justify-between gap-2 md:h-auto md:py-2",
            className,
          )}
          style={style}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {currentFont ? (
              <span
                className="truncate"
                style={{
                  fontFamily: buildFontFamily(
                    currentFont.family,
                    currentFont.category,
                  ),
                }}
              >
                {currentFont.family}
              </span>
            ) : (
              <span className="text-muted-foreground truncate">
                {placeholder}
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 md:h-3 md:w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false} className="h-96 w-full overflow-hidden">
          <div className="flex flex-col">
            <div className="relative">
              <CommandInput
                className="h-10 w-full border-none p-0 pr-10"
                placeholder="Search Google fonts..."
                value={inputValue}
                onValueChange={setInputValue}
              />

              {inputValue && (
                <TooltipWrapper asChild label="Clear search">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputValue("")}
                    className="absolute top-2 right-2 size-6"
                  >
                    <FunnelX className="size-4" />
                  </Button>
                </TooltipWrapper>
              )}
            </div>

            <div className="px-2 py-1">
              <Select
                value={selectedCategory}
                onValueChange={(value) =>
                  setSelectedCategory(value as FilterFontCategory)
                }
              >
                <SelectTrigger className="focus bg-input/25 h-8 px-2 text-xs outline-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fonts</SelectItem>
                  <SelectItem value="sans-serif">Sans Serif Fonts</SelectItem>
                  <SelectItem value="serif">Serif Fonts</SelectItem>
                  <SelectItem value="monospace">Monospace Fonts</SelectItem>
                  <SelectItem value="display">Display Fonts</SelectItem>
                  <SelectItem value="handwriting">Handwriting Fonts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="relative isolate size-full">
            {fontQuery.isLoading && !fontQuery.error ? (
              <div className="absolute inset-0 flex size-full items-center justify-center gap-2 text-center">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  Loading fonts...
                </span>
              </div>
            ) : allFonts.length === 0 ? (
              <CommandEmpty>No fonts found.</CommandEmpty>
            ) : (
              <CommandList
                className="scrollbar-thin size-full p-1"
                ref={scrollRef}
              >
                <CommandGroup>
                  {allFonts.map((font: FontInfo) => {
                    const isSelected = font.family === value;
                    const isLoading = loadingFont === font.family;
                    const fontFamily = buildFontFamily(
                      font.family,
                      font.category,
                    );

                    const handlePreloadOnHover = () => {
                      loadGoogleFont(font.family, ["400"]);
                    };

                    return (
                      <CommandItem
                        key={font.family}
                        className="flex cursor-pointer items-center justify-between gap-2 p-2"
                        onSelect={() => handleFontSelect(font)}
                        disabled={isLoading}
                        onMouseEnter={handlePreloadOnHover}
                        ref={isSelected ? selectedFontRef : null}
                      >
                        <div className="line-clamp-1 inline-flex w-full flex-1 flex-col justify-between">
                          <span
                            className="inline-flex items-center gap-2 truncate"
                            style={{ fontFamily }}
                          >
                            {font.family}
                            {isLoading && (
                              <Loader2 className="size-3 animate-spin" />
                            )}
                          </span>

                          <div className="flex items-center gap-1 text-xs font-normal opacity-70">
                            <span>{font.category}</span>

                            {font.variable && (
                              <span className="inline-flex items-center gap-1">
                                <span>•</span>
                                <span>Variable</span>
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="size-4 shrink-0 opacity-70" />
                        )}
                      </CommandItem>
                    );
                  })}

                  {/* Load more trigger element */}
                  {fontQuery.hasNextPage && (
                    <div ref={loadMoreRefCallback} className="h-2 w-full" />
                  )}

                  {/* Loading indicator for infinite scroll */}
                  {fontQuery.isFetchingNextPage && (
                    <div className="flex items-center justify-center gap-2 p-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-muted-foreground text-sm">
                        Loading more fonts...
                      </span>
                    </div>
                  )}
                </CommandGroup>
              </CommandList>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
