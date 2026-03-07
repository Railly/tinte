import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { buildRegistryItem } from "@/lib/registry";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    let themeData = await db
      .select()
      .from(theme)
      .where(eq(theme.slug, slug))
      .limit(1);

    if (themeData.length === 0) {
      themeData = await db
        .select()
        .from(theme)
        .where(eq(theme.id, slug))
        .limit(1);
    }

    if (themeData.length === 0) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const record = themeData[0];
    if (!record.is_public) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const registryItem = buildRegistryItem(record, "registry:base");

    return NextResponse.json(registryItem, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error generating preset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
