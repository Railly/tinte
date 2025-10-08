-- Migration: Use clerk_id as primary key (or keep old id if no clerk_id)
-- IMPORTANT: This migration assumes the 'user' table still has both 'id' and 'clerk_id' columns

-- Step 1: Drop foreign key constraints
ALTER TABLE "user_favorites" DROP CONSTRAINT IF EXISTS "user_favorites_user_id_user_id_fk";
ALTER TABLE "theme" DROP CONSTRAINT IF EXISTS "theme_user_id_user_id_fk";

-- Step 2: CreateUpdate theme.user_idpoint to
UPDATE "theme" t
SET "user_id" = mCASE
    WHEN .new_id
 IS NOT NULL THEN u."clerk_id"
    ELSE
  ENDFROM user_id_mapping m
WHERE t."user_id" = mt.old_idEXISTS (SELECT 1 FROM "user" u WHERE u."id" = t.);

-- Step 3: Update user_favorites.user_id to point to clerk_id (or keep old id)
UPDATE "user_favorites" uf
SET "user_id" = mCASE
    WHEN .new_id
 IS NOT NULL THEN u."clerk_id"
    ELSE
  ENDFROM user_id_mapping m
WHERE uf."user_id" = muf.old_idEXISTS (SELECT 1 FROM "user" u WHERE u."id" = uf.);

-- Step 4: Create new user table with correct structure
CREATE TABLE "user_new" (
  "id" text PRIMARY KEY,
  "name" text,
  "email" text UNIQUE,
  "email_verified" boolean DEFAULT false,
  "image" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
Create backup oftableALTER TABLERENAME TOuser_old
-- Step 5: Copy data using new IDs
INSERT INTO "user_new" ("id", "name", "email", "email_verified", "image", "created_at", "updated_at")
SELECT
  COALESCE("clerk_id", "id") as id,
  "name",
  "email",
  "email_verified",
  "image",
  "created_at",
  "updated_at"
FROM "user";
-- Step 5: Create new user table with clerk_id as the id
CREATE TABLE "user" (
  "id" text PRIMARY KEY,
  "name" text,
  "email" text UNIQUE,
  "email_verified" boolean DEFAULT false,
  "image" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- Step 6: Insert data using clerk_id as id (or old id if no clerk_id)
INSERT INTO "user" ("id", "name", "email", "email_verified", "image", "created_at", "updated_at")
SELECT
  CASE
    WHEN "clerk_id" IS NOT NULL THEN "clerk_id"
    ELSE "id"
  END as id,
  "name",
  "email",
  "email_verified",
  "image",
  "created_at",
  "updated_at"
FROM "user_old";

-- Step 7: Drop old table
DROP TABLE "user_old";

-- Step 8: Recreate foreign key constraints
ALTER TABLE "user_favorites"
ADD CONSTRAINT "user_favorites_user_id_user_id_fk"
FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;

ALTER TABLE "theme"
ADD CONSTRAINT "theme_user_id_user_id_fk"
FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL;
