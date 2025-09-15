import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { eq } from "drizzle-orm";
import { convertTinteToShadcn } from "@/lib/providers/shadcn";
import type { TinteTheme } from "@/types/tinte";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    console.log({id})
    // Get theme by ID - must be public for registry access
    const themeData = await db
      .select()
      .from(theme)
      .where(eq(theme.id, id))
      .limit(1);

    if (themeData.length === 0) {
      return NextResponse.json(
        { error: "Theme not found" },
        { status: 404 }
      );
    }

    const themeRecord = themeData[0];

    // Only allow public themes for registry access
    // if (!themeRecord.is_public) {
    //   return NextResponse.json(
    //     { error: "Theme not found" },
    //     { status: 404 }
    //   );
    // }

    // Reconstruct TinteTheme from database record
    const tinteTheme: TinteTheme = {
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

    // Convert to shadcn theme
    const shadcnTheme = convertTinteToShadcn(tinteTheme);

    // Apply any shadcn overrides if they exist
    if (themeRecord.shadcn_override) {
      const overrides = themeRecord.shadcn_override as any;
      if (overrides.light) {
        Object.assign(shadcnTheme.light, overrides.light);
      }
      if (overrides.dark) {
        Object.assign(shadcnTheme.dark, overrides.dark);
      }
    }

    // Create shadcn registry-compatible format
    const registryItem = {
      "$schema": "https://ui.shadcn.com/schema/registry-item.json",
      "name": themeRecord.slug || themeRecord.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      "type": "registry:theme",
      "title": themeRecord.name,
      "description": `${themeRecord.name} - A custom theme created with Tinte`,
      "author": "Tinte User",
      "cssVars": {
        "light": {},
        "dark": {}
      }
    };

    // Convert theme colors to CSS variable format
    Object.entries(shadcnTheme.light).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // Convert hex colors to oklch format if needed
        let cssValue = value;
        if (value.startsWith('#')) {
          // For now, keep hex values as-is since shadcn supports them
          cssValue = value;
        }
        registryItem.cssVars.light[key] = cssValue;
      }
    });

    Object.entries(shadcnTheme.dark).forEach(([key, value]) => {
      if (typeof value === 'string') {
        let cssValue = value;
        if (value.startsWith('#')) {
          cssValue = value;
        }
        registryItem.cssVars.dark[key] = cssValue;
      }
    });

    return NextResponse.json(registryItem, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error("Error generating registry theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
