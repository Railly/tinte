import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const theme = await db.query.vsCodeThemes.findFirst({
      where: eq(schema.vsCodeThemes.id, id),
      with: {
        user: true,
      },
    });

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error fetching VSCodeTheme:", error);
    return NextResponse.json(
      { error: "Failed to fetch theme" },
      { status: 500 },
    );
  }
}
