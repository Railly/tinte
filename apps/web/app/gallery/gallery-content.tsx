"use client";
import { ThemeCards } from "@/components/theme-cards";
import { ThemeConfig } from "@/lib/core/types";
import { useState } from "react";

export function GalleryContent({ allThemes }: { allThemes: ThemeConfig[] }) {
  const [selectedTheme, setSelectedTheme] = useState<string>("");

  const handleUseTheme = (theme: ThemeConfig) => {
    setSelectedTheme(theme.displayName);
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
    />
  );
}
