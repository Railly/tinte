"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { ColorChangingTitle } from "@/components/color-changing-title";
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
  const [selectedTheme, setSelectedTheme] = React.useState(
    defaultTheme.displayName,
  );
  const [vsCodeTheme, setVSCodeTheme] = React.useState<GeneratedVSCodeTheme>(
    generateVSCodeTheme(defaultTheme),
  );
  const [currentCategory, setCurrentCategory] = React.useState("all");
  const focusAreaRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, size, setSize, isValidating } = useInfiniteThemes(
    initialThemes,
    currentCategory,
    user?.id,
  );

  const allThemes = data
    ? data.flatMap((page) => page.themes)
    : initialThemes.themes;
  const hasMore = data ? data[data.length - 1]?.hasMore : initialThemes.hasMore;

  const loadMoreThemes = useCallback(() => {
    if (hasMore && !isValidating) {
      setSize(size + 1);
    }
  }, [hasMore, setSize, size, isValidating]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log({ currentCategory, user });
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
  }, [loadMoreThemes, isValidating, currentCategory]);

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

  const updateThemeConfig = (newConfig: Partial<ThemeConfig>) => {
    const newThemeConfig = { ...themeConfig, ...newConfig };
    setThemeConfig(newThemeConfig);
    setSelectedTheme(newThemeConfig.displayName);
    setVSCodeTheme(generateVSCodeTheme(newThemeConfig));
  };

  const handleCategoryChange = useCallback(
    (newCategory: string) => {
      setCurrentCategory(newCategory);
      setSize(1); // Reset to first page when category changes
    },
    [setSize],
  );

  return (
    <main className="flex gap-4 flex-col items-center py-4 px-4 md:px-8">
      <ColorChangingTitle
        themeConfig={themeConfig}
        isTextareaFocused={isTextareaFocused}
      />
      <section className="w-full md:sticky md:top-4 bg-background z-20 flex flex-col md:flex-row items-center gap-4 justify-center bg-interface rounded-lg custom-shadow">
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
