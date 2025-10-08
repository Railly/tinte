"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { userFavorites } from "@/db/schema/user";

export async function toggleFavorite(themeId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-in");
    }

    // Check if already favorited
    const existing = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.themeId, themeId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      // Remove favorite
      await db
        .delete(userFavorites)
        .where(
          and(
            eq(userFavorites.userId, userId),
            eq(userFavorites.themeId, themeId),
          ),
        );

      return { success: true, isFavorite: false };
    } else {
      // Add favorite
      await db.insert(userFavorites).values({
        userId: userId,
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
    const { userId } = await auth();

    if (!userId) {
      return { isFavorite: false };
    }

    const existing = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.themeId, themeId),
        ),
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
    const { userId } = await auth();

    if (!userId) {
      return { favorites: {} };
    }

    const favorites = await db
      .select({ themeId: userFavorites.themeId })
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId));

    // Convert to Record<string, boolean> format
    const favoritesMap: Record<string, boolean> = {};
    favorites.forEach((fav) => {
      favoritesMap[fav.themeId] = true;
    });

    return { favorites: favoritesMap };
  } catch (error) {
    console.error("Error loading user favorites:", error);
    return { favorites: {} };
  }
}
