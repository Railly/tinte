import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { auth } from "@/lib/auth";
import type { TinteTheme } from "@/types/tinte";
import type { ShadcnOverrideSchema } from "@/db/schema/theme";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, tinteTheme, overrides, isPublic = false }: {
      name: string;
      tinteTheme: TinteTheme;
      overrides: {
        shadcn?: ShadcnOverrideSchema;
        vscode?: any;
        shiki?: any;
      };
      isPublic: boolean;
    } = body;

    if (!name || !tinteTheme) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate theme ID
    const themeId = `theme_${session.user.id}_${Date.now()}`;
    const legacyId = `legacy_${Date.now()}`;

    // Create theme record
    const newTheme = await db.insert(theme).values({
      id: themeId,
      legacy_id: legacyId,
      user_id: session.user.id,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),

      // Light mode colors
      light_bg: tinteTheme.light.bg,
      light_bg_2: tinteTheme.light.bg_2,
      light_ui: tinteTheme.light.ui,
      light_ui_2: tinteTheme.light.ui_2,
      light_ui_3: tinteTheme.light.ui_3,
      light_tx: tinteTheme.light.tx,
      light_tx_2: tinteTheme.light.tx_2,
      light_tx_3: tinteTheme.light.tx_3,
      light_pr: tinteTheme.light.pr,
      light_sc: tinteTheme.light.sc,
      light_ac_1: tinteTheme.light.ac_1,
      light_ac_2: tinteTheme.light.ac_2,
      light_ac_3: tinteTheme.light.ac_3,

      // Dark mode colors
      dark_bg: tinteTheme.dark.bg,
      dark_bg_2: tinteTheme.dark.bg_2,
      dark_ui: tinteTheme.dark.ui,
      dark_ui_2: tinteTheme.dark.ui_2,
      dark_ui_3: tinteTheme.dark.ui_3,
      dark_tx: tinteTheme.dark.tx,
      dark_tx_2: tinteTheme.dark.tx_2,
      dark_tx_3: tinteTheme.dark.tx_3,
      dark_pr: tinteTheme.dark.pr,
      dark_sc: tinteTheme.dark.sc,
      dark_ac_1: tinteTheme.dark.ac_1,
      dark_ac_2: tinteTheme.dark.ac_2,
      dark_ac_3: tinteTheme.dark.ac_3,

      is_public: isPublic,

      // Overrides
      shadcn_override: overrides.shadcn || null,
      vscode_override: overrides.vscode || null,
      shiki_override: overrides.shiki || null,

      created_at: new Date(),
      updated_at: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      theme: newTheme[0]
    });

  } catch (error) {
    console.error("Error creating theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get("public") === "true";
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined;

    if (isPublic) {
      // Get public themes - no auth required
      const { UserThemeService } = await import("@/lib/services/user-theme.service");

      if (limit !== undefined && offset !== undefined) {
        const themes = await UserThemeService.getPublicThemes(limit, offset);
        return NextResponse.json(themes);
      } else {
        const themes = await UserThemeService.getAllPublicThemes();
        return NextResponse.json(themes);
      }
    }

    // For non-public themes, require authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { UserThemeService } = await import("@/lib/services/user-theme.service");
    const themes = await UserThemeService.getUserThemes(session.user.id, limit);

    return NextResponse.json(themes);

  } catch (error) {
    console.error("Error fetching themes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}