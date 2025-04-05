ALTER TABLE "theme_likes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "theme_palettes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "token_colors" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "theme_likes" CASCADE;--> statement-breakpoint
DROP TABLE "theme_palettes" CASCADE;--> statement-breakpoint
DROP TABLE "token_colors" CASCADE;--> statement-breakpoint
ALTER TABLE "themes" RENAME TO "vs_code_themes";--> statement-breakpoint
ALTER TABLE "vs_code_themes" DROP CONSTRAINT "themes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "vs_code_themes" ADD COLUMN "light" jsonb;--> statement-breakpoint
ALTER TABLE "vs_code_themes" ADD COLUMN "dark" jsonb;--> statement-breakpoint
ALTER TABLE "vs_code_themes" ADD CONSTRAINT "vs_code_themes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vs_code_themes" DROP COLUMN "display_name";