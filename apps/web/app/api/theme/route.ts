import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  formatTheme,
  invertPaletteWithoutId,
  invertTokenColors,
  sortThemes,
} from "@/app/utils";
import { defaultThemeConfig } from "@/lib/core/config";
import { revalidatePath } from "next/cache";
import { ThemeConfig } from "@/lib/core/types";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const themes = await prisma.themes.findMany({
      include: {
        ThemePalettes: true,
        TokenColors: true,
        Users: true,
      },
    });

    const formattedThemes = sortThemes(themes.map(formatTheme));

    return NextResponse.json(formattedThemes);
  } catch (error) {
    console.error("Error fetching themes:", error);
    return NextResponse.json(
      { error: "Failed to fetch themes" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request) => {
  const { name, displayName, palette, userId } =
    (await req.json()) as ThemeConfig & { userId: string | undefined };

  try {
    const themeData: Prisma.ThemesCreateInput = {
      name: name,
      display_name: displayName,
      category: "user",
      is_public: true,
      ThemePalettes: {
        create: [
          { mode: "light", ...invertPaletteWithoutId(palette.light) },
          { mode: "dark", ...invertPaletteWithoutId(palette.dark) },
        ],
      },
      TokenColors: {
        create: [invertTokenColors(defaultThemeConfig.tokenColors)],
      },
    };

    if (userId !== undefined) {
      themeData.Users = {
        connect: { xata_id: userId },
      };
    }

    const theme = await prisma.themes.create({
      data: themeData,
      include: {
        ThemePalettes: true,
        TokenColors: true,
        Users: true,
      },
    });

    revalidatePath("/", "page");

    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error creating theme:", error);
    return NextResponse.json(
      { error: "Failed to create theme" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
