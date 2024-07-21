import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  formatTheme,
  invertPalette,
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
    (await req.json()) as ThemeConfig & { userId: string };

  try {
    const theme = await prisma.themes.create({
      data: {
        name,
        display_name: displayName,
        category: "user",
        is_public: false,
        User: userId,
        ThemePalettes: {
          create: [
            { mode: "light", ...invertPalette(palette.light) },
            { mode: "dark", ...invertPalette(palette.dark) },
          ],
        },
        TokenColors: {
          create: [invertTokenColors(defaultThemeConfig.tokenColors)],
        },
      },
      include: {
        ThemePalettes: true,
        TokenColors: true,
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
