import { Dispatch, SetStateAction, useState } from "react";
import { ThemeConfig, DarkLightPalette } from "@/lib/core/types";
import { toast } from "sonner";
import { entries } from "@/lib/utils";
import { defaultThemeConfig } from "@/lib/core/config";
import { fetchGeneratedTheme, getThemeName } from "@/app/utils";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const useThemeGenerator = (
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void,
) => {
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const generateTheme = async (
    themeDescription: string,
    type: "shallow" | "deep" = "deep",
  ) => {
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

      const savedTheme = await updateThemeStates(
        generatedThemeName,
        generatedPalette,
        type,
      );
      const successMessage =
        type === "shallow"
          ? "Theme generated successfully"
          : "Theme generated and saved successfully";

      toast.success(successMessage);
      return savedTheme;
    } catch (error) {
      console.error("Error generating theme:", error);
      toast.error("Failed to generate theme");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTheme = async (themeConfig: Partial<ThemeConfig>) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...themeConfig,
          name: getThemeName(themeConfig.displayName),
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save theme");
      }
      const savedTheme = await response.json();
      router.refresh();
      return savedTheme;
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Failed to save theme. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateTheme = async (themeConfig: ThemeConfig) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/theme/${themeConfig.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...themeConfig,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to update theme. Please try again.");
        return;
      }
      toast.success("Theme updated successfully");
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateThemeStates = async (
    themeName: string,
    palette: DarkLightPalette,
    type: "shallow" | "deep",
  ) => {
    const newTheme = {
      palette: palette,
      category: "user",
      tokenColors: defaultThemeConfig.tokenColors,
    } as Partial<ThemeConfig>;

    if (type === "shallow") {
      (updateThemeConfig as Dispatch<SetStateAction<ThemeConfig>>)?.(
        (prev) => ({
          ...prev,
          palette: {
            light: { ...prev.palette.light, ...palette.light },
            dark: { ...prev.palette.dark, ...palette.dark },
          },
        }),
      );
    }

    if (type === "deep") {
      Object.assign(newTheme, {
        name: getThemeName(themeName),
        displayName: themeName,
      });
      const savedTheme = await saveTheme(newTheme);

      if (savedTheme && savedTheme.xata_id) {
        Object.assign(newTheme, { id: savedTheme.xata_id });
      }

      updateThemeConfig(newTheme);
    }

    return newTheme;
  };

  return {
    isGenerating,
    generateTheme,
    isSaving,
    saveTheme,
    updateTheme,
    isUpdating,
  };
};
