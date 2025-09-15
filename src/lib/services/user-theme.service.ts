import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { user, userFavorites } from "@/db/schema/user";
import { eq, desc, count, and, sql } from "drizzle-orm";
import type { 
  DbTheme, 
  UserThemeData, 
  ThemeTransformOptions 
} from "@/types/user-theme";
import type { TinteBlock } from "@/types/tinte";

export class UserThemeService {
  static async getThemesWithUsers(limit?: number, currentUserId?: string): Promise<UserThemeData[]> {
    try {
      const baseQuery = db
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
            : sql`false`
        })
        .from(theme)
        .leftJoin(user, eq(theme.user_id, user.id))
        .leftJoin(
          userFavorites,
          currentUserId
            ? and(
                eq(userFavorites.themeId, theme.id),
                eq(userFavorites.userId, currentUserId)
              )
            : undefined
        )
        .orderBy(desc(theme.created_at));

      const results = await (limit ? baseQuery.limit(limit) : baseQuery);

      return results.map(result =>
        UserThemeService.transformDbThemeToUserTheme(result.theme, {
          author: result.user?.name || "Anonymous",
          description: `Theme by ${result.user?.name || "Anonymous"}`,
          tags: ["user", "custom"],
          isFavorite: Boolean(result.isFavorite)
        }, result.user)
      );
    } catch (error) {
      console.error("Error fetching themes with users:", error);
      return [];
    }
  }

  static async getUserThemes(userId: string, limit?: number): Promise<UserThemeData[]> {
    try {
      const baseQuery = db
        .select()
        .from(theme)
        .where(eq(theme.user_id, userId))
        .orderBy(theme.created_at);

      const dbThemes = await (limit ? baseQuery.limit(limit) : baseQuery);

      console.log("UserThemeService - DB themes count:", dbThemes.length);
      
      const transformedThemes = dbThemes.map(theme => 
        UserThemeService.transformDbThemeToUserTheme(theme)
      );
      
      console.log("UserThemeService - Transformed themes:", transformedThemes.length);
      
      return transformedThemes;
    } catch (error) {
      console.error("Error fetching user themes:", error);
      return [];
    }
  }

  static async getPublicThemes(limit?: number, offset?: number, currentUserId?: string): Promise<UserThemeData[]> {
    try {
      const baseQuery = db
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
            : sql`false`
        })
        .from(theme)
        .leftJoin(user, eq(theme.user_id, user.id))
        .leftJoin(
          userFavorites,
          currentUserId
            ? and(
                eq(userFavorites.themeId, theme.id),
                eq(userFavorites.userId, currentUserId)
              )
            : undefined
        )
        .where(eq(theme.is_public, true))
        .orderBy(desc(theme.created_at));

      const results = await (
        offset
          ? (limit ? baseQuery.limit(limit).offset(offset) : baseQuery.offset(offset))
          : (limit ? baseQuery.limit(limit) : baseQuery)
      );

      console.log("UserThemeService - Public themes count:", results.length);

      const transformedThemes = results.map(result =>
        UserThemeService.transformDbThemeToUserTheme(result.theme, {
          author: result.user?.name || "Anonymous",
          description: `Beautiful ${result.theme.name.toLowerCase()} theme ${result.user?.name ? `by ${result.user.name}` : 'shared by the community'}`,
          tags: ["community", "public", "shared"],
          isFavorite: Boolean(result.isFavorite)
        }, result.user)
      );
      
      console.log("UserThemeService - Transformed public themes:", transformedThemes.length);
      
      return transformedThemes;
    } catch (error) {
      console.error("Error fetching public themes:", error);
      return [];
    }
  }


  static async getPublicThemesCount(): Promise<number> {
    try {
      const result = await db
        .select({ count: count() })
        .from(theme)
        .where(eq(theme.is_public, true));

      return result[0]?.count || 0;
    } catch (error) {
      console.error("Error counting public themes:", error);
      return 0;
    }
  }

  static async getAllPublicThemes(): Promise<UserThemeData[]> {
    try {
      const results = await db
        .select({
          theme: theme,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        })
        .from(theme)
        .leftJoin(user, eq(theme.user_id, user.id))
        .where(eq(theme.is_public, true))
        .orderBy(desc(theme.created_at));

      console.log("UserThemeService - All public themes count:", results.length);
      
      const transformedThemes = results.map(result => 
        UserThemeService.transformDbThemeToUserTheme(result.theme, {
          author: result.user?.name || "Anonymous",
          description: `Beautiful ${result.theme.name.toLowerCase()} theme ${result.user?.name ? `by ${result.user.name}` : 'shared by the community'}`,
          tags: ["community", "public", "shared"]
        }, result.user)
      );
      
      console.log("UserThemeService - Transformed all public themes:", transformedThemes.length);
      
      return transformedThemes;
    } catch (error) {
      console.error("Error fetching all public themes:", error);
      return [];
    }
  }

  private static transformDbThemeToUserTheme(
    dbTheme: DbTheme,
    options: ThemeTransformOptions = {},
    user?: { id: string; name?: string | null; email?: string | null; image?: string | null } | null
  ): UserThemeData {
    const {
      author = "You",
      description = "Custom theme created by user",
      tags = ["custom", "user"],
      isFavorite = false
    } = options;

    return {
      id: dbTheme.id,
      name: dbTheme.name,
      description,
      author,
      provider: "tinte" as const,
      downloads: 0,
      likes: 0,
      views: 0,
      tags,
      createdAt: dbTheme.created_at?.toISOString() || new Date().toISOString(),
      colors: UserThemeService.extractThemeColors(dbTheme),
      rawTheme: UserThemeService.buildRawTheme(dbTheme),
      user: user,
      isFavorite,
      // Include overrides from database - structured by mode
      overrides: UserThemeService.transformOverridesFromDb(dbTheme),
      ...UserThemeService.flattenThemeProperties(dbTheme),
    };
  }

  private static transformOverridesFromDb(dbTheme: DbTheme) {
    // For now, assuming overrides are already structured by mode
    // If they're not, we'd need more complex transformation logic
    return {
      shadcn: dbTheme.shadcn_override || undefined,
      vscode: dbTheme.vscode_override || undefined,
      shiki: dbTheme.shiki_override || undefined,
    };
  }

  private static extractThemeColors(dbTheme: DbTheme) {
    return {
      primary: dbTheme.light_pr,
      secondary: dbTheme.light_sc,
      accent: dbTheme.light_ac_1,
      foreground: dbTheme.light_tx,
      background: dbTheme.light_bg,
    };
  }

  private static buildRawTheme(dbTheme: DbTheme) {
    return {
      light: this.buildTinteBlock(dbTheme, "light"),
      dark: this.buildTinteBlock(dbTheme, "dark"),
    };
  }

  private static buildTinteBlock(dbTheme: DbTheme, mode: "light" | "dark"): TinteBlock {
    const prefix = mode === "light" ? "light_" : "dark_";
    
    return {
      bg: dbTheme[`${prefix}bg` as keyof DbTheme] as string,
      bg_2: dbTheme[`${prefix}bg_2` as keyof DbTheme] as string,
      ui: dbTheme[`${prefix}ui` as keyof DbTheme] as string,
      ui_2: dbTheme[`${prefix}ui_2` as keyof DbTheme] as string,
      ui_3: dbTheme[`${prefix}ui_3` as keyof DbTheme] as string,
      tx: dbTheme[`${prefix}tx` as keyof DbTheme] as string,
      tx_2: dbTheme[`${prefix}tx_2` as keyof DbTheme] as string,
      tx_3: dbTheme[`${prefix}tx_3` as keyof DbTheme] as string,
      pr: dbTheme[`${prefix}pr` as keyof DbTheme] as string,
      sc: dbTheme[`${prefix}sc` as keyof DbTheme] as string,
      ac_1: dbTheme[`${prefix}ac_1` as keyof DbTheme] as string,
      ac_2: dbTheme[`${prefix}ac_2` as keyof DbTheme] as string,
      ac_3: dbTheme[`${prefix}ac_3` as keyof DbTheme] as string,
    };
  }

  private static flattenThemeProperties(dbTheme: DbTheme) {
    const { id, name, user_id, created_at, ...themeProps } = dbTheme;
    return themeProps;
  }
}