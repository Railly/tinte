"use client";

import type { TinteBlock } from "@tinte/core";
import { Check, ChevronDown, Shuffle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCommunityThemes } from "@/hooks/use-community-themes";
import { useVendorThemes } from "@/hooks/use-vendor-themes";
import { DEFAULT_THEME } from "@/data/bundled-themes";
import { THEME_LOGOS, type LogoComponent } from "@/lib/theme-logos";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ThemePickerProps {
  value: string;
  onChange: (slug: string) => void;
  onThemeData?: (theme: { light: TinteBlock; dark: TinteBlock }) => void;
  mode: "light" | "dark";
}

interface ThemeItem {
  id: string;
  slug: string;
  name: string;
  author: string;
  light: TinteBlock;
  dark: TinteBlock;
  section: string;
}

const VENDOR_SECTIONS = [
  { vendor: "tinte" as const, label: "Tinte" },
  { vendor: "rayso" as const, label: "Ray.so" },
  { vendor: "tweakcn" as const, label: "TweakCN" },
] as const;

export function ThemePicker({
  value,
  onChange,
  onThemeData,
  mode,
}: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [currentName, setCurrentName] = useState("One Hunter");
  const [currentColors, setCurrentColors] = useState<string[]>(() => {
    const d = DEFAULT_THEME.dark;
    return [d.bg, d.pr, d.sc, d.ac_1, d.ac_2];
  });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const community = useCommunityThemes();
  const tinteVendor = useVendorThemes("tinte");
  const raysoVendor = useVendorThemes("rayso");
  const tweakcnVendor = useVendorThemes("tweakcn");

  const vendorData = {
    tinte: tinteVendor,
    rayso: raysoVendor,
    tweakcn: tweakcnVendor,
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (val: string) => {
      setLocalSearch(val);
      community.setSearch(val);
      setFocusedIndex(-1);
    },
    [community.setSearch],
  );

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      community.loadMore();
    }
  }, [community.loadMore]);

  const colorDots = (block: TinteBlock) => {
    return [block.bg, block.pr, block.sc, block.ac_1, block.ac_2];
  };

  const handleSelectTheme = useCallback(
    (slug: string, name: string, light: TinteBlock, dark: TinteBlock) => {
      onChange(slug);
      onThemeData?.({ light, dark });
      setCurrentName(name);
      setCurrentColors(colorDots(mode === "dark" ? dark : light));
      setOpen(false);
      setLocalSearch("");
      handleSearch("");
    },
    [onChange, onThemeData, handleSearch, mode],
  );

  const didSyncInitial = useRef(false);

  useEffect(() => {
    if (didSyncInitial.current || !value || tinteVendor.loading || tinteVendor.themes.length === 0) return;
    const allThemes = [
      ...tinteVendor.themes,
      ...raysoVendor.themes,
      ...tweakcnVendor.themes,
    ];
    const match = allThemes.find((t) => t.slug === value);
    if (match) {
      didSyncInitial.current = true;
      const block = mode === "dark" ? match.dark : match.light;
      setCurrentName(match.name);
      setCurrentColors(colorDots(block));
      onThemeData?.({ light: match.light, dark: match.dark });
    }
  }, [value, tinteVendor.loading, tinteVendor.themes, raysoVendor.themes, tweakcnVendor.themes, mode, onThemeData]);

  const filterThemes = <T extends { name: string; author: string }>(
    themes: T[],
  ): T[] => {
    if (!localSearch) return themes;
    const q = localSearch.toLowerCase();
    return themes.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q),
    );
  };

  const flatThemes = useMemo(() => {
    const items: ThemeItem[] = [];
    for (const { vendor, label } of VENDOR_SECTIONS) {
      const data = vendorData[vendor];
      if (data.loading) continue;
      for (const t of filterThemes(data.themes)) {
        items.push({ ...t, section: label });
      }
    }
    for (const t of community.themes) {
      items.push({ ...t, section: "Community" });
    }
    return items;
  }, [
    tinteVendor.themes,
    tinteVendor.loading,
    raysoVendor.themes,
    raysoVendor.loading,
    tweakcnVendor.themes,
    tweakcnVendor.loading,
    community.themes,
    localSearch,
  ]);

  const handleRandomTheme = useCallback(() => {
    if (flatThemes.length === 0) return;
    const randomIdx = Math.floor(Math.random() * flatThemes.length);
    const theme = flatThemes[randomIdx];
    handleSelectTheme(theme.slug, theme.name, theme.light, theme.dark);
  }, [flatThemes, handleSelectTheme]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setFocusedIndex((i) => Math.min(i + 1, flatThemes.length - 1));
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setFocusedIndex((i) => Math.max(i - 1, 0));
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < flatThemes.length) {
            const theme = flatThemes[focusedIndex];
            handleSelectTheme(theme.slug, theme.name, theme.light, theme.dark);
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setOpen(false);
          break;
        }
      }
    },
    [open, flatThemes, focusedIndex, handleSelectTheme],
  );

  useEffect(() => {
    if (focusedIndex < 0) return;
    const el = listRef.current?.querySelector(`[data-index="${focusedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  const isSearching = localSearch.trim().length > 0;
  const anyVendorLoading =
    tinteVendor.loading || raysoVendor.loading || tweakcnVendor.loading;

  let globalIndex = -1;

  const currentLogo = THEME_LOGOS[value];

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((o) => !o)}
          className="gap-2 text-xs"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {currentLogo ? (
            <span className="size-3.5 flex items-center justify-center">
              {currentLogo({ className: "size-3.5", mode })}
            </span>
          ) : currentColors.length > 0 ? (
            <div className="flex items-center gap-0.5">
              {currentColors.map((color, i) => (
                <div
                  key={`${color}-${i}`}
                  className="size-2.5 rounded-full ring-1 ring-white/10"
                  style={{ background: color }}
                />
              ))}
            </div>
          ) : null}
          <span className="max-w-[100px] truncate">{currentName}</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleRandomTheme}
          title="Random theme"
          className="text-muted-foreground hover:text-foreground"
        >
          <Shuffle className="size-3" />
        </Button>
      </div>

      {open && (
        <div
          className="absolute bottom-full mb-2 left-0 z-50 w-80 rounded-xl border bg-popover shadow-xl overflow-hidden"
          role="listbox"
          aria-label="Theme picker"
        >
          <div className="p-2 border-b flex items-center gap-2">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search 13,000+ themes..."
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setFocusedIndex(-1)}
              className="flex-1 rounded-md border bg-muted px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-ring transition-colors"
              aria-label="Search themes"
              // biome-ignore lint/a11y/noAutofocus: popover needs focus
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleRandomTheme}
              title="Random theme"
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Shuffle className="size-3.5" />
            </Button>
          </div>
          <div
            ref={listRef}
            className="max-h-72 overflow-y-auto"
            onScroll={handleScroll}
          >
            {VENDOR_SECTIONS.map(({ vendor, label }, sectionIdx) => {
              const data = vendorData[vendor];
              const filtered = filterThemes(data.themes);
              if (data.loading && !isSearching) {
                return (
                  <div key={vendor}>
                    <SectionHeader label={label} first={sectionIdx === 0} />
                    <div className="px-3 py-3 text-[10px] text-muted-foreground animate-pulse">
                      Loading...
                    </div>
                  </div>
                );
              }
              if (filtered.length === 0) return null;
              return (
                <div key={vendor}>
                  <SectionHeader
                    label={label}
                    count={filtered.length}
                    first={sectionIdx === 0}
                  />
                  {filtered.map((theme) => {
                    globalIndex++;
                    const block = mode === "dark" ? theme.dark : theme.light;
                    const Logo = THEME_LOGOS[theme.slug];
                    return (
                      <ThemeRow
                        key={theme.id}
                        index={globalIndex}
                        name={theme.name}
                        author={theme.author}
                        colors={colorDots(block)}
                        active={theme.slug === value}
                        focused={globalIndex === focusedIndex}
                        Logo={Logo}
                        mode={mode}
                        onClick={() =>
                          handleSelectTheme(
                            theme.slug,
                            theme.name,
                            theme.light,
                            theme.dark,
                          )
                        }
                      />
                    );
                  })}
                </div>
              );
            })}

            {community.themes.length > 0 && (
              <>
                <SectionHeader
                  label="Community"
                  count={community.total}
                  first={!anyVendorLoading && flatThemes.length === community.themes.length}
                />
                {community.themes.map((theme) => {
                  globalIndex++;
                  const block = mode === "dark" ? theme.dark : theme.light;
                  return (
                    <ThemeRow
                      key={theme.id}
                      index={globalIndex}
                      name={theme.name}
                      author={theme.author}
                      colors={colorDots(block)}
                      active={theme.slug === value}
                      focused={globalIndex === focusedIndex}
                      mode={mode}
                      onClick={() =>
                        handleSelectTheme(
                          theme.slug,
                          theme.name,
                          theme.light,
                          theme.dark,
                        )
                      }
                    />
                  );
                })}
              </>
            )}

            {community.loading && (
              <div className="px-3 py-4 text-xs text-muted-foreground text-center animate-pulse">
                Loading more...
              </div>
            )}

            {!community.loading &&
              community.themes.length === 0 &&
              !anyVendorLoading &&
              flatThemes.length === 0 && (
                <div className="px-3 py-6 text-xs text-muted-foreground text-center">
                  No themes found
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  label,
  count,
  first = false,
}: { label: string; count?: number; first?: boolean }) {
  return (
    <div
      className={cn(
        "px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between sticky top-0 bg-popover/95 backdrop-blur-sm z-10",
        !first && "border-t mt-0.5",
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="tabular-nums font-normal">{count.toLocaleString()}</span>
      )}
    </div>
  );
}

function ThemeRow({
  name,
  author,
  colors,
  active,
  focused,
  Logo,
  mode,
  index,
  onClick,
}: {
  name: string;
  author: string;
  colors: string[];
  active: boolean;
  focused: boolean;
  Logo?: LogoComponent;
  mode: "light" | "dark";
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      data-index={index}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left group",
        "hover:bg-accent/50 focus-visible:bg-accent/50 outline-none",
        active && "bg-accent/80",
        focused && "bg-accent/50",
      )}
    >
      {Logo ? (
        <span className="size-5 flex items-center justify-center shrink-0 rounded bg-muted/50 p-0.5">
          <Logo className="size-3.5" mode={mode} />
        </span>
      ) : (
        <div className="flex items-center gap-[3px] shrink-0">
          {colors.map((color, i) => (
            <div
              key={`${color}-${i}`}
              className="size-2 rounded-full ring-1 ring-foreground/10"
              style={{ background: color }}
            />
          ))}
        </div>
      )}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-foreground font-medium truncate leading-tight">{name}</span>
        <span className="text-muted-foreground text-[10px] truncate leading-tight">
          {author}
        </span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <div
          className="h-4 w-16 rounded-sm overflow-hidden flex opacity-60 group-hover:opacity-100 transition-opacity"
          title={`${name} palette`}
        >
          {colors.map((color, i) => (
            <div
              key={`${color}-${i}`}
              className="flex-1 h-full"
              style={{ background: color }}
            />
          ))}
        </div>
        {active && <Check className="size-3 text-foreground shrink-0" />}
      </div>
    </button>
  );
}
