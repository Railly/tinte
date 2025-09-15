"use server";

import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { auth } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

export async function incrementThemeInstalls(themeId: string) {
  try {
    // Increment the installs count
    const result = await db
      .update(theme)
      .set({
        installs: sql`${theme.installs} + 1`,
        updated_at: new Date(),
      })
      .where(eq(theme.id, themeId))
      .returning({ installs: theme.installs });

    if (result.length === 0) {
      return { success: false, error: "Theme not found" };
    }

    return {
      success: true,
      installs: result[0].installs
    };

  } catch (error) {
    console.error("Error incrementing installs:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function renameTheme(themeId: string, newName: string) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      redirect("/auth/signin");
    }

    if (!newName?.trim()) {
      return { success: false, error: "Theme name is required" };
    }

    // Check if theme exists and belongs to user
    const existingTheme = await db
      .select()
      .from(theme)
      .where(
        and(
          eq(theme.id, themeId),
          eq(theme.user_id, session.user.id)
        )
      )
      .limit(1);

    if (existingTheme.length === 0) {
      return { success: false, error: "Theme not found or unauthorized" };
    }

    // Update theme name
    const slug = newName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const updatedTheme = await db
      .update(theme)
      .set({
        name: newName.trim(),
        slug,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(theme.id, themeId),
          eq(theme.user_id, session.user.id)
        )
      )
      .returning();

    if (updatedTheme.length === 0) {
      return { success: false, error: "Failed to update theme" };
    }

    return {
      success: true,
      theme: updatedTheme[0]
    };

  } catch (error) {
    console.error("Error renaming theme:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function duplicateTheme(themeId: string, name: string, makePublic: boolean) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      redirect("/auth/signin");
    }

    if (!name?.trim()) {
      return { success: false, error: "Theme name is required" };
    }

    // Get the original theme
    const originalTheme = await db
      .select()
      .from(theme)
      .where(eq(theme.id, themeId))
      .limit(1);

    if (originalTheme.length === 0) {
      return { success: false, error: "Original theme not found" };
    }

    const original = originalTheme[0];

    // Create the duplicate
    const newThemeId = `theme_${nanoid()}`;
    const newLegacyId = `tinte_${nanoid()}`;
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const duplicatedTheme = await db
      .insert(theme)
      .values({
        id: newThemeId,
        legacy_id: newLegacyId,
        user_id: session.user.id,
        name: name.trim(),
        slug,

        // Copy all color values
        light_bg: original.light_bg,
        light_bg_2: original.light_bg_2,
        light_ui: original.light_ui,
        light_ui_2: original.light_ui_2,
        light_ui_3: original.light_ui_3,
        light_tx: original.light_tx,
        light_tx_2: original.light_tx_2,
        light_tx_3: original.light_tx_3,
        light_pr: original.light_pr,
        light_sc: original.light_sc,
        light_ac_1: original.light_ac_1,
        light_ac_2: original.light_ac_2,
        light_ac_3: original.light_ac_3,

        dark_bg: original.dark_bg,
        dark_bg_2: original.dark_bg_2,
        dark_ui: original.dark_ui,
        dark_ui_2: original.dark_ui_2,
        dark_ui_3: original.dark_ui_3,
        dark_tx: original.dark_tx,
        dark_tx_2: original.dark_tx_2,
        dark_tx_3: original.dark_tx_3,
        dark_pr: original.dark_pr,
        dark_sc: original.dark_sc,
        dark_ac_1: original.dark_ac_1,
        dark_ac_2: original.dark_ac_2,
        dark_ac_3: original.dark_ac_3,

        is_public: makePublic,
        installs: 0,

        // Copy overrides
        shadcn_override: original.shadcn_override,
        vscode_override: original.vscode_override,
        shiki_override: original.shiki_override,
      })
      .returning();

    return {
      success: true,
      theme: duplicatedTheme[0]
    };

  } catch (error) {
    console.error("Error duplicating theme:", error);
    return { success: false, error: "Internal server error" };
  }
}