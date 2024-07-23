import React from "react";
import { PrismaClient } from "@prisma/client";
import { formatTheme, sortThemes } from "../utils";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

async function getAllThemes() {
  const { userId } = auth();

  let whereClause = {};

  if (userId) {
    whereClause = {
      OR: [{ is_public: true }, { User: userId }],
    };
  } else {
    whereClause = { is_public: true };
  }

  const themes = await prisma.themes.findMany({
    where: whereClause,
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

  return <ThemeCustomizer allThemes={allThemes} />;
}
