/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconGrid, IconTinte, IconUser, IconZap } from "@/components/ui/icons";
import { ThemeCard } from "@/components/theme-card";
import { ThemeConfig } from "@/lib/core/types";
import IconRaycast from "@/public/logos/raycast.svg";
import { getThemeCategories, getThemeName } from "@/app/utils";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { EmptyState } from "./empty-state";

interface ThemeCardsProps {
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void;
  allThemes: (ThemeConfig | undefined)[];
  selectedTheme: ThemeConfig;
  setSelectedTheme: (themeConfig: ThemeConfig) => void;
  isTextareaFocused: boolean;
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  isValidating: boolean;
}

export function ThemeCards({
  updateThemeConfig,
  allThemes,
  selectedTheme,
  setSelectedTheme,
  isTextareaFocused,
  currentCategory,
  setCurrentCategory,
  isValidating,
}: ThemeCardsProps) {
  const user = useUser();

  const themeCategories = useMemo(() => {
    return getThemeCategories(allThemes, user.user?.id);
  }, [allThemes, user.user?.id]);

  const handleTabChange = (category: string) => {
    setCurrentCategory(category);
  };

  const handleUseTheme = (theme: ThemeConfig) => {
    setSelectedTheme(theme);
    updateThemeConfig({
      ...theme,
      name: getThemeName(theme.displayName),
    });
  };

  return (
    <section className="w-full mt-4 transition-opacity">
      <div className="flex w-full">
        <div className="w-full">
          <Tabs
            className="w-full"
            value={currentCategory}
            onValueChange={handleTabChange}
          >
            <div className="overflow-x-auto">
              <TabsList
                className="inline-flex w-auto min-w-full"
                variant="underline"
              >
                <TabsTrigger
                  className="space-x-2 whitespace-nowrap"
                  variant="underline"
                  value="all"
                >
                  <IconGrid className="w-4 h-4" />
                  <span>All</span>
                </TabsTrigger>
                <TabsTrigger
                  className="space-x-2 whitespace-nowrap"
                  variant="underline"
                  value="featured"
                >
                  <IconZap className="w-4 h-4" />
                  <span>Featured</span>
                </TabsTrigger>
                <TabsTrigger
                  className="space-x-2 whitespace-nowrap"
                  variant="underline"
                  value="rayso"
                >
                  <IconRaycast className="w-4 h-4" />
                  <span>Ray.so</span>
                </TabsTrigger>
                <TabsTrigger
                  className="space-x-2 whitespace-nowrap"
                  variant="underline"
                  value="community"
                >
                  <IconTinte className="w-4 h-4" />
                  <span>Community</span>
                </TabsTrigger>
                <TabsTrigger
                  className="space-x-2 whitespace-nowrap"
                  variant="underline"
                  value="custom"
                >
                  <SignedIn>
                    <img
                      src={user.user?.imageUrl}
                      className="w-4 h-4 rounded-full"
                      alt="User avatar"
                    />
                  </SignedIn>
                  <SignedOut>
                    <IconUser className="w-4 h-4" />
                  </SignedOut>
                  <span>Your Themes</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent className="w-full" value="all">
              <ThemeCardGrid
                themes={themeCategories.allThemes as ThemeConfig[]}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                isTextareaFocused={isTextareaFocused}
                type="all"
                updateThemeConfig={updateThemeConfig}
                isValidating={isValidating}
              />
            </TabsContent>
            <TabsContent className="w-full" value="featured">
              <ThemeCardGrid
                themes={themeCategories.featuredThemes as ThemeConfig[]}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                isTextareaFocused={isTextareaFocused}
                type="featured"
                isValidating={isValidating}
              />
            </TabsContent>
            <TabsContent className="w-full" value="rayso">
              <ThemeCardGrid
                themes={themeCategories.raysoThemes as ThemeConfig[]}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                isTextareaFocused={isTextareaFocused}
                type="rayso"
                isValidating={isValidating}
              />
            </TabsContent>
            <TabsContent className="w-full" value="community">
              <ThemeCardGrid
                themes={themeCategories.communityThemes as ThemeConfig[]}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                isTextareaFocused={isTextareaFocused}
                type="community"
                isValidating={isValidating}
              />
            </TabsContent>
            <TabsContent className="w-full" value="custom">
              <ThemeCardGrid
                themes={themeCategories.userThemes as ThemeConfig[]}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                isTextareaFocused={isTextareaFocused}
                type="user"
                updateThemeConfig={updateThemeConfig}
                isValidating={isValidating}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

interface ThemeCardGridProps {
  themes: ThemeConfig[];
  selectedTheme: ThemeConfig;
  onUseTheme: (theme: ThemeConfig) => void;
  isTextareaFocused: boolean;
  type: "community" | "user" | "all" | "featured" | "rayso";
  updateThemeConfig?: (newConfig: Partial<ThemeConfig>) => void;
  isValidating: boolean;
}

function ThemeCardGrid({
  themes,
  selectedTheme,
  onUseTheme,
  isTextareaFocused,
  type,
  updateThemeConfig,
  isValidating,
}: ThemeCardGridProps) {
  if (themes.length === 0 && !isValidating) {
    return <EmptyState type={type} />;
  }
  console.log({ selectedTheme, themes });
  return (
    <div className="w-full grid gap-4 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {themes.map((theme, index) => (
        <ThemeCard
          key={index}
          themeConfig={theme}
          themes={themes}
          onUseTheme={() => onUseTheme(theme)}
          isTextareaFocused={isTextareaFocused}
          isSelected={selectedTheme.id === theme?.id}
          updateThemeConfig={updateThemeConfig}
        />
      ))}
    </div>
  );
}
