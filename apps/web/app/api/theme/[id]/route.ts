import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ThemeConfig } from "@/lib/core/types";
import { PrismaClient } from "@prisma/client";
import { invertPalette } from "@/app/utils";

const prisma = new PrismaClient();

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { name, displayName, palette, userId } =
    (await req.json()) as ThemeConfig & { userId: string };

  try {
    const theme = await prisma.themes.update({
      where: {
        xata_id: id,
        User: userId,
      },
      data: {
        name,
        display_name: displayName,
        category: "user",
        ThemePalettes: {
          update: [
            {
              where: {
                xata_id: palette.light.id,
                mode: "light",
              },
              data: invertPalette(palette.light),
            },
            {
              where: {
                xata_id: palette.dark.id,
                mode: "dark",
              },
              data: invertPalette(palette.dark),
            },
          ],
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
    console.error("Error updating theme:", error);
    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
