"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  IconGenerate,
  IconRandom,
  IconSparkles,
  IconHeart,
  IconComputer,
  IconTinte,
} from "@/components/ui/icons";
import { defaultThemeConfig } from "@/lib/core/config";
import { CODE_SAMPLES_SMALL, PRESETS } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { ShineButton } from "@/components/ui/shine-button";
import ReadOnlyPreview from "@/components/read-only-preview";
import { useTheme } from "next-themes";
import { generateVSCodeTheme } from "@/lib/core";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import { ThemeCard } from "@/components/theme-card";
import RHLogoIcon from "@/public/rh-logo.svg";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const words = ["Design", "Visualize", "Share"];

export default function Page(): JSX.Element {
  const [themeDescription, setThemeDescription] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("typescript");
  const defaultPresetName = "One Hunter";
  const featuredTheme = PRESETS[defaultPresetName];

  const themePresets = Object.entries(PRESETS);
  const featuredThemes = themePresets.slice(0, 5);
  const raysoThemes = themePresets.slice(5);

  const { theme: nextTheme } = useTheme();
  const [vscodeTheme, setVSCodeTheme] = useState<any>();

  const showcaseColors = [
    "primary",
    "secondary",
    "accent",
    "accent-2",
    "accent-3",
  ];
  const accentColors = ["accent", "accent-2", "accent-3"];

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    ...defaultThemeConfig,
    displayName: defaultPresetName,
    name: defaultPresetName.toLowerCase().replace(/\s/g, "-"),
    palette: featuredTheme as ThemeConfig["palette"],
  });

  useEffect(() => {
    const newTinteTheme = generateVSCodeTheme(themeConfig);
    setVSCodeTheme(newTinteTheme);
  }, [themeConfig]);

  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % accentColors.length);
    }, 2000); // Change colors every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const [selectedTheme, setSelectedTheme] = useState<string>(defaultPresetName);

  const handleUseTheme = (themeName: string) => {
    setSelectedTheme(themeName);
    // Update the theme configuration
    const newTheme = PRESETS[themeName];
    setThemeConfig({
      ...themeConfig,
      displayName: themeName,
      name: themeName.toLowerCase().replace(/\s/g, "-"),
      palette: newTheme as ThemeConfig["palette"],
    });
  };

  const renderThemeCards = (themes: [string, DarkLightPalette][]) => {
    return themes.map(([name, theme], index) => (
      <ThemeCard
        key={index}
        showcaseColors={showcaseColors}
        featuredTheme={theme}
        nextTheme={nextTheme}
        displayName={name}
        onUseTheme={() => handleUseTheme(name)}
        isSelected={selectedTheme === name}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex h-14 items-center justify-between p-4 bg-background-2 border-b">
        <div className="flex items-center gap-2">
          <a
            className="flex items-center justify-center h-14 border-b"
            href="https://railly.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RHLogoIcon />
          </a>
          {"/"}
          <IconTinte />
          <h1 className="text-md font-bold">tinte</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost">Log in</Button>
          <Button variant="default">Get started</Button>
        </div>
      </header>
      <main className="flex gap-4 flex-col items-center py-4 px-8">
        <h2 className="flex flex-col items-center text-3xl font-bold py-2">
          <span className="flex mr-2">
            {words.map((word, index) => (
              <span key={word} className="flex items-center">
                <motion.span
                  animate={{
                    color:
                      themeConfig.palette[nextTheme][
                        accentColors[(colorIndex + index) % accentColors.length]
                      ],
                  }}
                  transition={{ duration: 1 }}
                >
                  {word}
                </motion.span>
                {index < words.length - 2 && <span className="mx-1">,</span>}
                {index === words.length - 2 && (
                  <span className="mx-1">and</span>
                )}
                {index < words.length - 1 && <span className="mr-1"></span>}
              </span>
            ))}
          </span>
          <span>your VS Code theme</span>
        </h2>
        <section className="flex items-center gap-4 justify-center bg-interface rounded-lg">
          <div className="flex flex-col w-96 border rounded-md">
            <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
              <h2 className="text-sm font-bold">Theme Generator</h2>
              <ShineButton variant="default">
                <IconGenerate className="w-4 h-4 mr-2" />
                <span>Generate Theme</span>
              </ShineButton>
            </div>
            <div className="relative p-4">
              <Textarea
                placeholder="Describe your ideal theme (e.g., 'A dark theme with neon accents for a cyberpunk feel')"
                value={themeDescription}
                onChange={(e) => setThemeDescription(e.target.value)}
                className="resize-none w-full !h-[8.5rem] !pb-8"
                minLength={3}
                maxLength={150}
              />
              <Button
                size="sm"
                onClick={() => {}}
                variant="outline"
                className="absolute bottom-6 left-6 text-muted-foreground hover:text-foreground"
              >
                <IconSparkles className="w-4 h-4 mr-1" />
                Enhance Description
              </Button>
              <span className="absolute bottom-6 right-6 text-muted-foreground text-sm">
                {themeDescription.length}/150
              </span>
            </div>
          </div>
          <div className="w-96 h-full flex border rounded-lg">
            <ReadOnlyPreview
              theme={vscodeTheme}
              code={CODE_SAMPLES_SMALL[selectedLanguage]}
              language={selectedLanguage}
              setLanguage={setSelectedLanguage}
            />
          </div>
        </section>
        <section className="w-full">
          <div className="flex w-full">
            <div className="flex w-full space-x-4">
              <Tabs className="w-full" defaultValue="all">
                <TabsList variant="underline">
                  <TabsTrigger
                    className="space-x-2"
                    variant="underline"
                    value="all"
                  >
                    <IconGenerate className="w-4 h-4" />
                    <span>All</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="space-x-2"
                    variant="underline"
                    value="featured"
                  >
                    <IconRandom className="w-4 h-4" />
                    <span>Featured</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="space-x-2"
                    variant="underline"
                    value="rayso"
                  >
                    <IconRandom className="w-4 h-4" />
                    <span>Ray.so</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent className="w-full" value="all">
                  <div className="w-full grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
                    {renderThemeCards(themePresets)}
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
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
