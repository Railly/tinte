CREATE TYPE "public"."brand_kit_asset_type" AS ENUM('logo', 'logo_variation', 'moodboard', 'bento', 'icon_set', 'hero', 'mockup_product', 'lifestyle', 'urban_campaign', 'app_interface', 'social_visual', 'tokens_json', 'tinte_theme', 'zip_hd');--> statement-breakpoint
CREATE TYPE "public"."brand_kit_paid_tier" AS ENUM('kit_pro', 'kit_pack_5');--> statement-breakpoint
CREATE TYPE "public"."brand_kit_status" AS ENUM('queued', 'generating', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."polar_order_status" AS ENUM('pending', 'completed', 'refunded', 'failed');--> statement-breakpoint
CREATE TABLE "brand_kit_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"kit_id" text NOT NULL,
	"type" "brand_kit_asset_type" NOT NULL,
	"url" text NOT NULL,
	"metadata" jsonb,
	"is_premium" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brand_kits" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"advanced" jsonb,
	"prompts" jsonb,
	"status" "brand_kit_status" DEFAULT 'queued' NOT NULL,
	"trigger_run_id" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"paid_tier" "brand_kit_paid_tier",
	"polar_order_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone DEFAULT now() + interval '7 days'
);
--> statement-breakpoint
CREATE TABLE "polar_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"kit_id" text NOT NULL,
	"user_id" text NOT NULL,
	"product_id" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"status" "polar_order_status" DEFAULT 'pending' NOT NULL,
	"raw_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_kit_assets" ADD CONSTRAINT "brand_kit_assets_kit_id_brand_kits_id_fk" FOREIGN KEY ("kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polar_orders" ADD CONSTRAINT "polar_orders_kit_id_brand_kits_id_fk" FOREIGN KEY ("kit_id") REFERENCES "public"."brand_kits"("id") ON DELETE cascade ON UPDATE no action;