"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { themeAtom, Theme } from "@/lib/atoms";
import { useShadcnThemeGenerator } from "@/lib/hooks/use-shadcn-theme-generator";
import { ThemeGeneratorInput } from "./theme-generator-input";
import { useDescriptionEnhancer } from "@/lib/hooks/use-theme-enhancer";
import { toast } from "sonner";
import { ShadcnThemes } from "@prisma/client";

interface ThemeGeneratorProps {
  allThemes: ShadcnThemes[];
}

export function ThemeGenerator({ allThemes }: ThemeGeneratorProps) {
  const [shadcnTheme, setShadcnTheme] = useAtom(themeAtom);
  const [description, setDescription] = useState<string>(
    "A theme inspired by Mistborn, evoking a dark, mysterious, and magical atmosphere. Expect deep grays, silvers, and muted blues with gothic and fantasy elements.",
  );

  const { isGenerating, generateTheme, isSaving } =
    useShadcnThemeGenerator(setShadcnTheme);

  const { isEnhancing, enhanceDescription } = useDescriptionEnhancer();

  const handleGenerateTheme = async () => {
    await generateTheme(description);
  };

  const handleEnhanceDescription = async () => {
    if (description.trim().length < 3) {
      toast.error("Please provide a longer theme description to enhance");
      return;
    }

    const enhancedDescription = await enhanceDescription(description, "shadcn");
    if (enhancedDescription) {
      setDescription(enhancedDescription);
    }
  };

  const getRandomTheme = () => {
    const randomColor = () => ({
      h: Math.floor(Math.random() * 360),
      s: Math.floor(Math.random() * 100),
      l: Math.floor(Math.random() * 100),
      a: 1,
    });

    const newColorScheme = Object.fromEntries(
      Object.keys(shadcnTheme.light).map((key) => [key, randomColor()]),
    ) as Theme["light"];

    const newChartColors = Object.fromEntries(
      Object.keys(shadcnTheme.charts.light).map((key) => [key, randomColor()]),
    ) as Theme["charts"]["light"];

    const newTheme: Theme = {
      id: "default-generated-theme-id",
      name: "generated-theme",
      displayName: "Generated Theme",
      light: newColorScheme,
      dark: newColorScheme,
      fonts: {
        heading: ["Inter", "Roboto", "Open Sans"][
          Math.floor(Math.random() * 3)
        ] as string,
        body: ["Inter", "Roboto", "Open Sans"][
          Math.floor(Math.random() * 3)
        ] as string,
      },
      radius: `${(Math.random() * 2).toFixed(2)}rem`,
      space: `${(Math.random() * 1).toFixed(2)}rem`,
      shadow: `0 ${Math.floor(Math.random() * 10)}px ${Math.floor(Math.random() * 20)}px 0 rgb(0 0 0 / ${Math.random().toFixed(2)})`,
      charts: {
        light: newChartColors,
        dark: newChartColors,
      },
      icons: shadcnTheme.icons,
    };

    setShadcnTheme(newTheme);
  };

  const handleSelectPreset = (preset: Theme) => {
    setShadcnTheme(preset);
  };

  return (
    <ThemeGeneratorInput
      description={description}
      setDescription={setDescription}
      onGenerate={handleGenerateTheme}
      onRandom={getRandomTheme}
      onEnhance={handleEnhanceDescription}
      isGenerating={isGenerating || isSaving}
      isEnhancing={isEnhancing}
      onSelectPreset={handleSelectPreset}
      currentTheme={shadcnTheme}
      allThemes={allThemes}
    />
  );
}
