import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { z } from "zod";

const PaletteSchema = z.object({
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

export type Palette = z.infer<typeof PaletteSchema>;

export const vsCodeThemes = pgTable("vs_code_themes", {
  id: text("id").primaryKey(),

  userId: text("user_id").references(() => users.id, {
    onUpdate: "no action",
  }),

  name: text("name"),
  isPublic: boolean("is_public").default(false),
  category: text("category").default("custom"),
  light: jsonb("light").$type<Palette>(),
  dark: jsonb("dark").$type<Palette>(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});
