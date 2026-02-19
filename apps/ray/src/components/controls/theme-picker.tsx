"use client";

import type { TinteBlock } from "@tinte/core";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCommunityThemes } from "@/hooks/use-community-themes";
import { useVendorThemes } from "@/hooks/use-vendor-themes";
import { DEFAULT_THEME } from "@/data/bundled-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ThemePickerProps {
  value: string;
  onChange: (slug: string) => void;
  onThemeData?: (theme: { light: TinteBlock; dark: TinteBlock }) => void;
  mode: "light" | "dark";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  const isSearching = localSearch.trim().length > 0;
  const anyVendorLoading =
    tinteVendor.loading || raysoVendor.loading || tweakcnVendor.loading;
  const anyVendorHasThemes =
    tinteVendor.themes.length > 0 ||
    raysoVendor.themes.length > 0 ||
    tweakcnVendor.themes.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className="gap-2 text-xs"
      >
        {currentColors.length > 0 && (
          <div className="flex items-center gap-1">
            {currentColors.map((color, i) => (
              <div
                key={i}
                className="size-2.5 rounded-full border border-white/10"
                style={{ background: color }}
              />
            ))}
          </div>
        )}
        <span>{currentName}</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </Button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 z-50 w-72 rounded-lg border bg-popover shadow-lg overflow-hidden">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search 13,000+ themes..."
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-md border bg-muted px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground outline-none"
              ref={(el) => el?.focus()}
            />
          </div>
          <div
            ref={listRef}
            className="max-h-64 overflow-y-auto"
            onScroll={handleScroll}
          >
            {VENDOR_SECTIONS.map(({ vendor, label }, sectionIdx) => {
              const data = vendorData[vendor];
              const filtered = filterThemes(data.themes);
              if (data.loading && !isSearching) {
                return (
                  <div key={vendor}>
                    <SectionHeader label={label} first={sectionIdx === 0} />
                    <div className="px-3 py-2 text-[10px] text-muted-foreground">
                      Loading...
                    </div>
                  </div>
                );
              }
              if (filtered.length === 0) return null;
              return (
                <div key={vendor}>
                  <SectionHeader
                    label={`${label} (${filtered.length})`}
                    first={sectionIdx === 0}
                  />
                  {filtered.map((theme) => {
                    const block = mode === "dark" ? theme.dark : theme.light;
                    return (
                      <ThemeRow
                        key={theme.id}
                        name={theme.name}
                        author={theme.author}
                        colors={colorDots(block)}
                        active={theme.slug === value}
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
                  label={`Community (${community.total.toLocaleString()})`}
                  first={!anyVendorHasThemes && !anyVendorLoading}
                />
                {community.themes.map((theme) => {
                  const block = mode === "dark" ? theme.dark : theme.light;
                  return (
                    <ThemeRow
                      key={theme.id}
                      name={theme.name}
                      author={theme.author}
                      colors={colorDots(block)}
                      active={theme.slug === value}
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
              <div className="px-3 py-3 text-xs text-muted-foreground text-center">
                Loading...
              </div>
            )}

            {!community.loading &&
              community.themes.length === 0 &&
              !anyVendorLoading &&
              !anyVendorHasThemes && (
                <div className="px-3 py-4 text-xs text-muted-foreground text-center">
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
  first = false,
}: { label: string; first?: boolean }) {
  return (
    <div
      className={cn(
        "px-3 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-widest",
        !first && "border-t mt-1",
      )}
    >
      {label}
    </div>
  );
}

function ThemeRow({
  name,
  author,
  colors,
  active,
  onClick,
}: {
  name: string;
  author: string;
  colors: string[];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors text-left",
        active && "bg-accent",
      )}
    >
      <div className="flex items-center gap-1">
        {colors.map((color, i) => (
          <div
            key={i}
            className="size-2.5 rounded-full border border-white/10"
            style={{ background: color }}
          />
        ))}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-foreground font-medium truncate">{name}</span>
        <span className="text-muted-foreground text-[10px] truncate">
          {author}
        </span>
      </div>
    </button>
  );
}
