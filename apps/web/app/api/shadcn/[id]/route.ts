import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ShadcnThemes } from "@prisma/client";
import { sanitizeJsonInput } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const theme = await prisma.shadcnThemes.findUnique({
      where: { xata_id: id },
    });

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json(theme as ShadcnThemes);
  } catch (error) {
    console.error("Error fetching ShadcnTheme:", error);
    return NextResponse.json(
      { error: "Failed to fetch theme" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const body = (await req.json()) as Partial<ShadcnThemes> & { userId: string };

  if (!body.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedTheme = await prisma.shadcnThemes.update({
      where: { xata_id: id, User: body.userId },
      data: {
        name: body.name,
        display_name: body.display_name,
        light_scheme: sanitizeJsonInput(body.light_scheme),
        dark_scheme: sanitizeJsonInput(body.dark_scheme),
        fonts: sanitizeJsonInput(body.fonts),
        radius: body.radius,
        space: body.space,
        shadow: body.shadow,
        charts: sanitizeJsonInput(body.charts),
        icons: body.icons,
        theme_version: { increment: 1 },
      },
    });

    return NextResponse.json(updatedTheme as ShadcnThemes);
  } catch (error) {
    console.error("Error updating ShadcnTheme:", error);
    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const { userId } = (await req.json()) as { userId: string };

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.shadcnThemes.delete({
      where: { xata_id: id, User: userId },
    });

    return NextResponse.json({ message: "Theme deleted successfully" });
  } catch (error) {
    console.error("Error deleting ShadcnTheme:", error);
    return NextResponse.json(
      { error: "Failed to delete theme" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
