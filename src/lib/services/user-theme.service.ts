import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { eq } from "drizzle-orm";
import type { 
  DbTheme, 
  UserThemeData, 
  ThemeTransformOptions 
} from "@/types/user-theme";
import type { TinteBlock } from "@/types/tinte";

export class UserThemeService {
  static async getUserThemes(userId: string): Promise<UserThemeData[]> {
    try {
      const dbThemes = await db
        .select()
        .from(theme)
        .where(eq(theme.user_id, userId));

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

  private static transformDbThemeToUserTheme(
    dbTheme: DbTheme,
    options: ThemeTransformOptions = {}
  ): UserThemeData {
    const {
      author = "You",
      description = "Custom theme created by user",
      tags = ["custom", "user"]
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
      ...UserThemeService.flattenThemeProperties(dbTheme),
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