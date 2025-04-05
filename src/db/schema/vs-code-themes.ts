import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { z } from "zod";
import { relations } from "drizzle-orm";

const VSCodePaletteSchema = z.object({
  text: z.string(),
  "text-2": z.string(),
  "text-3": z.string(),

  interface: z.string(),
  "interface-2": z.string(),
  "interface-3": z.string(),

  accent: z.string(),
  "accent-2": z.string(),
  "accent-3": z.string(),

  primary: z.string(),
  secondary: z.string(),

  background: z.string(),
  "background-2": z.string(),
});

export type VSCodePalette = z.infer<typeof VSCodePaletteSchema>;

export const vsCodeThemes = pgTable("vs_code_themes", {
  id: text("id").primaryKey(),

  userId: text("user_id").references(() => users.id, {
    onUpdate: "no action",
  }),

  name: text("name"),
  isPublic: boolean("is_public").default(false),
  category: text("category").default("custom"),
  light: jsonb("light").$type<VSCodePalette>(),
  dark: jsonb("dark").$type<VSCodePalette>(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const vsCodeThemeRelations = relations(vsCodeThemes, ({ one }) => ({
  user: one(users, {
    fields: [vsCodeThemes.userId],
    references: [users.id],
  }),
}));

export type VSCodeThemeSelect = typeof vsCodeThemes.$inferSelect;
export type VSCodeThemeInsert = typeof vsCodeThemes.$inferInsert;