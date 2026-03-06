import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { buildPublicThemeResponse } from "@/lib/theme-operations/get-by-slug";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    // Get theme by slug - must be public for CLI access
    const themeData = await db
      .select()
      .from(theme)
      .where(eq(theme.slug, slug))
      .limit(1);

    if (themeData.length === 0) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const themeRecord = themeData[0];

    // Only allow public themes for CLI access
    if (!themeRecord.is_public) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const userTheme = buildPublicThemeResponse(themeRecord);

    return NextResponse.json(userTheme, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error fetching theme by slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
