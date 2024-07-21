import { useState } from "react";
import { ThemeConfig, DarkLightPalette } from "@/lib/core/types";
import { toast } from "sonner";
import { entries } from "@/lib/utils";
import { defaultThemeConfig } from "@/lib/core/config";
import { fetchGeneratedTheme } from "@/app/utils";

export const useThemeGenerator = (
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void,
  customThemes: Record<string, DarkLightPalette>,
  updateCustomThemes: (
    newCustomThemes: Record<string, DarkLightPalette>
  ) => void
) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTheme = async (themeDescription: string) => {
    if (themeDescription.trim().length < 3) {
      toast.error("Please provide a longer theme description");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedTheme = await fetchGeneratedTheme(themeDescription);
      const _entries = entries(generatedTheme);
      if (_entries.length === 0) {
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

  const updateThemeStates = (themeName: string, palette: DarkLightPalette) => {
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
      category: "user",
      tokenColors: defaultThemeConfig.tokenColors,
    });
  };

  return { isGenerating, generateTheme };
};
