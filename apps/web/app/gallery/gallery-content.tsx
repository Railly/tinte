"use client";
import { ThemeCards } from "@/components/theme-cards";
import { ThemeConfig } from "@/lib/core/types";
import { useState } from "react";

export function GalleryContent({ allThemes }: { allThemes: ThemeConfig[] }) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(
    allThemes[0] as ThemeConfig
  );

  const handleUseTheme = (theme: ThemeConfig) => {
    setSelectedTheme(theme);
    // You might want to add additional logic here, such as redirecting to the editor
    // or showing a preview of the selected theme
  };

  return (
    <ThemeCards
      updateThemeConfig={() => {}} // This is a no-op in the gallery view
      allThemes={allThemes}
      selectedTheme={selectedTheme}
      setSelectedTheme={setSelectedTheme}
      isTextareaFocused={false} // This is always false in the gallery view
      currentCategory="all" // This is always "all" in the gallery view
      setCurrentCategory={() => {}} // This is a no-op in the gallery view
      isValidating={false} // This is always false in the gallery view
    />
  );
}
