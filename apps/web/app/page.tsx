import React from "react";
import { ThemeManager } from "@/components/theme-manager";
import { LandingHeader } from "@/components/landing-header";
import { getInitialThemes } from "@/lib/api";

export default async function Page() {
  const initialThemes = await getInitialThemes();

  return (
    <>
      <LandingHeader />
      <ThemeManager initialThemes={initialThemes} />
    </>
  );
}
