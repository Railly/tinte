"use client";
import React, { useState, useEffect, useRef } from "react";
import { ColorChangingTitle } from "@/components/color-changing-title";
import { LandingThemeGenerator } from "@/components/landing-theme-generator";
import { ThemePreview } from "@/components/theme-preview";
import { ThemeCards } from "@/components/theme-cards";
import { defaultThemeConfig } from "@/lib/core/config";
import { GeneratedVSCodeTheme, generateVSCodeTheme } from "@/lib/core";
import { ThemeConfig } from "@/lib/core/types";
import { ScrollToTopButton } from "./scroll-to-top";

interface ThemeManagerProps {
  allThemes: ThemeConfig[];
}

export function ThemeManager({ allThemes }: ThemeManagerProps) {
  const defaultTheme = allThemes[0] || defaultThemeConfig;
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultTheme);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme.displayName);
  const [vsCodeTheme, setVSCodeTheme] = useState<GeneratedVSCodeTheme>(
    generateVSCodeTheme(defaultTheme),
  );
  const focusAreaRef = useRef<HTMLDivElement>(null);

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
      />
      <ScrollToTopButton />
    </main>
  );
}
