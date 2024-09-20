"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { LandingThemeGenerator } from "@/components/landing-theme-generator";
import { ThemePreview } from "@/components/theme-preview";
import { ThemeCards } from "@/components/theme-cards";
import { defaultThemeConfig } from "@/lib/core/config";
import { GeneratedVSCodeTheme, generateVSCodeTheme } from "@/lib/core";
import { ThemeConfig } from "@/lib/core/types";
import { ScrollToTopButton } from "./scroll-to-top";
import { useInfiniteThemes } from "@/lib/hooks/use-infinite-themes";
import { LoadMoreSkeleton } from "./load-more-skeleton";
import { useUser } from "@clerk/nextjs";
import { DynamicAccentTitle } from "./dynamic-accent-title";

interface ThemeManagerProps {
  initialThemes: {
    themes: ThemeConfig[];
    hasMore: boolean;
  };
}

export function ThemeManager({ initialThemes }: ThemeManagerProps) {
  const { user } = useUser();
  const defaultTheme = initialThemes.themes[0] || defaultThemeConfig;
  const [isTextareaFocused, setIsTextareaFocused] = React.useState(false);
  const [themeConfig, setThemeConfig] =
    React.useState<ThemeConfig>(defaultTheme);
  const [selectedTheme, setSelectedTheme] = React.useState(defaultTheme);
  const [vsCodeTheme, setVSCodeTheme] = React.useState<GeneratedVSCodeTheme>(
    generateVSCodeTheme(defaultTheme),
  );
  const [currentCategory, setCurrentCategory] = React.useState("all");
  const focusAreaRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, size, setSize, isValidating, refreshFirstPage } =
    useInfiniteThemes(initialThemes, currentCategory, user?.id);

  const allThemes = data
    ? data.flatMap((page) => page.themes)
    : initialThemes.themes;
  const hasMore = data ? data[data.length - 1]?.hasMore : initialThemes.hasMore;

  const loadMoreThemes = useCallback(() => {
    if (hasMore && !isValidating) {
      setSize(size + 1);
    }
  }, [hasMore, setSize, size, isValidating]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (currentCategory === "custom" && !user) return;
        if (entries[0]?.isIntersecting && !isValidating) {
          loadMoreThemes();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreThemes, isValidating, currentCategory, user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        focusAreaRef.current &&
        !focusAreaRef.current.contains(event.target as Node)
      ) {
        setIsTextareaFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateThemeConfig = useCallback(
    (newConfig: Partial<ThemeConfig>) => {
      const newThemeConfig = { ...themeConfig, ...newConfig };
      setThemeConfig(newThemeConfig);
      setSelectedTheme(newThemeConfig);
      setVSCodeTheme(generateVSCodeTheme(newThemeConfig));

      // Only refresh the first page if it's a new theme
      if (
        newConfig.id &&
        !allThemes.some((theme) => theme.id === newConfig.id)
      ) {
        refreshFirstPage();
      }
    },
    [themeConfig, allThemes, refreshFirstPage],
  );

  const handleCategoryChange = useCallback(
    (newCategory: string) => {
      setCurrentCategory(newCategory);
      setSize(1); // Reset to first page when category changes
    },
    [setSize],
  );

  return (
    <main className="flex gap-4 flex-col items-center py-4 px-4 md:px-8">
      <DynamicAccentTitle
        theme={themeConfig}
        isTextareaFocused={isTextareaFocused}
        words={["Design", "Visualize", "Share"]}
        accentColors={["accent", "accent-2", "accent-3"]}
        intervalDuration={2000}
        subtitle="your VS Code theme"
      />
      <section className="w-full md:sticky md:top-[4rem] bg-background z-20 flex flex-col md:flex-row items-center gap-4 justify-center bg-interface rounded-lg custom-shadow">
        <LandingThemeGenerator
          ref={focusAreaRef}
          updateThemeConfig={updateThemeConfig}
          setIsTextareaFocused={setIsTextareaFocused}
        />
        <ThemePreview
          vsCodeTheme={vsCodeTheme}
          themeConfig={themeConfig}
          withEditButton
        />
      </section>
      <ThemeCards
        updateThemeConfig={updateThemeConfig}
        allThemes={allThemes}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        isTextareaFocused={isTextareaFocused}
        currentCategory={currentCategory}
        setCurrentCategory={handleCategoryChange}
        isValidating={isValidating}
      />
      {hasMore && (
        <div ref={loadMoreRef} className="w-full py-4">
          {isValidating ? (
            <LoadMoreSkeleton />
          ) : (
            <div className="text-center">
              <span className="text-muted-foreground">Scroll to load more</span>
            </div>
          )}
        </div>
      )}
      <ScrollToTopButton />
    </main>
  );
}
