import { eq } from "drizzle-orm";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import type { UserThemeData } from "@/types/user-theme";

/**
 * Server-side function to get a theme by slug
 * First checks in pre-loaded themes, then queries the database
 */
export async function getThemeBySlug(
  slug: string,
  preloadedThemes: UserThemeData[] = []
): Promise<UserThemeData | null> {
  // First, try to find in pre-loaded themes
  const themeInPreloaded = preloadedThemes.find(theme => theme.slug === slug);
  if (themeInPreloaded) {
    console.log('🎨 [Server] Found theme in pre-loaded themes:', slug);
    return themeInPreloaded;
  }

  // If not found and looks like a valid theme slug, fetch from database
  if (!slug || slug.match(/^[0-9a-f-]{36}$/i) || slug === 'default' || slug === 'theme') {
    return null;
  }

  try {
    const themeData = await db
      .select()
      .from(theme)
      .where(eq(theme.slug, slug))
      .limit(1);

    if (themeData.length === 0) {
      console.log('❌ [Server] Theme not found:', slug);
      return null;
    }

    const themeRecord = themeData[0];

    // Transform database record to ThemeWithMetadata format
    const transformedTheme: UserThemeData = {
      // Base Theme properties (from database)
      ...themeRecord,

      // Computed properties for ThemeWithMetadata
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

      // Display metadata
      author: "Tinte User",
      description: themeRecord.concept || `Theme ${themeRecord.name}`,
      tags: ["custom"],

      // Provider metadata
      provider: "tinte" as const,
      downloads: 0,
      likes: 0,
      createdAt: themeRecord.created_at?.toISOString() || new Date().toISOString(),

      // Structured overrides
      overrides: {
        shadcn: themeRecord.shadcn_override as any,
        vscode: themeRecord.vscode_override as any,
        shiki: themeRecord.shiki_override as any,
      },
    };

    console.log('✅ [Server] Found theme by slug in database:', slug, transformedTheme.name);
    return transformedTheme;
  } catch (error) {
    console.error('💥 [Server] Error fetching theme by slug:', error);
    return null;
  }
}