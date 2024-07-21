import React from "react";
import { PrismaClient } from "@prisma/client";
import { formatTheme, sortThemes } from "../utils";
import { ThemeCustomizer } from "@/components/theme-customizer";

const prisma = new PrismaClient();

async function getAllThemes() {
  const themes = await prisma.themes.findMany({
    include: {
      ThemePalettes: true,
      TokenColors: true,
    },
  });
  prisma.$disconnect();
  return sortThemes(themes.map(formatTheme));
}

export default async function Page() {
  const allThemes = await getAllThemes();

  return <ThemeCustomizer allThemes={allThemes} />;
}
