import { adminDb } from "./index";
import { withRLS, admin } from "./rls";
import { themes } from "./schema";
import { eq, and } from "drizzle-orm";

// RLS-aware queries (use these for user operations)
export async function getThemesByUser(userId: string) {
  return withRLS(userId, async ({ db }) => {
    return db.select().from(themes);
  });
}

export async function getPublicThemes() {
  return adminDb.select().from(themes).where(eq(themes.public, true));
}

export async function getUserThemes(userId: string) {
  return withRLS(userId, async ({ db }) => {
    return db.select().from(themes).where(eq(themes.userId, userId));
  });
}

export async function addTheme(
  userId: string,
  data: {
    name: string;
    description?: string;
    content: string;
    public?: boolean;
  }
) {
  return withRLS(userId, async ({ db }) => {
    return db
      .insert(themes)
      .values({
        userId,
        name: data.name,
        description: data.description,
        content: data.content,
        public: data.public ?? false,
      })
      .returning();
  });
}

export async function updateTheme(
  userId: string,
  themeId: number,
  data: Partial<{
    name: string;
    description: string;
    content: string;
    public: boolean;
  }>
) {
  return withRLS(userId, async ({ db }) => {
    return db
      .update(themes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(themes.id, themeId))
      .returning();
  });
}

export async function deleteTheme(userId: string, themeId: number) {
  return withRLS(userId, async ({ db }) => {
    return db.delete(themes).where(eq(themes.id, themeId)).returning();
  });
}

export async function getThemeById(themeId: number, userId?: string) {
  if (userId) {
    // Use RLS to ensure user can only see their own or public themes
    return withRLS(userId, async ({ db }) => {
      return db.select().from(themes).where(eq(themes.id, themeId));
    });
  } else {
    // Admin query - only return public themes for unauthenticated users
    return adminDb
      .select()
      .from(themes)
      .where(and(eq(themes.id, themeId), eq(themes.public, true)));
  }
}

// Admin queries (bypass RLS)
export async function getAllThemes() {
  return admin.db.select().from(themes);
}

export async function adminGetThemeById(themeId: number) {
  return admin.db.select().from(themes).where(eq(themes.id, themeId));
}
