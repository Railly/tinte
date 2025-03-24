import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { shadcnThemes } from "./shadcn-themes";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
  username: text("username").unique(),
  imageUrl: text("image_url"),
});

export const usersRelations = relations(users, ({ many }) => ({
  shadcnThemes: many(shadcnThemes),
}));

export type UserSelect = typeof users.$inferSelect;
