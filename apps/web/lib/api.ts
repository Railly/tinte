import { formatTheme, sortThemes } from "@/app/utils";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export async function getAllThemes() {
  const themes = await prisma.themes.findMany({
    where: {
      is_public: true,
    },
    include: {
      ThemePalettes: true,
      TokenColors: true,
      Users: true,
    },
  });

  prisma.$disconnect();
  return sortThemes(themes.map(formatTheme));
}

export async function getThemeById(id: string) {
  const { userId } = auth();

  const theme = await prisma.themes.findUnique({
    where: { xata_id: id },
    include: {
      ThemePalettes: true,
      TokenColors: true,
      Users: true,
    },
  });

  if (!theme || (!theme.is_public && theme.User !== userId)) {
    notFound();
  }

  prisma.$disconnect();
  return formatTheme(theme);
}
