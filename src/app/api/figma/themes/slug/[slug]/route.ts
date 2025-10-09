import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { convertShadcnPaletteToFigma } from "@/lib/figma/color-converter";
import { categorizeTokens } from "@/lib/figma/token-types";
import { convertTinteToShadcn } from "@/lib/providers/shadcn";
import type { TinteTheme } from "@/types/tinte";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    console.log("[Figma API Slug] Fetching theme by slug:", slug);

    const themeData = await db
      .select()
      .from(theme)
      .where(eq(theme.slug, slug))
      .limit(1);

    console.log("[Figma API Slug] Found themes:", themeData.length);

    if (themeData.length === 0) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const themeRecord = themeData[0];

    if (!themeRecord.is_public) {
      return NextResponse.json(
        { error: "Theme is not public" },
        { status: 403 },
      );
    }

    const tinteTheme: TinteTheme = {
      name: themeRecord.name,
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
    };

    const shadcnTheme = convertTinteToShadcn(tinteTheme);

    const lightTokens = categorizeTokens(shadcnTheme.light);
    const darkTokens = categorizeTokens(shadcnTheme.dark);

    const figmaTheme = {
      id: themeRecord.id,
      slug: themeRecord.slug,
      name: themeRecord.name,
      description: themeRecord.concept || `Theme: ${themeRecord.name}`,
      tokens: {
        light: {
          colors: convertShadcnPaletteToFigma(lightTokens.colors),
          numbers: lightTokens.numbers,
        },
        dark: {
          colors: convertShadcnPaletteToFigma(darkTokens.colors),
          numbers: darkTokens.numbers,
        },
      },
    };

    return NextResponse.json(figmaTheme, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching theme for Figma:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
