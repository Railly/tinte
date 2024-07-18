import { NextResponse } from "next/server";
import { PrismaClient, TokenColors } from "@prisma/client";
import {
  formatPalette,
  formatTheme,
  formatTokenColors,
  invertTokenColors,
  sortThemes,
} from "@/app/utils.";
import { defaultThemeConfig } from "@/lib/core/config";

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
  const { name, displayName, palette, userId } = await req.json();

  try {
    const theme = await prisma.themes.create({
      data: {
        name,
        display_name: displayName,
        category: "community",
        User: userId,
        ThemePalettes: {
          create: [
            { mode: "light", ...formatPalette(palette.light) },
            { mode: "dark", ...formatPalette(palette.dark) },
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
