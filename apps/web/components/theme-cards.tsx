"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconEdit,
  IconGrid,
  IconSpace,
  IconUsers,
  IconZap,
} from "@/components/ui/icons";
import { ThemeCard } from "@/components/theme-card";
import { useTheme } from "next-themes";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import IconRaycast from "@/public/logos/raycast.svg";
import { toast } from "sonner";

interface ThemeCardsProps {
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void;
  initialThemes: ThemeConfig[];
  customThemes: Record<string, DarkLightPalette>;
  selectedTheme: string;
  setSelectedTheme: (themeName: string) => void;
  updateCustomThemes: (
    newCustomThemes: Record<string, DarkLightPalette>
  ) => void;
}

export function ThemeCards({
  updateThemeConfig,
  initialThemes,
  customThemes,
  selectedTheme,
  setSelectedTheme,
  updateCustomThemes,
}: ThemeCardsProps) {
  const { theme: nextTheme } = useTheme();

  const featuredThemes = initialThemes.filter(
    (theme) => theme.category === "featured"
  );
  const raysoThemes = initialThemes.filter(
    (theme) => theme.category === "rayso"
  );

  const communityThemes = initialThemes.filter(
    (theme) => theme.category === "community"
  );

  const customThemesList = Object.entries(customThemes).map(
    ([name, palette]) => ({
      name,
      displayName: name,
      palette,
      category: "local",
    })
  ) as ThemeConfig[];

  const allThemes = [...customThemesList, ...initialThemes];

  const showcaseColors = [
    "primary",
    "secondary",
    "accent",
    "accent-2",
    "accent-3",
  ];

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

    // Update state
    updateCustomThemes(updatedCustomThemes);

    // Update localStorage
    localStorage.setItem("customThemes", JSON.stringify(updatedCustomThemes));

    // If the deleted theme was selected, select a default theme
    if (selectedTheme === themeName) {
      const defaultTheme = initialThemes[0];
      if (defaultTheme) {
        setSelectedTheme(defaultTheme.displayName);
        updateThemeConfig(defaultTheme);
      }
    }

    toast.success(`Local theme "${themeName}" deleted successfully`);
  };

  const renderThemeCards = (themes: ThemeConfig[]) => {
    return themes.map((theme, index) => (
      <ThemeCard
        key={index}
        showcaseColors={showcaseColors}
        featuredTheme={theme.palette}
        nextTheme={nextTheme}
        displayName={theme.displayName}
        category={theme.category}
        onUseTheme={() => handleUseTheme(theme)}
        isSelected={selectedTheme === theme.displayName}
        onDeleteTheme={() => handleDeleteTheme(theme.displayName)}
      />
    ));
  };
  console.log({ communityThemes });

  return (
    <section className="w-full mt-4">
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
                <IconEdit className="w-4 h-4" />
                <span>Local</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent className="w-full" value="all">
              <div className="w-full grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
                {renderThemeCards(allThemes)}
              </div>
            </TabsContent>
            <TabsContent className="w-full" value="featured">
              <div className="w-full grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
                {renderThemeCards(featuredThemes)}
              </div>
            </TabsContent>
            <TabsContent className="w-full" value="rayso">
              <div className="w-full grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
                {renderThemeCards(raysoThemes)}
              </div>
            </TabsContent>
            <TabsContent className="w-full" value="community">
              <div className="w-full grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
                {renderThemeCards(communityThemes)}
              </div>
            </TabsContent>
            <TabsContent className="w-full" value="custom">
              <div className="w-full grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
                {renderThemeCards(customThemesList)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
