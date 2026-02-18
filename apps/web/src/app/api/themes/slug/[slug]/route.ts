import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";

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

    // Transform to the format expected by the CLI (same as /api/themes/[id])
    const userTheme = {
      id: themeRecord.id,
      slug: themeRecord.slug,
      name: themeRecord.name,
      description: themeRecord.concept || `Theme ${themeRecord.name}`,
      concept: themeRecord.concept,
      author: "Tinte User",
      provider: "tinte" as const,
      downloads: 0,
      likes: 0,
      tags: ["custom"],
      createdAt:
        themeRecord.created_at?.toISOString() || new Date().toISOString(),
      colors: {
        primary: themeRecord.light_pr,
        secondary: themeRecord.light_sc,
        accent: themeRecord.light_ac_1,
        foreground: themeRecord.light_tx,
        background: themeRecord.light_bg,
      },
      rawTheme: {
        light: {
          bg: themeRecord.light_bg,
          bg_2: themeRecord.light_bg_2,
          ui: themeRecord.light_ui,
          ui_2: themeRecord.light_ui_2,
          ui_3: themeRecord.light_ui_3,
          tx: themeRecord.light_tx,
          tx_2: themeRecord.light_tx_2,
          tx_3: themeRecord.light_tx_3,
          pr: themeRecord.light_pr,
          sc: themeRecord.light_sc,
          ac_1: themeRecord.light_ac_1,
          ac_2: themeRecord.light_ac_2,
          ac_3: themeRecord.light_ac_3,
        },
        dark: {
          bg: themeRecord.dark_bg,
          bg_2: themeRecord.dark_bg_2,
          ui: themeRecord.dark_ui,
          ui_2: themeRecord.dark_ui_2,
          ui_3: themeRecord.dark_ui_3,
          tx: themeRecord.dark_tx,
          tx_2: themeRecord.dark_tx_2,
          tx_3: themeRecord.dark_tx_3,
          pr: themeRecord.dark_pr,
          sc: themeRecord.dark_sc,
          ac_1: themeRecord.dark_ac_1,
          ac_2: themeRecord.dark_ac_2,
          ac_3: themeRecord.dark_ac_3,
        },
      },
      overrides: {
        shadcn: themeRecord.shadcn_override,
        vscode: themeRecord.vscode_override,
        shiki: themeRecord.shiki_override,
      },
    };

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
