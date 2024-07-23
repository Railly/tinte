import React from "react";
import { ThemeManager } from "@/components/theme-manager";
import { PrismaClient } from "@prisma/client";
import { formatTheme, sortThemes } from "./utils";
import { LandingHeader } from "@/components/landing-header";

const prisma = new PrismaClient();

async function getAllThemes() {
  const themes = await prisma.themes.findMany({
    include: {
      ThemePalettes: true,
      TokenColors: true,
      Users: true,
    },
  });
  prisma.$disconnect();
  return sortThemes(themes.map(formatTheme));
}

export default async function Page() {
  const allThemes = await getAllThemes();

  return (
    <>
      <LandingHeader />
      <ThemeManager allThemes={allThemes} />
    </>
  );
}
