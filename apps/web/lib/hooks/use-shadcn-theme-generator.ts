import { useState } from "react";
import { Theme } from "@/lib/atoms";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { convertShadcnThemeToTheme, getThemeName } from "@/app/utils";

//const normalizeFontName = (font: string): string => {
//  const lowerFont = font.toLowerCase();
//  if (lowerFont.includes("inter")) return "inter";
//  if (lowerFont.includes("roboto")) return "roboto";
//  if (lowerFont.includes("open") && lowerFont.includes("sans"))
//    return "opensans";
//  return lowerFont;
//};

export const fetchGeneratedShadcnTheme = async (
  prompt: string,
): Promise<Theme> => {
  const response = await fetch("/api/generate/shadcn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate theme");
  }

  const { theme } = await response.json();
  if (!theme) {
    throw new Error("No theme generated");
  }

  // Normalize font names
  //theme.fonts.heading = normalizeFontName(theme.fonts.heading);
  //theme.fonts.body = normalizeFontName(theme.fonts.body);

  return theme;
};

export const useShadcnThemeGenerator = (
  updateTheme: (newTheme: Theme) => void,
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const generateTheme = async (themeDescription: string) => {
    if (themeDescription.trim().length < 3) {
      toast.error("Please provide a longer theme description");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedTheme = await fetchGeneratedShadcnTheme(themeDescription);
      toast.success("Theme generated successfully");
      await saveTheme(generatedTheme);

      return generatedTheme;
    } catch (error) {
      console.log({ error });
      toast.error("Error generating theme: " + JSON.stringify(error, null, 2));
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTheme = async (theme: Theme) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/shadcn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...theme,
          name: getThemeName(theme.displayName),
          userId: user ? user.id : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save theme");
      }

      const savedTheme = await response.json();
      updateTheme(convertShadcnThemeToTheme(savedTheme));
      toast.success("Theme saved successfully");
      router.refresh();
      return savedTheme;
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Failed to save theme. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isGenerating,
    generateTheme,
    isSaving,
    saveTheme,
  };
};
