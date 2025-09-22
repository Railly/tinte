"use server";

import { db } from "@/db";
import { userFavorites } from "@/db/schema/user";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function toggleFavorite(themeId: string) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      redirect("/auth/signin");
    }

    // Check if already favorited
    const existing = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, session.user.id),
          eq(userFavorites.themeId, themeId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Remove favorite
      await db
        .delete(userFavorites)
        .where(
          and(
            eq(userFavorites.userId, session.user.id),
            eq(userFavorites.themeId, themeId)
          )
        );

      return { success: true, isFavorite: false };
    } else {
      // Add favorite
      await db.insert(userFavorites).values({
        userId: session.user.id,
        themeId,
      });

      return { success: true, isFavorite: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "Failed to update favorite" };
  }
}

export async function getFavoriteStatus(themeId: string) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      return { isFavorite: false };
    }

    const existing = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, session.user.id),
          eq(userFavorites.themeId, themeId)
        )
      )
      .limit(1);

    return { isFavorite: existing.length > 0 };
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return { isFavorite: false };
  }
}

export async function getUserFavorites() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      return { favorites: {} };
    }

    const favorites = await db
      .select({ themeId: userFavorites.themeId })
      .from(userFavorites)
      .where(eq(userFavorites.userId, session.user.id));

    // Convert to Record<string, boolean> format
    const favoritesMap: Record<string, boolean> = {};
    favorites.forEach(fav => {
      favoritesMap[fav.themeId] = true;
    });

    return { favorites: favoritesMap };
  } catch (error) {
    console.error("Error loading user favorites:", error);
    return { favorites: {} };
  }
}