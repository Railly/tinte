CREATE TYPE "public"."editor_target" AS ENUM('vscode', 'cursor', 'zed', 'vim', 'shadcn');--> statement-breakpoint
CREATE TYPE "public"."input_type" AS ENUM('prompt', 'image', 'url', 'file');--> statement-breakpoint
CREATE TYPE "public"."vis" AS ENUM('public', 'private', 'unlisted');--> statement-breakpoint
CREATE TABLE "palette_inputs" (
	"paletteVersionId" bigserial NOT NULL,
	"idx" smallint NOT NULL,
	"type" "input_type",
	"value" text
);
--> statement-breakpoint
ALTER TABLE "palette_inputs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "palette_versions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"projectId" uuid NOT NULL,
	"version" integer NOT NULL,
	"tokensJson" jsonb NOT NULL,
	"changelog" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "palette_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projectId" uuid NOT NULL,
	"tokenHash" text,
	"permission" "vis" DEFAULT 'unlisted',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_shares_tokenHash_unique" UNIQUE("tokenHash")
);
--> statement-breakpoint
ALTER TABLE "project_shares" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_stars" (
	"projectId" uuid NOT NULL,
	"userId" text NOT NULL,
	"starredAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_stars" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"visibility" "vis" DEFAULT 'private',
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "variant_versions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"paletteVersionId" bigserial NOT NULL,
	"target" "editor_target" NOT NULL,
	"specJson" jsonb,
	"triggerRunId" text,
	"status" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "variant_versions_triggerRunId_unique" UNIQUE("triggerRunId")
);
--> statement-breakpoint
ALTER TABLE "variant_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "palette_inputs" ADD CONSTRAINT "palette_inputs_paletteVersionId_palette_versions_id_fk" FOREIGN KEY ("paletteVersionId") REFERENCES "public"."palette_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "palette_versions" ADD CONSTRAINT "palette_versions_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_shares" ADD CONSTRAINT "project_shares_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_stars" ADD CONSTRAINT "project_stars_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_versions" ADD CONSTRAINT "variant_versions_paletteVersionId_palette_versions_id_fk" FOREIGN KEY ("paletteVersionId") REFERENCES "public"."palette_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Users can view palette inputs for accessible palette versions" ON "palette_inputs" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "palette_versions" pv
        JOIN "projects" p ON p.id = pv."projectId"
        WHERE pv.id = "palette_inputs"."paletteVersionId"
        AND (p."userId" = (auth.jwt()->>'sub') OR p.visibility IN ('public', 'unlisted'))
      ));--> statement-breakpoint
CREATE POLICY "Anonymous users can view palette inputs for public projects" ON "palette_inputs" AS PERMISSIVE FOR SELECT TO "anon" USING (EXISTS (
        SELECT 1 FROM "palette_versions" pv
        JOIN "projects" p ON p.id = pv."projectId"
        WHERE pv.id = "palette_inputs"."paletteVersionId"
        AND p.visibility = 'public'
      ));--> statement-breakpoint
CREATE POLICY "Users can insert palette inputs for their own projects" ON "palette_inputs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM "palette_versions" pv
        JOIN "projects" p ON p.id = pv."projectId"
        WHERE pv.id = "palette_inputs"."paletteVersionId"
        AND p."userId" = (auth.jwt()->>'sub')
      ));--> statement-breakpoint
CREATE POLICY "Users can view palette versions for their projects or public projects" ON "palette_versions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "projects" p 
        WHERE p.id = "palette_versions"."projectId" 
        AND (p."userId" = (auth.jwt()->>'sub') OR p.visibility IN ('public', 'unlisted'))
      ));--> statement-breakpoint
CREATE POLICY "Anonymous users can view palette versions for public projects" ON "palette_versions" AS PERMISSIVE FOR SELECT TO "anon" USING (EXISTS (
        SELECT 1 FROM "projects" p 
        WHERE p.id = "palette_versions"."projectId" 
        AND p.visibility = 'public'
      ));--> statement-breakpoint
CREATE POLICY "Users can insert palette versions for their own projects" ON "palette_versions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM "projects" p 
        WHERE p.id = "palette_versions"."projectId" 
        AND p."userId" = (auth.jwt()->>'sub')
      ));--> statement-breakpoint
CREATE POLICY "Users can manage shares for their own projects" ON "project_shares" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "projects" p 
        WHERE p.id = "project_shares"."projectId" 
        AND p."userId" = (auth.jwt()->>'sub')
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM "projects" p 
        WHERE p.id = "project_shares"."projectId" 
        AND p."userId" = (auth.jwt()->>'sub')
      ));--> statement-breakpoint
CREATE POLICY "Users can manage their own stars" ON "project_stars" AS PERMISSIVE FOR ALL TO "authenticated" USING ("project_stars"."userId" = (auth.jwt()->>'sub')) WITH CHECK ("project_stars"."userId" = (auth.jwt()->>'sub'));--> statement-breakpoint
CREATE POLICY "Anyone can view stars for accessible projects" ON "project_stars" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (EXISTS (
        SELECT 1 FROM "projects" p 
        WHERE p.id = "project_stars"."projectId" 
        AND p.visibility IN ('public', 'unlisted')
      ));--> statement-breakpoint
CREATE POLICY "Public projects are viewable by anyone" ON "projects" AS PERMISSIVE FOR SELECT TO "anon" USING ("projects"."visibility" = 'public');--> statement-breakpoint
CREATE POLICY "Users can view their own projects or public projects" ON "projects" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("projects"."userId" = (auth.jwt()->>'sub') OR "projects"."visibility" IN ('public', 'unlisted'));--> statement-breakpoint
CREATE POLICY "Users can insert only their own projects" ON "projects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("projects"."userId" = (auth.jwt()->>'sub'));--> statement-breakpoint
CREATE POLICY "Users can update only their own projects" ON "projects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("projects"."userId" = (auth.jwt()->>'sub')) WITH CHECK ("projects"."userId" = (auth.jwt()->>'sub'));--> statement-breakpoint
CREATE POLICY "Users can delete only their own projects" ON "projects" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("projects"."userId" = (auth.jwt()->>'sub'));--> statement-breakpoint
CREATE POLICY "Users can view variant versions for accessible palette versions" ON "variant_versions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "palette_versions" pv
        JOIN "projects" p ON p.id = pv."projectId"
        WHERE pv.id = "variant_versions"."paletteVersionId"
        AND (p."userId" = (auth.jwt()->>'sub') OR p.visibility IN ('public', 'unlisted'))
      ));--> statement-breakpoint
CREATE POLICY "Anonymous users can view variant versions for public projects" ON "variant_versions" AS PERMISSIVE FOR SELECT TO "anon" USING (EXISTS (
        SELECT 1 FROM "palette_versions" pv
        JOIN "projects" p ON p.id = pv."projectId"
        WHERE pv.id = "variant_versions"."paletteVersionId"
        AND p.visibility = 'public'
      ));--> statement-breakpoint
CREATE POLICY "Users can insert/update variant versions for their own projects" ON "variant_versions" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "palette_versions" pv
        JOIN "projects" p ON p.id = pv."projectId"
        WHERE pv.id = "variant_versions"."paletteVersionId"
        AND p."userId" = (auth.jwt()->>'sub')
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM "palette_versions" pv
        JOIN "projects" p ON p.id = pv."projectId"
        WHERE pv.id = "variant_versions"."paletteVersionId"
        AND p."userId" = (auth.jwt()->>'sub')
      ));