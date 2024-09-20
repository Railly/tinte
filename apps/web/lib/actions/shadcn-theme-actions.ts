"use server";

import { Prisma, PrismaClient, ShadcnThemes } from "@prisma/client";
import { sanitizeJsonInput } from "@/lib/utils";
import { Theme } from "@/lib/atoms";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createTheme(theme: Partial<Theme> & { userId: string }) {
  if (!theme.userId) {
    throw new Error("Unauthorized");
  }

  try {
    const newTheme = await prisma.shadcnThemes.create({
      data: {
        name: theme.name!,
        display_name: theme.displayName,
        User: theme.userId,
        light_scheme: sanitizeJsonInput(theme.light),
        dark_scheme: sanitizeJsonInput(theme.dark),
        //fonts: sanitizeJsonInput(theme.fonts),
        radius: String(theme.radius),
        //space: String(theme.space),
        //shadow: theme.shadow,
        charts: sanitizeJsonInput(theme.charts),
        //icons: theme.icons,
      },
    });

    revalidatePath("/themes");
    return newTheme;
  } catch (error) {
    console.error("Error creating ShadcnTheme:", error);
    throw new Error("Failed to create theme");
  }
}

export async function getThemes(
  page: number = 1,
  limit: number = 20,
  search?: string,
) {
  const where: Prisma.ShadcnThemesWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { display_name: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [themes, total] = await Promise.all([
    prisma.shadcnThemes.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { xata_createdat: "desc" },
    }),
    prisma.shadcnThemes.count({ where }),
  ]);

  return {
    themes,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    },
  };
}

export async function getThemeById(id: string) {
  try {
    const theme = await prisma.shadcnThemes.findUnique({
      where: { xata_id: id },
    });

    if (!theme) {
      throw new Error("Theme not found");
    }

    return theme as ShadcnThemes;
  } catch (error) {
    console.error("Error fetching ShadcnTheme:", error);
    throw new Error("Failed to fetch theme");
  }
}

export async function updateTheme(
  id: string,
  theme: Partial<ShadcnThemes> & { userId: string },
) {
  if (!theme.userId) {
    throw new Error("Unauthorized");
  }

  try {
    const updatedTheme = await prisma.shadcnThemes.update({
      where: { xata_id: id, User: theme.userId },
      data: {
        name: theme.name,
        display_name: theme.display_name,
        light_scheme: sanitizeJsonInput(theme.light_scheme),
        dark_scheme: sanitizeJsonInput(theme.dark_scheme),
        //fonts: sanitizeJsonInput(theme.fonts),
        radius: theme.radius,
        //space: theme.space,
        //shadow: theme.shadow,
        charts: sanitizeJsonInput(theme.charts),
        //icons: theme.icons,
        //theme_version: { increment: 1 },
      },
    });

    revalidatePath("/themes");
    return updatedTheme as ShadcnThemes;
  } catch (error) {
    console.error("Error updating ShadcnTheme:", error);
    throw new Error("Failed to update theme");
  }
}

export async function deleteTheme(id: string, userId: string) {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.shadcnThemes.delete({
      where: { xata_id: id, User: userId },
    });

    revalidatePath("/themes");
    return { message: "Theme deleted successfully" };
  } catch (error) {
    console.error("Error deleting ShadcnTheme:", error);
    throw new Error("Failed to delete theme");
  }
}
