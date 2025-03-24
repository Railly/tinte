import { oklch } from "culori";
import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { users } from "./users";

const OklchColorSchema = z
  .string()
  .transform((val) => {
    const color = oklch(val);

    if (!color) {
      throw new Error("Invalid color");
    }

    return `oklch(${color.l} ${color.c} ${color.h})`;
  })
  .describe("Oklch color");

export const ShadcnVariables = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

export const ShadcnThemeColorsSchema = z.object({
  background: OklchColorSchema,
  foreground: OklchColorSchema,
  card: OklchColorSchema,
  "card-foreground": OklchColorSchema,
  popover: OklchColorSchema,
  "popover-foreground": OklchColorSchema,
  primary: OklchColorSchema,
  "primary-foreground": OklchColorSchema,
  secondary: OklchColorSchema,
  "secondary-foreground": OklchColorSchema,
  muted: OklchColorSchema,
  "muted-foreground": OklchColorSchema,
  accent: OklchColorSchema,
  "accent-foreground": OklchColorSchema,
  destructive: OklchColorSchema,
  "destructive-foreground": OklchColorSchema,
  border: OklchColorSchema,
  input: OklchColorSchema,
  ring: OklchColorSchema,
  "chart-1": OklchColorSchema,
  "chart-2": OklchColorSchema,
  "chart-3": OklchColorSchema,
  "chart-4": OklchColorSchema,
  "chart-5": OklchColorSchema,
});
export type ShadcnThemeColors = z.infer<typeof ShadcnThemeColorsSchema>;

export const ShadcnThemeSchema = z.object({
  name: z.string().describe("Short theme name"),
  light: ShadcnThemeColorsSchema,
  dark: ShadcnThemeColorsSchema,
  radius: z.coerce.number().describe("in rem units"),
});

export type ShadcnTheme = z.infer<typeof ShadcnThemeSchema>;

export const shadcnThemes = pgTable("shadcn_themes", {
  id: text("id").primaryKey(),
  forkedFromId: text("forked_from_id").references(
    (): AnyPgColumn => shadcnThemes.id,
  ),
  userId: text("user_id").references(() => users.id),

  name: text("name").notNull(),
  lightThemeColors: jsonb("light_theme_colors").$type<ShadcnThemeColors>(),
  darkThemeColors: jsonb("dark_theme_colors").$type<ShadcnThemeColors>(),
  radius: text("radius").default("0.5"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const shadcnThemesRelations = relations(shadcnThemes, ({ one }) => ({
  user: one(users, {
    fields: [shadcnThemes.userId],
    references: [users.id],
  }),
  forkedFrom: one(shadcnThemes, {
    fields: [shadcnThemes.forkedFromId],
    references: [shadcnThemes.id],
  }),
}));

export type ShadcnThemeSelect = typeof shadcnThemes.$inferSelect;
