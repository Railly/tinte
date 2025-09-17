import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import type { TinteTheme } from "@/types/tinte";
import type { ShadcnOverrideSchema } from "@/db/schema/theme";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      tinteTheme,
      overrides,
      isPublic,
    }: {
      name?: string;
      tinteTheme?: TinteTheme;
      overrides?: {
        shadcn?: ShadcnOverrideSchema;
        vscode?: any;
        shiki?: any;
      };
      isPublic?: boolean;
    } = body;

    // Check if theme exists and belongs to user
    const { id } = await context.params;
    const existingTheme = await db
      .select()
      .from(theme)
      .where(and(eq(theme.id, id), eq(theme.user_id, session.user.id)))
      .limit(1);

    if (existingTheme.length === 0) {
      return NextResponse.json(
        { error: "Theme not found or unauthorized" },
        { status: 404 }
      );
    }

    // Build update object
    const updates: any = {
      updated_at: new Date(),
    };

    if (name) {
      updates.name = name;
      updates.slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    if (tinteTheme) {
      // Light mode colors
      updates.light_bg = tinteTheme.light.bg;
      updates.light_bg_2 = tinteTheme.light.bg_2;
      updates.light_ui = tinteTheme.light.ui;
      updates.light_ui_2 = tinteTheme.light.ui_2;
      updates.light_ui_3 = tinteTheme.light.ui_3;
      updates.light_tx = tinteTheme.light.tx;
      updates.light_tx_2 = tinteTheme.light.tx_2;
      updates.light_tx_3 = tinteTheme.light.tx_3;
      updates.light_pr = tinteTheme.light.pr;
      updates.light_sc = tinteTheme.light.sc;
      updates.light_ac_1 = tinteTheme.light.ac_1;
      updates.light_ac_2 = tinteTheme.light.ac_2;
      updates.light_ac_3 = tinteTheme.light.ac_3;

      // Dark mode colors
      updates.dark_bg = tinteTheme.dark.bg;
      updates.dark_bg_2 = tinteTheme.dark.bg_2;
      updates.dark_ui = tinteTheme.dark.ui;
      updates.dark_ui_2 = tinteTheme.dark.ui_2;
      updates.dark_ui_3 = tinteTheme.dark.ui_3;
      updates.dark_tx = tinteTheme.dark.tx;
      updates.dark_tx_2 = tinteTheme.dark.tx_2;
      updates.dark_tx_3 = tinteTheme.dark.tx_3;
      updates.dark_pr = tinteTheme.dark.pr;
      updates.dark_sc = tinteTheme.dark.sc;
      updates.dark_ac_1 = tinteTheme.dark.ac_1;
      updates.dark_ac_2 = tinteTheme.dark.ac_2;
      updates.dark_ac_3 = tinteTheme.dark.ac_3;
    }

    if (typeof isPublic === "boolean") {
      updates.is_public = isPublic;
    }

    if (overrides) {
      if (overrides.shadcn !== undefined) {
        updates.shadcn_override = overrides.shadcn;
      }
      if (overrides.vscode !== undefined) {
        updates.vscode_override = overrides.vscode;
      }
      if (overrides.shiki !== undefined) {
        updates.shiki_override = overrides.shiki;
      }
    }

    const updatedTheme = await db
      .update(theme)
      .set(updates)
      .where(and(eq(theme.id, id), eq(theme.user_id, session.user.id)))
      .returning();

    if (updatedTheme.length === 0) {
      return NextResponse.json(
        { error: "Failed to update theme" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      theme: updatedTheme[0],
    });
  } catch (error) {
    console.error("Error updating theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if theme exists and belongs to user
    const { id } = await context.params;
    const existingTheme = await db
      .select()
      .from(theme)
      .where(and(eq(theme.id, id), eq(theme.user_id, session.user.id)))
      .limit(1);

    if (existingTheme.length === 0) {
      return NextResponse.json(
        { error: "Theme not found or unauthorized" },
        { status: 404 }
      );
    }

    await db
      .delete(theme)
      .where(and(eq(theme.id, id), eq(theme.user_id, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // Get theme by ID - can be public or user's own theme
    const { id } = await context.params;
    console.log({ id });
    const themeData = await db
      .select()
      .from(theme)
      .where(eq(theme.id, id))
      .limit(1);

    if (themeData.length === 0) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const themeRecord = themeData[0];

    // If theme is not public, check if user owns it
    if (!themeRecord.is_public) {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user || session.user.id !== themeRecord.user_id) {
        return NextResponse.json(
          { error: "Theme not found or unauthorized" },
          { status: 404 }
        );
      }
    }

    // Transform to UserThemeData format
    const { UserThemeService } = await import(
      "@/lib/services/user-theme.service"
    );
    // We can't call the private method directly, so we'll reconstruct the theme data
    const userTheme = {
      id: themeRecord.id,
      name: themeRecord.name,
      description: `Theme ${themeRecord.name}`,
      author: "User",
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

    return NextResponse.json(userTheme);
  } catch (error) {
    console.error("Error fetching theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
