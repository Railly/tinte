ALTER TABLE "shadcn_themes" ALTER COLUMN "display_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shadcn_themes" ALTER COLUMN "radius" SET DEFAULT '0.5';--> statement-breakpoint
ALTER TABLE "shadcn_themes" ADD COLUMN "forked_from_id" text;--> statement-breakpoint
ALTER TABLE "shadcn_themes" ADD CONSTRAINT "shadcn_themes_forked_from_id_shadcn_themes_id_fk" FOREIGN KEY ("forked_from_id") REFERENCES "public"."shadcn_themes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shadcn_themes" DROP COLUMN "theme_version";--> statement-breakpoint
ALTER TABLE "shadcn_themes" DROP COLUMN "fonts";--> statement-breakpoint
ALTER TABLE "shadcn_themes" DROP COLUMN "space";--> statement-breakpoint
ALTER TABLE "shadcn_themes" DROP COLUMN "shadow";--> statement-breakpoint
ALTER TABLE "shadcn_themes" DROP COLUMN "icons";