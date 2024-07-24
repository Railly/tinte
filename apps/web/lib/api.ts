import { formatTheme, isThemeOwner, sortThemes } from "@/app/utils";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export async function getAllThemes() {
  const { userId } = auth();

  let whereClause = {};

  if (userId) {
    whereClause = {
      OR: [
        {
          is_public: true,
        },
        {
          User: userId,
        },
      ],
    };
  } else {
    whereClause = {
      is_public: true,
    };
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

  if (!theme) {
    notFound();
  }

  const formattedTheme = formatTheme(theme);

  if (!theme.is_public && !isThemeOwner(userId, formattedTheme)) {
    notFound();
  }

  prisma.$disconnect();
  return formatTheme(theme);
}

export async function getUnprotectedThemeById(id: string) {
  const theme = await prisma.themes.findUnique({
    where: { xata_id: id },
    include: {
      ThemePalettes: true,
      TokenColors: true,
      Users: true,
    },
  });

  if (!theme) {
    notFound();
  }

  prisma.$disconnect();
  return formatTheme(theme);
}
