import { oklch } from "culori";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import {
  computeShadowVars,
  convertTinteToShadcn,
} from "@/lib/providers/shadcn";
import type { TinteTheme } from "@/types/tinte";

function formatOklch(color: string): string {
  const parsed = oklch(color);
  if (!parsed) return color;
  const l = parsed.l.toFixed(4);
  const c = parsed.c.toFixed(4);
  const h = (parsed.h ?? 0).toFixed(4);
  return `oklch(${l} ${c} ${h})`;
}

const COLOR_TOKENS = new Set([
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  "shadow-color",
]);

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    // Try to find theme by slug first, then by id
    let themeData = await db
      .select()
      .from(theme)
      .where(eq(theme.slug, slug))
      .limit(1);

    if (themeData.length === 0) {
      // Fallback: try finding by id
      themeData = await db
        .select()
        .from(theme)
        .where(eq(theme.id, slug))
        .limit(1);
    }

    if (themeData.length === 0) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
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
    const shadcnThemeBase = convertTinteToShadcn(tinteTheme);
    const shadcnTheme: {
      light: Record<string, string>;
      dark: Record<string, string>;
    } = {
      light: { ...shadcnThemeBase.light },
      dark: { ...shadcnThemeBase.dark },
    };

    // Apply any shadcn overrides if they exist
    const overrides = (themeRecord.shadcn_override as any) || {};
    const fontOverrides = overrides?.fonts || {};
    const radiusOverrides = overrides?.radius;

    // Apply overrides for each mode
    (["light", "dark"] as const).forEach((mode) => {
      const modePaletteOverrides = overrides?.palettes?.[mode] || {};
      const modeShadowOverrides = modePaletteOverrides?.shadow;

      // Apply color overrides
      Object.entries(modePaletteOverrides).forEach(([key, value]) => {
        if (key !== "shadow" && typeof value === "string") {
          shadcnTheme[mode][key] = value;
        }
      });

      // Apply font overrides
      if (fontOverrides["font-sans"]) {
        shadcnTheme[mode]["font-sans"] = fontOverrides["font-sans"];
      }
      if (fontOverrides["font-serif"]) {
        shadcnTheme[mode]["font-serif"] = fontOverrides["font-serif"];
      }
      if (fontOverrides["font-mono"]) {
        shadcnTheme[mode]["font-mono"] = fontOverrides["font-mono"];
      }

      // Apply shadow overrides
      if (modeShadowOverrides) {
        if (modeShadowOverrides.color) {
          shadcnTheme[mode]["shadow-color"] = modeShadowOverrides.color;
        }
        if (modeShadowOverrides.opacity) {
          shadcnTheme[mode]["shadow-opacity"] = modeShadowOverrides.opacity;
        }
        if (modeShadowOverrides.blur) {
          shadcnTheme[mode]["shadow-blur"] = modeShadowOverrides.blur;
        }
        if (modeShadowOverrides.spread) {
          shadcnTheme[mode]["shadow-spread"] = modeShadowOverrides.spread;
        }
        if (modeShadowOverrides.offset_x) {
          shadcnTheme[mode]["shadow-x"] = modeShadowOverrides.offset_x;
        }
        if (modeShadowOverrides.offset_y) {
          shadcnTheme[mode]["shadow-y"] = modeShadowOverrides.offset_y;
        }
      }

      // Apply radius overrides
      if (radiusOverrides) {
        if (typeof radiusOverrides === "object") {
          if (radiusOverrides.sm)
            shadcnTheme[mode]["radius-sm"] = radiusOverrides.sm;
          if (radiusOverrides.md)
            shadcnTheme[mode]["radius-md"] = radiusOverrides.md;
          if (radiusOverrides.lg)
            shadcnTheme[mode]["radius-lg"] = radiusOverrides.lg;
          if (radiusOverrides.xl)
            shadcnTheme[mode]["radius-xl"] = radiusOverrides.xl;
          shadcnTheme[mode].radius =
            radiusOverrides.md || radiusOverrides.lg || "0.5rem";
        } else {
          shadcnTheme[mode].radius = radiusOverrides;
        }
      }
    });

    // Compute shadow variables for both modes
    const lightShadowVars = computeShadowVars(shadcnTheme.light);
    const darkShadowVars = computeShadowVars(shadcnTheme.dark);

    // Create shadcn registry-compatible format
    type RegistryItem = {
      $schema: string;
      name: string;
      type: string;
      title: string;
      description: string;
      author: string;
      cssVars: {
        light: Record<string, string>;
        dark: Record<string, string>;
      };
    };

    const registryItem: RegistryItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name:
        themeRecord.slug ||
        themeRecord.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      type: "registry:theme",
      title: themeRecord.name,
      description: `${themeRecord.name} - A custom theme created with Tinte`,
      author: "Tinte User",
      cssVars: {
        light: {},
        dark: {},
      },
    };

    // Convert theme colors to CSS variable format with OKLCH
    const processTokens = (
      tokens: Record<string, string>,
      shadowVars: Record<string, string>,
      target: Record<string, string>,
    ) => {
      const allTokens = { ...tokens, ...shadowVars };
      Object.entries(allTokens).forEach(([key, value]) => {
        if (typeof value === "string") {
          let cssValue = value;
          if (COLOR_TOKENS.has(key)) {
            if (
              value.startsWith("#") ||
              value.startsWith("hsl") ||
              value.startsWith("rgb")
            ) {
              cssValue = formatOklch(value);
            }
          }
          target[key] = cssValue;
        }
      });
    };

    processTokens(
      shadcnTheme.light,
      lightShadowVars,
      registryItem.cssVars.light,
    );
    processTokens(shadcnTheme.dark, darkShadowVars, registryItem.cssVars.dark);

    return NextResponse.json(registryItem, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating registry theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
