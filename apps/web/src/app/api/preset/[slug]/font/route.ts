import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { buildFontRegistryItem } from "@/lib/registry";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

const VARIABLE_MAP: Record<
  string,
  "--font-sans" | "--font-serif" | "--font-mono"
> = {
  sans: "--font-sans",
  serif: "--font-serif",
  mono: "--font-mono",
};

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=3600",
  "Access-Control-Allow-Origin": "*",
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const variableParam =
      request.nextUrl.searchParams.get("variable") || "sans";
    const cssVar = VARIABLE_MAP[variableParam] || "--font-sans";

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

    const fonts = record.shadcn_override?.fonts;
    if (!fonts) {
      return NextResponse.json(
        { error: "Theme has no font overrides" },
        { status: 404 },
      );
    }

    const familyKey = variableParam as "sans" | "serif" | "mono";
    const family = fonts[familyKey];
    if (!family) {
      return NextResponse.json(
        { error: `No ${variableParam} font configured for this theme` },
        { status: 404 },
      );
    }

    const registryItem = buildFontRegistryItem(family, cssVar);
    return NextResponse.json(registryItem, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error generating font preset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
