import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export const brandKitStatus = pgEnum("brand_kit_status", [
  "queued",
  "generating",
  "completed",
  "failed",
]);

export const brandKitPaidTier = pgEnum("brand_kit_paid_tier", [
  "kit_pro",
  "kit_pack_5",
]);

export const brandKitAssetType = pgEnum("brand_kit_asset_type", [
  "logo",
  "logo_variation",
  "moodboard",
  "bento",
  "icon_set",
  "hero",
  "mockup_product",
  "lifestyle",
  "urban_campaign",
  "app_interface",
  "social_visual",
  "tokens_json",
  "tinte_theme",
  "zip_hd",
]);

export const polarOrderStatus = pgEnum("polar_order_status", [
  "pending",
  "completed",
  "refunded",
  "failed",
]);

export const brandKits = pgTable("brand_kits", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  advanced: jsonb("advanced").$type<Record<string, JsonValue>>(),
  prompts: jsonb("prompts").$type<Record<string, JsonValue>>(),
  status: brandKitStatus("status").notNull().default("queued"),
  trigger_run_id: text("trigger_run_id"),
  is_public: boolean("is_public").notNull().default(true),
  is_paid: boolean("is_paid").notNull().default(false),
  paid_tier: brandKitPaidTier("paid_tier"),
  polar_order_id: text("polar_order_id"),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expires_at: timestamp("expires_at", { withTimezone: true }).default(
    sql`now() + interval '7 days'`,
  ),
});

export const brandKitAssets = pgTable("brand_kit_assets", {
  id: text("id").primaryKey(),
  kit_id: text("kit_id")
    .notNull()
    .references(() => brandKits.id, { onDelete: "cascade" }),
  type: brandKitAssetType("type").notNull(),
  url: text("url").notNull(),
  metadata: jsonb("metadata").$type<Record<string, JsonValue>>(),
  is_premium: boolean("is_premium").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const polarOrders = pgTable("polar_orders", {
  id: text("id").primaryKey(),
  kit_id: text("kit_id")
    .notNull()
    .references(() => brandKits.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull(),
  product_id: text("product_id").notNull(),
  amount_cents: integer("amount_cents").notNull(),
  currency: text("currency").notNull(),
  status: polarOrderStatus("status").notNull().default("pending"),
  raw_payload: jsonb("raw_payload").$type<Record<string, JsonValue>>(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type BrandKit = typeof brandKits.$inferSelect;
export type BrandKitAsset = typeof brandKitAssets.$inferSelect;
export type PolarOrder = typeof polarOrders.$inferSelect;
