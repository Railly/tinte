import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import z from "zod";

import { user } from "./user";

export const shadcnPaletteSchema = z.object({
  background: z.string(),
  foreground: z.string(),

  card: z.string(),
  "card-foreground": z.string(),

  popover: z.string(),
  "popover-foreground": z.string(),

  primary: z.string(),
  "primary-foreground": z.string(),

  secondary: z.string(),
  "secondary-foreground": z.string(),

  muted: z.string(),
  "muted-foreground": z.string(),

  accent: z.string(),
  "accent-foreground": z.string(),

  destructive: z.string(),
  "destructive-foreground": z.string(),

  border: z.string(),
  input: z.string(),
  ring: z.string(),

  "chart-1": z.string(),
  "chart-2": z.string(),
  "chart-3": z.string(),
  "chart-4": z.string(),
  "chart-5": z.string(),

  sidebar: z.string(),
  "sidebar-foreground": z.string(),
  "sidebar-primary": z.string(),
  "sidebar-primary-foreground": z.string(),
  "sidebar-accent": z.string(),
  "sidebar-accent-foreground": z.string(),
  "sidebar-border": z.string(),
  "sidebar-ring": z.string(),
});

export const shadcnOverrideSchema = z.object({
  palettes: z.object({
    light: shadcnPaletteSchema,
    dark: shadcnPaletteSchema,
  }),
  fonts: z.object({
    sans: z.string(),
    serif: z.string(),
    mono: z.string(),
  }),
  radius: z.string(),
  shadow: z.object({
    color: z.string(),
    opacity: z.string(),
    blur: z.string(),
    spread: z.string(),
    offset_x: z.string(),
    offset_y: z.string(),
  }),
  letter_spacing: z.string(),
});

export type ShadcnOverrideSchema = z.infer<typeof shadcnOverrideSchema>;

export const theme = pgTable("theme", {
  id: text("id").primaryKey(),
  legacy_id: text("legacy_id").unique().notNull(),

  user_id: text("user_id").references(() => user.id),

  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  concept: text("concept"), // AI-generated theme description/mood

  // Light mode
  light_bg: text("light_bg").notNull(),
  light_bg_2: text("light_bg_2").notNull(),

  light_ui: text("light_ui").notNull(),
  light_ui_2: text("light_ui_2").notNull(),
  light_ui_3: text("light_ui_3").notNull(),

  light_tx: text("light_tx").notNull(),
  light_tx_2: text("light_tx_2").notNull(),
  light_tx_3: text("light_tx_3").notNull(),

  light_pr: text("light_pr").notNull(),
  light_sc: text("light_sc").notNull(),

  light_ac_1: text("light_ac_1").notNull(),
  light_ac_2: text("light_ac_2").notNull(),
  light_ac_3: text("light_ac_3").notNull(),

  // Dark mode
  dark_bg: text("dark_bg").notNull(),
  dark_bg_2: text("dark_bg_2").notNull(),

  dark_ui: text("dark_ui").notNull(),
  dark_ui_2: text("dark_ui_2").notNull(),
  dark_ui_3: text("dark_ui_3").notNull(),

  dark_tx: text("dark_tx").notNull(),
  dark_tx_2: text("dark_tx_2").notNull(),
  dark_tx_3: text("dark_tx_3").notNull(),

  dark_pr: text("dark_pr").notNull(),
  dark_sc: text("dark_sc").notNull(),

  dark_ac_1: text("dark_ac_1").notNull(),
  dark_ac_2: text("dark_ac_2").notNull(),
  dark_ac_3: text("dark_ac_3").notNull(),

  is_public: boolean("is_public").notNull().default(true),
  installs: integer("installs").notNull().default(0),

  // Overrides
  shadcn_override: jsonb("shadcn_override").$type<ShadcnOverrideSchema>(),
  vscode_override: jsonb("vscode_override"),
  shiki_override: jsonb("shiki_override"),

  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ThemeSelect = typeof theme.$inferSelect;
export type ThemeInsert = typeof theme.$inferInsert;
