import { formatTheme, isThemeOwner, sortThemes } from "@/app/utils";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export async function getInitialThemes(
  page = 1,
  limit = 20,
  category?: string,
  userId?: string,
) {
  let whereClause: any = {};

  if (category === "all" || !category) {
    whereClause = userId
      ? { OR: [{ is_public: true }, { User: userId }] }
      : { is_public: true };
  } else if (category === "custom") {
    whereClause = userId ? { User: userId } : { id: "none" };
  } else if (category === "community") {
    whereClause = {
      is_public: true,
      category: "user",
      ...(userId && { NOT: { User: userId } }),
    };
  } else {
    whereClause = {
      category,
      ...(userId
        ? { OR: [{ is_public: true }, { User: userId }] }
        : { is_public: true }),
    };
  }

  const themes = await prisma.themes.findMany({
    where: whereClause,
    include: {
      ThemePalettes: true,
      TokenColors: true,
      Users: true,
    },
    orderBy: { xata_createdat: "desc" },
    skip: (page - 1) * limit,
    take: limit + 1,
  });

  const hasMore = themes.length > limit;
  const themesToReturn = themes.slice(0, limit);

  prisma.$disconnect();

  return {
    themes: themesToReturn.map(formatTheme),
    hasMore,
  };
}

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
