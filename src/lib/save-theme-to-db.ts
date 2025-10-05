import { eq } from "drizzle-orm";
import { db } from "@/db";
import { type ThemeInsert, theme } from "@/db/schema";
import { generateThemeId } from "./generate-slug";

interface ThemeData {
  title: string;
  concept: string;
  light: {
    bg: string;
    bg_2: string;
    ui: string;
    ui_2: string;
    ui_3: string;
    tx_3: string;
    tx_2: string;
    tx: string;
    pr: string;
    sc: string;
    ac_1: string;
    ac_2: string;
    ac_3: string;
  };
  dark: {
    bg: string;
    bg_2: string;
    ui: string;
    ui_2: string;
    ui_3: string;
    tx_3: string;
    tx_2: string;
    tx: string;
    pr: string;
    sc: string;
    ac_1: string;
    ac_2: string;
    ac_3: string;
  };
  fonts?: {
    sans: string;
    serif: string;
    mono: string;
  };
  radius?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows?: {
    color: string;
    opacity: string;
    offsetX: string;
    offsetY: string;
    blur: string;
    spread: string;
  };
}

// Generate unique slug with nanoid fallback
async function generateUniqueSlug(baseName: string): Promise<string> {
  const { nanoid } = await import("nanoid");

  const baseSlug = baseName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // First, try the base slug
  const existingTheme = await db
    .select()
    .from(theme)
    .where(eq(theme.slug, baseSlug))
    .limit(1);
  if (existingTheme.length === 0) {
    return baseSlug;
  }

  // Slug collision - append nanoid for uniqueness
  return `${baseSlug}-${nanoid(6)}`;
}

export async function saveThemeToDatabase(
  themeData: ThemeData,
  userId?: string,
): Promise<{ theme: any; slug: string }> {
  const themeId = generateThemeId();
  const slug = await generateUniqueSlug(themeData.title);

  // Save only AI-generated overrides (fonts, radius, shadows)
  // Colors are derived from Tinte canonical theme, not stored in shadcn_override
  const shadcnOverride = {
    palettes: {
      light: {
        shadow: themeData.shadows
          ? {
              color: themeData.shadows.color,
              opacity: themeData.shadows.opacity,
              blur: themeData.shadows.blur,
              spread: themeData.shadows.spread,
              offset_x: themeData.shadows.offsetX,
              offset_y: themeData.shadows.offsetY,
            }
          : undefined,
      },
      dark: {
        shadow: themeData.shadows
          ? {
              color: themeData.shadows.color,
              opacity: themeData.shadows.opacity,
              blur: themeData.shadows.blur,
              spread: themeData.shadows.spread,
              offset_x: themeData.shadows.offsetX,
              offset_y: themeData.shadows.offsetY,
            }
          : undefined,
      },
    },
    fonts: themeData.fonts,
    radius: themeData.radius?.md || themeData.radius,
    letter_spacing: "0em",
  };

  const themeInsert: ThemeInsert = {
    id: themeId,
    legacy_id: themeId,
    user_id: userId || null,
    name: themeData.title,
    slug: slug,
    concept: themeData.concept,
    vendor: null,

    // Light mode
    light_bg: themeData.light.bg,
    light_bg_2: themeData.light.bg_2,
    light_ui: themeData.light.ui,
    light_ui_2: themeData.light.ui_2,
    light_ui_3: themeData.light.ui_3,
    light_tx: themeData.light.tx,
    light_tx_2: themeData.light.tx_2,
    light_tx_3: themeData.light.tx_3,
    light_pr: themeData.light.pr,
    light_sc: themeData.light.sc,
    light_ac_1: themeData.light.ac_1,
    light_ac_2: themeData.light.ac_2,
    light_ac_3: themeData.light.ac_3,

    // Dark mode
    dark_bg: themeData.dark.bg,
    dark_bg_2: themeData.dark.bg_2,
    dark_ui: themeData.dark.ui,
    dark_ui_2: themeData.dark.ui_2,
    dark_ui_3: themeData.dark.ui_3,
    dark_tx: themeData.dark.tx,
    dark_tx_2: themeData.dark.tx_2,
    dark_tx_3: themeData.dark.tx_3,
    dark_pr: themeData.dark.pr,
    dark_sc: themeData.dark.sc,
    dark_ac_1: themeData.dark.ac_1,
    dark_ac_2: themeData.dark.ac_2,
    dark_ac_3: themeData.dark.ac_3,

    is_public: true,
    installs: 0,

    // Extended properties
    // @ts-expect-error
    shadcn_override: shadcnOverride,
  };

  try {
    const [savedTheme] = await db.insert(theme).values(themeInsert).returning();

    console.log(
      `✅ Theme "${themeData.title}" saved to database with slug: ${slug}`,
    );

    return { theme: savedTheme, slug };
  } catch (error) {
    console.error("Error saving theme to database:", error);
    throw new Error("Failed to save theme to database");
  }
}
