"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ShineButton } from "@/components/ui/shine-button";
import { IconGenerate, IconLoading, IconSparkles } from "@/components/ui/icons";
import { ThemeConfig, DarkLightPalette } from "@/lib/core/types";
import { useThemeGenerator } from "@/lib/hooks/use-theme-generator";
import { useDescriptionEnhancer } from "@/lib/hooks/use-theme-enhancer";

interface LandingThemeGeneratorProps {
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void;
  customThemes: Record<string, DarkLightPalette>;
  updateCustomThemes: (
    newCustomThemes: Record<string, DarkLightPalette>
  ) => void;
  setIsTextareaFocused: (isFocused: boolean) => void;
}

export function LandingThemeGenerator({
  updateThemeConfig,
  customThemes,
  updateCustomThemes,
  setIsTextareaFocused,
}: LandingThemeGeneratorProps) {
  const [themeDescription, setThemeDescription] = useState("");
  const { isGenerating, generateTheme } = useThemeGenerator(
    updateThemeConfig,
    customThemes,
    updateCustomThemes
  );
  const { isEnhancing, enhanceDescription } = useDescriptionEnhancer();

  const handleEnhanceDescription = async () => {
    const enhancedDescription = await enhanceDescription(themeDescription);
    if (enhancedDescription) {
      setThemeDescription(enhancedDescription);
    }
  };

  const handleGenerateTheme = async () => {
    await generateTheme(themeDescription);
  };

  return (
    <div className="flex flex-col w-96 border rounded-md shadow-md dark:shadow-foreground/5">
      <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
        <h2 className="text-sm font-bold">Theme Generator</h2>
        <ShineButton
          variant="default"
          onClick={handleGenerateTheme}
          disabled={isGenerating || themeDescription.trim().length < 3}
        >
          {isGenerating ? (
            <IconLoading className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <IconGenerate className="w-4 h-4 mr-2" />
          )}
          <span>{isGenerating ? "Generating..." : "Generate Theme"}</span>
        </ShineButton>
      </div>
      <div className="relative p-4">
        <Textarea
          placeholder="Describe your ideal theme (e.g., 'A dark theme with neon accents for a cyberpunk feel')"
          value={themeDescription}
          onChange={(e) => setThemeDescription(e.target.value)}
          onFocus={() => setIsTextareaFocused(true)}
          className="resize-none w-full !h-[8.5rem] !pb-8"
          minLength={3}
          maxLength={150}
        />
        <Button
          size="sm"
          onClick={handleEnhanceDescription}
          variant="outline"
          className="absolute bottom-6 left-6 text-muted-foreground hover:text-foreground transition-all duration-200"
          disabled={isEnhancing || themeDescription.trim().length < 3}
        >
          {isEnhancing ? (
            <>
              <IconLoading className="w-4 h-4 mr-1 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <IconSparkles className="w-4 h-4 mr-1" />
              Enhance
            </>
          )}
        </Button>

        <span className="absolute bottom-6 right-6 text-muted-foreground text-sm">
          {themeDescription.length}/150
        </span>
      </div>
    </div>
  );
}
