import React from "react";
import { ThemeManager } from "@/components/theme-manager";
import { LandingHeader } from "@/components/landing-header";
import { getAllThemes } from "@/lib/api";

export default async function Page() {
  const allThemes = await getAllThemes();

  return (
    <>
      <LandingHeader />
      <ThemeManager allThemes={allThemes} />
    </>
  );
}
