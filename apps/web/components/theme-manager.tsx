"use client";
import React, { useState, useEffect } from "react";
import { ColorChangingTitle } from "@/components/color-changing-title";
import { ThemeGenerator } from "@/components/theme-generator";
import { ThemePreview } from "@/components/theme-preview";
import { ThemeCards } from "@/components/theme-cards";
import { defaultThemeConfig } from "@/lib/core/config";
import { generateVSCodeTheme } from "@/lib/core";
import { ThemeConfig, DarkLightPalette } from "@/lib/core/types";

interface ThemeManagerProps {
  initialThemes: ThemeConfig[];
}

export function ThemeManager({ initialThemes }: ThemeManagerProps) {
  const defaultTheme = initialThemes[0] || defaultThemeConfig;

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultTheme);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme.displayName);
  const [vscodeTheme, setVSCodeTheme] = useState<any>(
    generateVSCodeTheme(defaultTheme)
  );
  const [customThemes, setCustomThemes] = useState<
    Record<string, DarkLightPalette>
  >({});

  useEffect(() => {
    const customThemesRaw = window.localStorage.getItem("customThemes") || "{}";
    const customThemesJSON = JSON.parse(customThemesRaw);
    setCustomThemes(customThemesJSON);
  }, []);

  const updateThemeConfig = (newConfig: Partial<ThemeConfig>) => {
    const newThemeConfig = { ...themeConfig, ...newConfig };
    setThemeConfig(newThemeConfig);
    setSelectedTheme(newThemeConfig.displayName);
    setVSCodeTheme(generateVSCodeTheme(newThemeConfig));
  };

  const updateCustomThemes = (
    newCustomThemes: Record<string, DarkLightPalette>
  ) => {
    setCustomThemes(newCustomThemes);
    window.localStorage.setItem(
      "customThemes",
      JSON.stringify(newCustomThemes)
    );
  };

  console.log({ selectedTheme });

  return (
    <main className="flex gap-4 flex-col items-center py-4 px-8">
      <ColorChangingTitle themeConfig={themeConfig} />
      <section className="sticky top-4 bg-background z-20 flex items-center gap-4 justify-center bg-interface rounded-lg custom-shadow">
        <ThemeGenerator
          updateThemeConfig={updateThemeConfig}
          customThemes={customThemes}
          updateCustomThemes={updateCustomThemes}
        />
        <ThemePreview vscodeTheme={vscodeTheme} />
      </section>
      <ThemeCards
        updateThemeConfig={updateThemeConfig}
        initialThemes={initialThemes}
        customThemes={customThemes}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        updateCustomThemes={updateCustomThemes}
      />
    </main>
  );
}
