"use client";
import React, { useState, useEffect, useRef } from "react";
import { ColorChangingTitle } from "@/components/color-changing-title";
import { LandingThemeGenerator } from "@/components/landing-theme-generator";
import { ThemePreview } from "@/components/theme-preview";
import { ThemeCards } from "@/components/theme-cards";
import { defaultThemeConfig } from "@/lib/core/config";
import { GeneratedVSCodeTheme, generateVSCodeTheme } from "@/lib/core";
import { ThemeConfig, DarkLightPalette } from "@/lib/core/types";

interface ThemeManagerProps {
  initialThemes: ThemeConfig[];
}

export function ThemeManager({ initialThemes }: ThemeManagerProps) {
  const defaultTheme = initialThemes[0] || defaultThemeConfig;
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultTheme);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme.displayName);
  const [vscodeTheme, setVSCodeTheme] = useState<GeneratedVSCodeTheme>(
    generateVSCodeTheme(defaultTheme)
  );
  const [customThemes, setCustomThemes] = useState<
    Record<string, DarkLightPalette>
  >({});
  const focusAreaRef = useRef<HTMLElement>(null);

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

  return (
    <main className="flex gap-4 flex-col items-center py-4 px-8">
      <ColorChangingTitle
        themeConfig={themeConfig}
        isTextareaFocused={isTextareaFocused}
      />
      <section
        ref={focusAreaRef}
        className="sticky top-4 bg-background z-20 flex items-center gap-4 justify-center bg-interface rounded-lg custom-shadow"
      >
        <LandingThemeGenerator
          updateThemeConfig={updateThemeConfig}
          customThemes={customThemes}
          updateCustomThemes={updateCustomThemes}
          setIsTextareaFocused={setIsTextareaFocused}
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
        isTextareaFocused={isTextareaFocused}
      />
    </main>
  );
}
