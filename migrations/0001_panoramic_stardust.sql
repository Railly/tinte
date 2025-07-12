ALTER TABLE "themes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "themes" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "themes" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "themes" ADD COLUMN "public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "themes" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint

-- Update existing rows with default content
UPDATE "themes" SET "content" = '{"type": "theme", "name": "' || "name" || '", "colors": {}}' WHERE "content" IS NULL;--> statement-breakpoint

-- Now make content NOT NULL
ALTER TABLE "themes" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint

CREATE POLICY "themes_select_policy" ON "themes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("themes"."user_id" = auth.uid() OR "themes"."public" = true);--> statement-breakpoint
CREATE POLICY "themes_insert_policy" ON "themes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("themes"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "themes_update_policy" ON "themes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("themes"."user_id" = auth.uid()) WITH CHECK ("themes"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "themes_delete_policy" ON "themes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("themes"."user_id" = auth.uid());