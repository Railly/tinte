"use client";

import type { TinteBlock } from "@tinte/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCommunityThemes } from "@/hooks/use-community-themes";
import { useVendorThemes } from "@/hooks/use-vendor-themes";

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
  const [currentColors, setCurrentColors] = useState<string[]>([]);
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
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--accent)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] hover:border-[var(--muted-foreground)] transition-colors"
      >
        {currentColors.length > 0 && (
          <div className="flex items-center gap-1">
            {currentColors.map((color, i) => (
              <div
                key={i}
                style={{
                  background: color,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
        )}
        <span>{currentName}</span>
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 z-50 w-72 bg-[var(--accent)] border border-[var(--border)] rounded-lg shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-[var(--border)]">
            <input
              type="text"
              placeholder="Search 13,000+ themes..."
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-[var(--muted)] border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none"
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
                    <div className="px-3 py-2 text-[10px] text-[var(--muted-foreground)]">
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
              <div className="px-3 py-3 text-xs text-[var(--muted-foreground)] text-center">
                Loading...
              </div>
            )}

            {!community.loading &&
              community.themes.length === 0 &&
              !anyVendorLoading &&
              !anyVendorHasThemes && (
                <div className="px-3 py-4 text-xs text-[var(--muted-foreground)] text-center">
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
      className={`px-3 py-1.5 text-[10px] font-medium text-[var(--muted-foreground)] uppercase tracking-widest ${
        first ? "" : "border-t border-[var(--border)] mt-1"
      }`}
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
      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--muted)] transition-colors text-left ${
        active ? "bg-[var(--muted)]" : ""
      }`}
    >
      <div className="flex items-center gap-1">
        {colors.map((color, i) => (
          <div
            key={i}
            style={{
              background: color,
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[var(--foreground)] font-medium truncate">
          {name}
        </span>
        <span className="text-[var(--muted-foreground)] text-[10px] truncate">
          {author}
        </span>
      </div>
    </button>
  );
}
