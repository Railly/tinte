import React from "react";
import { ThemeManager } from "@/components/theme-manager";
import { PrismaClient } from "@prisma/client";
import { ThemeConfig } from "@/lib/core/types";
import { formatTheme, sortThemes } from "./utils";
import { LandingHeader } from "@/components/landing-header";

const prisma = new PrismaClient();

async function getThemes() {
  const themes = await prisma.themes.findMany({
    include: {
      ThemePalettes: true,
      TokenColors: true,
    },
  });
  prisma.$disconnect();
  return sortThemes(themes.map(formatTheme) as ThemeConfig[]);
}

export default async function Page() {
  const themes = await getThemes();

  return (
    <>
      <LandingHeader />
      <ThemeManager initialThemes={themes} />
    </>
  );
}
