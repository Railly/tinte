import { auth } from "@clerk/nextjs/server";
import type { TinteBlock, TinteTheme } from "@tinte/core";
import { and, eq, inArray, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { brandKitAssets, brandKits, db, type JsonValue } from "@/db";
import { createKitId } from "@/lib/ids";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

type KitAssetType = "logo" | "moodboard" | "tokens_json";

const fallbackColors = ["#d8ff5f", "#f97316", "#38bdf8", "#f4f1e8", "#171613"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function hslToHex(input: string) {
  const match = input.match(
    /hsl\(\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s*\)/i,
  );
  if (!match) return input;

  const hue = Number(match[1]) / 360;
  const saturation = Number(match[2]) / 100;
  const lightness = Number(match[3]) / 100;
  const convert = (n: number) => {
    const k = (n + hue * 12) % 12;
    const a = saturation * Math.min(lightness, 1 - lightness);
    const color = lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${convert(0)}${convert(8)}${convert(4)}`;
}

function normalizeColor(input: unknown) {
  if (typeof input !== "string") return null;
  const color = hslToHex(input.trim());
  return /^#[0-9a-f]{6}$/i.test(color) ? color.toLowerCase() : null;
}

function readableOn(background: string) {
  const red = Number.parseInt(background.slice(1, 3), 16);
  const green = Number.parseInt(background.slice(3, 5), 16);
  const blue = Number.parseInt(background.slice(5, 7), 16);
  return red * 0.299 + green * 0.587 + blue * 0.114 > 150
    ? "#10110a"
    : "#f4f1e8";
}

function createBlock(colors: string[], mode: "light" | "dark"): TinteBlock {
  const primary = colors[0] ?? fallbackColors[0];
  const secondary = colors[1] ?? fallbackColors[1];
  const accent = colors[2] ?? fallbackColors[2];
  const isLight = mode === "light";
  const bg = isLight ? "#f8f7f1" : "#0c0c0b";
  const bg2 = isLight ? "#ebe8dc" : "#171613";
  const text = isLight ? "#10110a" : readableOn(bg);

  return {
    bg,
    bg_2: bg2,
    ui: isLight ? "#d8d3c4" : "#2b2925",
    ui_2: isLight ? "#bfb8a5" : "#3a372f",
    ui_3: primary,
    tx: text,
    tx_2: isLight ? "#5f5a4e" : "#a7a096",
    tx_3: isLight ? "#837c6d" : "#6f695f",
    pr: primary,
    sc: secondary,
    ac_1: accent,
    ac_2: colors[3] ?? secondary,
    ac_3: colors[4] ?? primary,
  };
}

function createTheme(kitName: string, colors: string[]): TinteTheme {
  const palette = [...colors, ...fallbackColors]
    .map(normalizeColor)
    .filter((color): color is string => Boolean(color));

  return {
    name: `${kitName} Kit`,
    author: "kit.tinte.dev",
    light: createBlock(palette, "light"),
    dark: createBlock(palette, "dark"),
  };
}

function extractColors(value: JsonValue | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];

  const colors = value.colors;
  if (Array.isArray(colors))
    return colors.filter((item) => typeof item === "string");

  const suggestedColors = value.suggestedColors;
  if (Array.isArray(suggestedColors)) {
    return suggestedColors.filter((item) => typeof item === "string");
  }

  return [];
}

export async function POST(_: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const [kit] = await db
    .select()
    .from(brandKits)
    .where(and(eq(brandKits.id, id), eq(brandKits.user_id, userId)))
    .limit(1);

  if (!kit) {
    return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  }

  if (!kit.is_paid || kit.paid_tier !== "kit_pro") {
    return NextResponse.json({ error: "Pro kit required" }, { status: 402 });
  }

  const assets = await db
    .select()
    .from(brandKitAssets)
    .where(
      and(
        eq(brandKitAssets.kit_id, id),
        inArray(brandKitAssets.type, [
          "logo",
          "moodboard",
          "tokens_json",
        ] satisfies KitAssetType[]),
      ),
    );

  const hasLogo = assets.some((asset) => asset.type === "logo");
  const hasMoodboard = assets.some((asset) => asset.type === "moodboard");
  if (!hasLogo || !hasMoodboard) {
    return NextResponse.json(
      { error: "Logo and moodboard assets are required" },
      { status: 409 },
    );
  }

  const advancedColors = extractColors(kit.advanced);
  const promptColors = extractColors(kit.prompts);
  const theme = createTheme(kit.name, [...advancedColors, ...promptColors]);
  const slug = `${slugify(kit.name) || kit.id}-${kit.id}`;
  const themeId = createKitId();

  await db.insert(brandKitAssets).values({
    id: themeId,
    kit_id: id,
    type: "tinte_theme",
    url: `https://tinte.dev/api/preset/${slug}`,
    metadata: {
      slug,
      theme: theme as unknown as Record<string, JsonValue>,
    },
    is_premium: true,
  });

  await db.execute(sql`
    INSERT INTO theme (
      id, legacy_id, user_id, name, slug, vendor,
      light_bg, light_bg_2, light_ui, light_ui_2, light_ui_3,
      light_tx, light_tx_2, light_tx_3,
      light_pr, light_sc, light_ac_1, light_ac_2, light_ac_3,
      dark_bg, dark_bg_2, dark_ui, dark_ui_2, dark_ui_3,
      dark_tx, dark_tx_2, dark_tx_3,
      dark_pr, dark_sc, dark_ac_1, dark_ac_2, dark_ac_3,
      is_public
    ) VALUES (
      ${themeId}, ${themeId}, ${userId}, ${theme.name}, ${slug}, 'tinte',
      ${theme.light.bg}, ${theme.light.bg_2}, ${theme.light.ui}, ${theme.light.ui_2}, ${theme.light.ui_3},
      ${theme.light.tx}, ${theme.light.tx_2}, ${theme.light.tx_3},
      ${theme.light.pr}, ${theme.light.sc}, ${theme.light.ac_1}, ${theme.light.ac_2}, ${theme.light.ac_3},
      ${theme.dark.bg}, ${theme.dark.bg_2}, ${theme.dark.ui}, ${theme.dark.ui_2}, ${theme.dark.ui_3},
      ${theme.dark.tx}, ${theme.dark.tx_2}, ${theme.dark.tx_3},
      ${theme.dark.pr}, ${theme.dark.sc}, ${theme.dark.ac_1}, ${theme.dark.ac_2}, ${theme.dark.ac_3},
      true
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      light_bg = EXCLUDED.light_bg,
      light_pr = EXCLUDED.light_pr,
      dark_bg = EXCLUDED.dark_bg,
      dark_pr = EXCLUDED.dark_pr,
      updated_at = now()
  `);

  return NextResponse.json({
    themeId,
    slug,
    installCommand: `npx shadcn@latest add https://tinte.dev/api/preset/${slug}`,
    previewUrl: `https://tinte.dev/themes/${slug}`,
  });
}
