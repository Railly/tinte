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
  allThemes: ThemeConfig[];
  selectedTheme: string;
  setSelectedTheme: (themeName: string) => void;
  isTextareaFocused: boolean;
}

export function ThemeCards({
  updateThemeConfig,
  allThemes,
  selectedTheme,
  setSelectedTheme,
  isTextareaFocused,
}: ThemeCardsProps) {
  const user = useUser();
  const themeCategories = useMemo(() => {
    return getThemeCategories(allThemes, user.user?.id);
  }, [allThemes]);

  const handleUseTheme = (theme: ThemeConfig) => {
    setSelectedTheme(theme.displayName);
    updateThemeConfig({
      ...theme,
      name: getThemeName(theme.displayName),
    });
  };

  return (
    <section className="w-full mt-4 transition-opacity">
      <div className="flex w-full">
        <div className="flex w-full space-x-4">
          <Tabs className="w-full" defaultValue="all">
            <TabsList
              className="max-w-full overflow-scroll"
              variant="underline"
            >
              <TabsTrigger
                className="space-x-2"
                variant="underline"
                value="all"
              >
                <IconGrid className="w-4 h-4" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger
                className="space-x-2"
                variant="underline"
                value="featured"
              >
                <IconZap className="w-4 h-4" />
                <span>Featured</span>
              </TabsTrigger>
              <TabsTrigger
                className="space-x-2"
                variant="underline"
                value="rayso"
              >
                <IconRaycast className="w-4 h-4" />
                <span>Ray.so</span>
              </TabsTrigger>
              <TabsTrigger
                className="space-x-2"
                variant="underline"
                value="community"
              >
                <IconTinte className="w-4 h-4" />
                <span>Community</span>
              </TabsTrigger>
              <TabsTrigger
                className="space-x-2"
                variant="underline"
                value="custom"
              >
                <SignedIn>
                  <img
                    src={user.user?.imageUrl}
                    className="w-4 h-4 rounded-full"
                  />
                </SignedIn>
                <SignedOut>
                  <IconUser className="w-4 h-4" />
                </SignedOut>
                <span>Your Themes</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent className="w-full" value="all">
              <ThemeCardGrid
                themes={themeCategories.allThemes}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                isTextareaFocused={isTextareaFocused}
                type="all"
              />
            </TabsContent>
            <TabsContent className="w-full" value="featured">
              <ThemeCardGrid
                themes={themeCategories.featuredThemes}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                isTextareaFocused={isTextareaFocused}
                type="featured"
              />
            </TabsContent>
            <TabsContent className="w-full" value="rayso">
              <ThemeCardGrid
                themes={themeCategories.raysoThemes}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                isTextareaFocused={isTextareaFocused}
                type="rayso"
              />
            </TabsContent>
            <TabsContent className="w-full" value="community">
              <ThemeCardGrid
                themes={themeCategories.communityThemes}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                isTextareaFocused={isTextareaFocused}
                type="community"
              />
            </TabsContent>
            <TabsContent className="w-full" value="custom">
              <ThemeCardGrid
                themes={themeCategories.userThemes}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                isTextareaFocused={isTextareaFocused}
                type="user"
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
  selectedTheme: string;
  onUseTheme: (theme: ThemeConfig) => void;
  isTextareaFocused: boolean;
  type: "community" | "user" | "all" | "featured" | "rayso";
}

function ThemeCardGrid({
  themes,
  selectedTheme,
  onUseTheme,
  isTextareaFocused,
  type,
}: ThemeCardGridProps) {
  if (themes.length === 0) {
    return <EmptyState type={type} />;
  }
  return (
    <div className="w-full grid gap-4 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {themes.map((theme, index) => (
        <ThemeCard
          key={index}
          themeConfig={theme}
          onUseTheme={() => onUseTheme(theme)}
          isTextareaFocused={isTextareaFocused}
          isSelected={selectedTheme === theme.displayName}
        />
      ))}
    </div>
  );
}
