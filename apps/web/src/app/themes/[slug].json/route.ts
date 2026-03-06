import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { buildPublicThemeResponse } from "@/lib/theme-operations/get-by-slug";

interface RouteContext {
  params: Promise<Record<string, string | string[] | undefined>>;
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const slugParam = (await context.params).slug;
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

    if (!slug) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }
    const themeData = await db
      .select()
      .from(theme)
      .where(eq(theme.slug, slug))
      .limit(1);

    if (themeData.length === 0 || !themeData[0].is_public) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    return NextResponse.json(buildPublicThemeResponse(themeData[0]), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching theme JSON by slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
