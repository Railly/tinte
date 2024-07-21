import { useTheme } from "next-themes";
import { DarkLightPalette, ThemeConfig } from "@/lib/core/types";
import { toast } from "sonner";

interface UseThemeCardsLogicProps {
  initialThemes: ThemeConfig[];
  customThemes: Record<string, DarkLightPalette>;
  selectedTheme: string;
  setSelectedTheme: (themeName: string) => void;
  updateThemeConfig: (newConfig: Partial<ThemeConfig>) => void;
  updateCustomThemes: (
    newCustomThemes: Record<string, DarkLightPalette>
  ) => void;
}

export function useThemeCardsLogic({
  initialThemes,
  customThemes,
  selectedTheme,
  setSelectedTheme,
  updateThemeConfig,
  updateCustomThemes,
}: UseThemeCardsLogicProps) {
  const { theme: nextTheme } = useTheme();

  const featuredThemes = initialThemes.filter(
    (theme) => theme.category === "featured"
  );
  const raysoThemes = initialThemes.filter(
    (theme) => theme.category === "rayso"
  );
  const communityThemes = initialThemes.filter(
    (theme) => theme.category === "community"
  );

  const customThemesList = Object.entries(customThemes).map(
    ([name, palette]) => ({
      name: name.toLowerCase().replace(/\s/g, "-"),
      displayName: name,
      palette,
      category: "local",
    })
  ) as ThemeConfig[];

  const allThemes = [...customThemesList, ...initialThemes];

  const handleUseTheme = (theme: ThemeConfig) => {
    setSelectedTheme(theme.displayName);
    updateThemeConfig({
      ...theme,
      name: theme.displayName.toLowerCase().replace(/\s/g, "-"),
    });
  };

  const handleDeleteTheme = (themeName: string) => {
    const updatedCustomThemes = { ...customThemes };
    delete updatedCustomThemes[themeName];
    updateCustomThemes(updatedCustomThemes);

    localStorage.setItem("customThemes", JSON.stringify(updatedCustomThemes));

    if (selectedTheme === themeName) {
      const defaultTheme = initialThemes[0];
      if (defaultTheme) {
        setSelectedTheme(defaultTheme.displayName);
        updateThemeConfig(defaultTheme);
      }
    }

    toast.success(`Local theme "${themeName}" deleted successfully`);
  };

  return {
    nextTheme,
    featuredThemes,
    raysoThemes,
    communityThemes,
    customThemesList,
    allThemes,
    handleUseTheme,
    handleDeleteTheme,
  };
}
