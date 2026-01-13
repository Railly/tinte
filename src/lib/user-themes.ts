import { and, count, desc, eq, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { user, userFavorites } from "@/db/schema/user";
import type {
  Theme,
  ThemeColors,
  ThemeTransformOptions,
  ThemeWithMetadata,
} from "@/lib/theme-types";
import { VENDORS } from "@/lib/vendors";
import type { NormalizedOverrides } from "@/types/overrides";
import type { TinteBlock } from "@/types/tinte";

export async function getThemesWithUsers(
  limit?: number,
  currentUserId?: string | null,
): Promise<ThemeWithMetadata[]> {
  try {
    let baseQuery = db
      .select({
        theme: theme,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        isFavorite: currentUserId
          ? sql`CASE WHEN ${userFavorites.userId} IS NOT NULL THEN true ELSE false END`
          : sql`false`,
      })
      .from(theme)
      .leftJoin(user, eq(theme.user_id, user.id))
      .orderBy(desc(theme.created_at));

    // Only add userFavorites join if currentUserId is provided
    if (currentUserId) {
      baseQuery = baseQuery.leftJoin(
        userFavorites,
        and(
          eq(userFavorites.themeId, theme.id),
          eq(userFavorites.userId, currentUserId),
        ),
      );
    }

    const results = await (limit ? baseQuery.limit(limit) : baseQuery);

    return await Promise.all(
      results.map(async (result) => {
        const likeCount = await getThemeLikeCount(result.theme.id);
        return transformThemeToMetadata(
          result.theme,
          {
            author: result.user?.name || "Anonymous",
            description: `Theme by ${result.user?.name || "Anonymous"}`,
            tags: ["user", "custom"],
            isFavorite: Boolean(result.isFavorite),
            likes: likeCount,
          },
          result.user,
        );
      }),
    );
  } catch (error) {
    console.error("Error fetching themes with users:", error);
    return [];
  }
}

export async function getUserThemes(
  userId: string,
  limit?: number,
  currentUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  },
): Promise<ThemeWithMetadata[]> {
  try {
    const baseQuery = db
      .select()
      .from(theme)
      .where(eq(theme.user_id, userId))
      .orderBy(desc(theme.created_at));

    const dbThemes = await (limit ? baseQuery.limit(limit) : baseQuery);

    const transformedThemes = await Promise.all(
      dbThemes.map(async (themeData) => {
        const likeCount = await getThemeLikeCount(themeData.id);
        return transformThemeToMetadata(
          themeData,
          {
            author: "You",
            description: `Custom theme created by you`,
            tags: ["custom", "user"],
            likes: likeCount,
          },
          currentUser,
        );
      }),
    );

    return transformedThemes;
  } catch (error) {
    console.error("Error fetching user themes:", error);
    return [];
  }
}

export async function getPublicThemes(
  limit?: number,
  offset?: number,
  currentUserId?: string,
  search?: string,
): Promise<ThemeWithMetadata[]> {
  try {
    const searchConditions = search
      ? or(
          sql`LOWER(${theme.name}) LIKE ${`%${search.toLowerCase()}%`}`,
          sql`LOWER(${theme.concept}) LIKE ${`%${search.toLowerCase()}%`}`,
        )
      : undefined;

    let baseQuery = db
      .select({
        theme: theme,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        isFavorite: currentUserId
          ? sql`CASE WHEN ${userFavorites.userId} IS NOT NULL THEN true ELSE false END`
          : sql`false`,
      })
      .from(theme)
      .leftJoin(user, eq(theme.user_id, user.id))
      .where(
        searchConditions
          ? and(
              eq(theme.is_public, true),
              sql`${theme.vendor} IS NULL`,
              searchConditions,
            )
          : and(eq(theme.is_public, true), sql`${theme.vendor} IS NULL`),
      )
      .orderBy(desc(theme.created_at));

    // Only add userFavorites join if currentUserId is provided
    if (currentUserId) {
      baseQuery = baseQuery.leftJoin(
        userFavorites,
        and(
          eq(userFavorites.themeId, theme.id),
          eq(userFavorites.userId, currentUserId),
        ),
      );
    }

    const results = await (offset
      ? limit
        ? baseQuery.limit(limit).offset(offset)
        : baseQuery.offset(offset)
      : limit
        ? baseQuery.limit(limit)
        : baseQuery);

    const transformedThemes = await Promise.all(
      results.map(async (result) => {
        const likeCount = await getThemeLikeCount(result.theme.id);
        return transformThemeToMetadata(
          result.theme,
          {
            author: result.user?.name || "Anonymous",
            description: `Beautiful ${result.theme.name.toLowerCase()} theme ${
              result.user?.name
                ? `by ${result.user.name}`
                : "shared by the community"
            }`,
            tags: ["community", "public", "shared"],
            isFavorite: Boolean(result.isFavorite),
            likes: likeCount,
          },
          result.user,
        );
      }),
    );

    return transformedThemes;
  } catch (error) {
    console.error("Error fetching public themes:", error);
    return [];
  }
}

export async function getPublicThemesCount(): Promise<number> {
  try {
    const result = await db
      .select({ count: count() })
      .from(theme)
      .where(and(eq(theme.is_public, true), sql`${theme.vendor} IS NULL`));

    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error counting public themes:", error);
    return 0;
  }
}

export async function getAllPublicThemes(): Promise<ThemeWithMetadata[]> {
  try {
    const results = await db
      .select({
        theme: theme,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(theme)
      .leftJoin(user, eq(theme.user_id, user.id))
      .where(and(eq(theme.is_public, true), sql`${theme.vendor} IS NULL`))
      .orderBy(desc(theme.created_at));

    const transformedThemes = await Promise.all(
      results.map(async (result) => {
        const likeCount = await getThemeLikeCount(result.theme.id);
        return transformThemeToMetadata(
          result.theme,
          {
            author: result.user?.name || "Anonymous",
            description: `Beautiful ${result.theme.name.toLowerCase()} theme ${
              result.user?.name
                ? `by ${result.user.name}`
                : "shared by the community"
            }`,
            tags: ["community", "public", "shared"],
            likes: likeCount,
          },
          result.user,
        );
      }),
    );

    return transformedThemes;
  } catch (error) {
    console.error("Error fetching all public themes:", error);
    return [];
  }
}

export async function getUserFavoriteThemes(
  userId: string,
): Promise<ThemeWithMetadata[]> {
  try {
    const results = await db
      .select({
        theme: theme,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(userFavorites)
      .innerJoin(theme, eq(userFavorites.themeId, theme.id))
      .leftJoin(user, eq(theme.user_id, user.id))
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));

    const transformedThemes = await Promise.all(
      results.map(async (result) => {
        const likeCount = await getThemeLikeCount(result.theme.id);
        return transformThemeToMetadata(
          result.theme,
          {
            author: result.user?.name || "Anonymous",
            description: `${result.theme.name} ${
              result.user?.name
                ? `by ${result.user.name}`
                : "from the community"
            }`,
            tags: ["favorite", "starred"],
            isFavorite: true,
            likes: likeCount,
          },
          result.user,
        );
      }),
    );

    return transformedThemes;
  } catch (error) {
    console.error("Error fetching user favorite themes:", error);
    return [];
  }
}

export async function getTweakCNThemes(
  limit?: number,
): Promise<ThemeWithMetadata[]> {
  try {
    const baseQuery = db
      .select()
      .from(theme)
      .where(eq(theme.vendor, VENDORS.TWEAKCN))
      .orderBy(desc(theme.created_at));

    const dbThemes = await (limit ? baseQuery.limit(limit) : baseQuery);

    const transformedThemes = await Promise.all(
      dbThemes.map(async (themeData) => {
        const likeCount = await getThemeLikeCount(themeData.id);
        return transformThemeToMetadata(
          themeData,
          {
            author: "tweakcn",
            description: `Beautiful ${themeData.name.toLowerCase()} theme with carefully crafted color combinations`,
            tags: [
              themeData.name.split(" ")[0].toLowerCase(),
              "modern",
              "preset",
              "community",
            ],
            likes: likeCount,
          },
          null,
        );
      }),
    );

    return transformedThemes;
  } catch (error) {
    console.error("Error fetching TweakCN themes:", error);
    return [];
  }
}

export async function getTinteThemes(
  limit?: number,
): Promise<ThemeWithMetadata[]> {
  try {
    const baseQuery = db
      .select()
      .from(theme)
      .where(eq(theme.vendor, VENDORS.TINTE))
      .orderBy(desc(theme.created_at));

    const dbThemes = await (limit ? baseQuery.limit(limit) : baseQuery);

    const transformedThemes = await Promise.all(
      dbThemes.map(async (themeData) => {
        const likeCount = await getThemeLikeCount(themeData.id);
        return transformThemeToMetadata(
          themeData,
          {
            author: "tinte",
            description: `Beautiful ${themeData.name.toLowerCase()} theme with modern design principles`,
            tags: [
              themeData.name.split(" ")[0].toLowerCase(),
              "modern",
              "preset",
              "official",
            ],
            likes: likeCount,
          },
          null,
        );
      }),
    );

    return transformedThemes;
  } catch (error) {
    console.error("Error fetching Tinte themes:", error);
    return [];
  }
}

export async function getRaysoThemes(
  limit?: number,
): Promise<ThemeWithMetadata[]> {
  try {
    const baseQuery = db
      .select()
      .from(theme)
      .where(eq(theme.vendor, VENDORS.RAYSO))
      .orderBy(desc(theme.created_at));

    const dbThemes = await (limit ? baseQuery.limit(limit) : baseQuery);

    const transformedThemes = await Promise.all(
      dbThemes.map(async (themeData) => {
        const likeCount = await getThemeLikeCount(themeData.id);
        return transformThemeToMetadata(
          themeData,
          {
            author: "ray.so",
            description: `Beautiful ${themeData.name.toLowerCase()} theme inspired by ray.so aesthetics`,
            tags: [
              themeData.name.split(" ")[0].toLowerCase(),
              "rayso",
              "preset",
              "community",
            ],
            likes: likeCount,
          },
          null,
        );
      }),
    );

    return transformedThemes;
  } catch (error) {
    console.error("Error fetching Rayso themes:", error);
    return [];
  }
}

async function getThemeLikeCount(themeId: string): Promise<number> {
  try {
    const result = await db
      .select({ count: count() })
      .from(userFavorites)
      .where(eq(userFavorites.themeId, themeId));

    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error fetching theme like count:", error);
    return 0;
  }
}

function transformThemeToMetadata(
  dbTheme: Theme,
  options: ThemeTransformOptions = {},
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null,
): ThemeWithMetadata {
  const {
    author = "You",
    description = "Custom theme created by user",
    tags = ["custom", "user"],
    isFavorite = false,
    likes = 0,
    downloads = 0,
  } = options;

  return {
    ...dbTheme,
    // Computed properties
    colors: extractThemeColors(dbTheme),
    rawTheme: buildRawTheme(dbTheme),

    // Display metadata
    author,
    description: dbTheme.concept || description,
    tags,

    provider: dbTheme.vendor as "tweakcn" | "rayso" | "tinte",
    downloads,
    likes,
    createdAt: dbTheme.created_at?.toISOString() || new Date().toISOString(),

    // User context
    user,
    isFavorite,

    // Structured overrides
    overrides: transformOverridesFromDb(dbTheme),

    // Direct overrides (for backward compatibility and ease of access)
    shadcn_override: dbTheme.shadcn_override,
    vscode_override: dbTheme.vscode_override,
    shiki_override: dbTheme.shiki_override,
  };
}

function transformOverridesFromDb(dbTheme: Theme): NormalizedOverrides {
  return {
    shadcn: dbTheme.shadcn_override ?? undefined,
    vscode: dbTheme.vscode_override as NormalizedOverrides["vscode"],
    shiki: dbTheme.shiki_override as NormalizedOverrides["shiki"],
  };
}

function extractThemeColors(dbTheme: Theme): ThemeColors {
  return {
    primary: dbTheme.light_pr,
    secondary: dbTheme.light_sc,
    accent: dbTheme.light_ac_1,
    foreground: dbTheme.light_tx,
    background: dbTheme.light_bg,
  };
}

function buildRawTheme(dbTheme: Theme) {
  return {
    light: buildTinteBlock(dbTheme, "light"),
    dark: buildTinteBlock(dbTheme, "dark"),
  };
}

function buildTinteBlock(dbTheme: Theme, mode: "light" | "dark"): TinteBlock {
  const prefix = mode === "light" ? "light_" : "dark_";

  return {
    bg: (dbTheme[`${prefix}bg` as keyof Theme] as string) || "",
    bg_2: (dbTheme[`${prefix}bg_2` as keyof Theme] as string) || "",
    ui: (dbTheme[`${prefix}ui` as keyof Theme] as string) || "",
    ui_2: (dbTheme[`${prefix}ui_2` as keyof Theme] as string) || "",
    ui_3: (dbTheme[`${prefix}ui_3` as keyof Theme] as string) || "",
    tx: (dbTheme[`${prefix}tx` as keyof Theme] as string) || "",
    tx_2: (dbTheme[`${prefix}tx_2` as keyof Theme] as string) || "",
    tx_3: (dbTheme[`${prefix}tx_3` as keyof Theme] as string) || "",
    pr: (dbTheme[`${prefix}pr` as keyof Theme] as string) || "",
    sc: (dbTheme[`${prefix}sc` as keyof Theme] as string) || "",
    ac_1: (dbTheme[`${prefix}ac_1` as keyof Theme] as string) || "",
    ac_2: (dbTheme[`${prefix}ac_2` as keyof Theme] as string) || "",
    ac_3: (dbTheme[`${prefix}ac_3` as keyof Theme] as string) || "",
  };
}
