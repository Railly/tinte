CREATE TABLE "themes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"user_id" text NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "themes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Public themes are viewable by anyone" ON "themes" AS PERMISSIVE FOR SELECT TO "anon" USING ("themes"."public" = true);--> statement-breakpoint
CREATE POLICY "Users can view their own themes or public themes" ON "themes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("themes"."user_id" = (auth.jwt()->>'sub') OR "themes"."public" = true);--> statement-breakpoint
CREATE POLICY "Users can insert only their own themes" ON "themes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("themes"."user_id" = (auth.jwt()->>'sub'));--> statement-breakpoint
CREATE POLICY "Users can update only their own themes" ON "themes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("themes"."user_id" = (auth.jwt()->>'sub')) WITH CHECK ("themes"."user_id" = (auth.jwt()->>'sub'));--> statement-breakpoint
CREATE POLICY "Users can delete only their own themes" ON "themes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("themes"."user_id" = (auth.jwt()->>'sub'));