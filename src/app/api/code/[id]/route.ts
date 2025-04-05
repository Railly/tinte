import { db } from "@/db";
import * as schema from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const theme = await db.query.shadcnThemes.findFirst({
      where: eq(schema.shadcnThemes.id, id),
      with: {
        user: true,
      },
    });

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error fetching ShadcnTheme:", error);
    return NextResponse.json(
      { error: "Failed to fetch theme" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  if (!body.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedTheme = await db
      .update(schema.shadcnThemes)
      .set({
        name: body.name,
        lightThemeColors: body.light_scheme,
        darkThemeColors: body.dark_scheme,
        radius: body.radius,
      })
      .where(
        and(
          eq(schema.shadcnThemes.id, id),
          eq(schema.shadcnThemes.userId, body.userId),
        ),
      )
      .returning();

    return NextResponse.json(updatedTheme[0]);
  } catch (error) {
    console.error("Error updating ShadcnTheme:", error);
    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  if (!body.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db
      .delete(schema.shadcnThemes)
      .where(
        and(
          eq(schema.shadcnThemes.id, id),
          eq(schema.shadcnThemes.userId, body.userId),
        ),
      );

    return NextResponse.json({ message: "Theme deleted successfully" });
  } catch (error) {
    console.error("Error deleting ShadcnTheme:", error);
    return NextResponse.json(
      { error: "Failed to delete theme" },
      { status: 500 },
    );
  }
}
