"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ShineButton } from "@/components/ui/shine-button";
import { IconGenerate, IconLoading, IconSparkles } from "@/components/ui/icons";
import { ThemeConfig, DarkLightPalette } from "@/lib/core/types";
import { toast } from "sonner";
import { entries } from "@/lib/utils";

interface ThemeGeneratorProps {
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void;
  customThemes: Record<string, DarkLightPalette>;
  updateCustomThemes: (
    newCustomThemes: Record<string, DarkLightPalette>
  ) => void;
}

export function ThemeGenerator({
  updateThemeConfig,
  customThemes,
  updateCustomThemes,
}: ThemeGeneratorProps) {
  const [themeDescription, setThemeDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const generateTheme = async () => {
    if (themeDescription.trim().length < 3) {
      toast.error("Please provide a longer theme description");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedTheme = await fetchGeneratedTheme(themeDescription);
      const _entries = entries(generatedTheme);
      if (entries.length === 0) {
        throw new Error("No theme generated");
      }
      const [generatedThemeName, generatedPalette] = _entries[0] as [
        string,
        DarkLightPalette,
      ];

      updateThemeStates(generatedThemeName, generatedPalette);
      toast.success("Theme generated successfully");
    } catch (error) {
      console.error("Error generating theme:", error);
      toast.error("Failed to generate theme");
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchGeneratedTheme = async (
    prompt: string
  ): Promise<Record<string, DarkLightPalette>> => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate theme");
    }

    const { formattedResult } = await response.json();
    if (Object.keys(formattedResult).length === 0) {
      throw new Error("No theme generated");
    }

    return formattedResult;
  };

  const updateThemeStates = (themeName: string, palette: DarkLightPalette) => {
    console.log({ themeName, palette });
    const name = themeName.toLowerCase().replace(/\s/g, "-");
    const newCustomThemes = {
      [themeName]: palette,
      ...customThemes,
    };

    updateCustomThemes(newCustomThemes);
    updateThemeConfig({
      name,
      displayName: themeName,
      palette: palette,
      category: "local",
    });
  };

  const enhanceDescription = async () => {
    if (themeDescription.trim().length < 3) {
      toast.error("Please provide a longer theme description to enhance");
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: themeDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to enhance description");
      }

      const { enhancedPrompt } = await response.json();
      setThemeDescription(enhancedPrompt);
      toast.success("Description enhanced successfully");
    } catch (error) {
      console.error("Error enhancing description:", error);
      toast.error("Failed to enhance description");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex flex-col w-96 border rounded-md shadow-md dark:shadow-foreground/5">
      <div className="flex justify-between items-center p-2 bg-secondary/30 border-b">
        <h2 className="text-sm font-bold">Theme Generator</h2>
        <ShineButton
          variant="default"
          onClick={generateTheme}
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
          className="resize-none w-full !h-[8.5rem] !pb-8"
          minLength={3}
          maxLength={150}
        />
        <Button
          size="sm"
          onClick={enhanceDescription}
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
