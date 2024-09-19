import React from "react";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { getAllThemes } from "@/lib/api";

export default async function VSCodePage() {
  const allThemes = await getAllThemes();

  return <ThemeCustomizer allThemes={allThemes} />;
}
