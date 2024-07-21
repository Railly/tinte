"use client";
import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconGrid, IconUser, IconUsers, IconZap } from "@/components/ui/icons";
import { ThemeCard } from "@/components/theme-card";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import IconRaycast from "@/public/logos/raycast.svg";
import { toast } from "sonner";
import { getThemeCategories } from "@/app/utils";
import { cn } from "@/lib/utils";

interface ThemeCardsProps {
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void;
  initialThemes: ThemeConfig[];
  customThemes: Record<string, DarkLightPalette>;
  selectedTheme: string;
  setSelectedTheme: (themeName: string) => void;
  updateCustomThemes: (
    newCustomThemes: Record<string, DarkLightPalette>
  ) => void;
  isTextareaFocused: boolean;
}

export function ThemeCards({
  updateThemeConfig,
  initialThemes,
  customThemes,
  selectedTheme,
  setSelectedTheme,
  updateCustomThemes,
  isTextareaFocused,
}: ThemeCardsProps) {
  const themeCategories = useMemo(() => {
    return getThemeCategories(initialThemes, customThemes);
  }, [initialThemes, customThemes]);

  const handleUseTheme = (theme: ThemeConfig) => {
    setSelectedTheme(theme.displayName);
    updateThemeConfig({
      ...theme,
      name: theme.displayName.toLowerCase().replace(/\s/g, "-"),
    });
  };

  const handleDeleteTheme = (themeName: string) => {
    const updatedCustomThemes = { ...customThemes };
    delete updatedCustomThemes[themeName];
    updateCustomThemes(updatedCustomThemes);

    localStorage.setItem("customThemes", JSON.stringify(updatedCustomThemes));

    if (selectedTheme === themeName) {
      const defaultTheme = initialThemes[0];
      if (defaultTheme) {
        setSelectedTheme(defaultTheme.displayName);
        updateThemeConfig(defaultTheme);
      }
    }

    toast.success(`Local theme "${themeName}" deleted successfully`);
  };

  return (
    <section className="w-full mt-4 transition-opacity">
      <div className="flex w-full">
        <div className="flex w-full space-x-4">
          <Tabs className="w-full" defaultValue="all">
            <TabsList variant="underline">
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
                <IconUsers className="w-4 h-4" />
                <span>Community</span>
              </TabsTrigger>
              <TabsTrigger
                className="space-x-2"
                variant="underline"
                value="custom"
              >
                <IconUser className="w-4 h-4" />
                <span>Your Themes</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent className="w-full" value="all">
              <ThemeCardGrid
                themes={themeCategories.allThemes}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                onDeleteTheme={handleDeleteTheme}
                isTextareaFocused={isTextareaFocused}
              />
            </TabsContent>
            <TabsContent className="w-full" value="featured">
              <ThemeCardGrid
                themes={themeCategories.featuredThemes}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                onDeleteTheme={handleDeleteTheme}
                isTextareaFocused={isTextareaFocused}
              />
            </TabsContent>
            <TabsContent className="w-full" value="rayso">
              <ThemeCardGrid
                themes={themeCategories.raysoThemes}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                onDeleteTheme={handleDeleteTheme}
                isTextareaFocused={isTextareaFocused}
              />
            </TabsContent>
            <TabsContent className="w-full" value="community">
              <ThemeCardGrid
                themes={themeCategories.communityThemes}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                onDeleteTheme={handleDeleteTheme}
                isTextareaFocused={isTextareaFocused}
              />
            </TabsContent>
            <TabsContent className="w-full" value="custom">
              <ThemeCardGrid
                themes={themeCategories.customThemesList}
                selectedTheme={selectedTheme}
                onUseTheme={handleUseTheme}
                onDeleteTheme={handleDeleteTheme}
                isTextareaFocused={isTextareaFocused}
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
  onDeleteTheme: (themeName: string) => void;
  isTextareaFocused: boolean;
}

function ThemeCardGrid({
  themes,
  selectedTheme,
  onUseTheme,
  onDeleteTheme,
  isTextareaFocused,
}: ThemeCardGridProps) {
  return (
    <div className="w-full grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
      {themes.map((theme, index) => (
        <ThemeCard
          key={index}
          themeConfig={theme}
          onUseTheme={() => onUseTheme(theme)}
          isTextareaFocused={isTextareaFocused}
          isSelected={selectedTheme === theme.displayName}
          onDeleteTheme={() => onDeleteTheme(theme.displayName)}
        />
      ))}
    </div>
  );
}
