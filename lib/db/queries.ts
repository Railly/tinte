import { db } from "./index";
import { themes } from "./schema";
import { eq } from "drizzle-orm";

export async function getThemesByUser(userId: string) {
  return db.select().from(themes).where(eq(themes.userId, userId));
}

export async function addTheme(userId: string, name: string) {
  return db.insert(themes).values({ userId, name }).returning();
}

export async function getThemeById(themeId: number) {
  return db.select().from(themes).where(eq(themes.id, themeId));
}
