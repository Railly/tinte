import { eq, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { customAlphabet } from "nanoid";

import { db } from "@/db";
import * as schema from "@/db/schema";

const generateId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10,
);

const getSlugId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6,
);

const BATCH_SIZE = 200;

try {
  const users = await db
    .select({ id: schema.user.id, clerk_id: schema.user.clerk_id })
    .from(schema.user)
    .limit(2000);

  const legacyDB = drizzle(process.env.LEGACY_DATABASE_URL!);

  let offset = 0;

  while (true) {
    const themes = await legacyDB.execute<{
      xata_id: string;
      xata_version: number;
      xata_createdat: string;
      xata_updatedat: string;

      User: string | null;
      name: string;
      display_name: string;
      is_public: boolean;
      author_clerk_id: string | null;

      light_text: string;
      light_text_2: string;
      light_text_3: string;
      light_interface: string;
      light_interface_2: string;
      light_interface_3: string;
      light_background: string;
      light_background_2: string;
      light_primary: string;
      light_secondary: string;
      light_accent: string;
      light_accent_2: string;
      light_accent_3: string;

      dark_text: string;
      dark_text_2: string;
      dark_text_3: string;
      dark_interface: string;
      dark_interface_2: string;
      dark_interface_3: string;
      dark_background: string;
      dark_background_2: string;
      dark_primary: string;
      dark_secondary: string;
      dark_accent: string;
      dark_accent_2: string;
      dark_accent_3: string;
    }>(
      sql`
        SELECT 
            "Themes".*,
            "author"."clerk_id" AS "author_clerk_id",

            "light_palette"."text" AS "light_text",
            "light_palette"."text_2" AS "light_text_2",
            "light_palette"."text_3" AS "light_text_3",
            "light_palette"."interface" AS "light_interface",
            "light_palette"."interface_2" AS "light_interface_2",
            "light_palette"."interface_3" AS "light_interface_3",
            "light_palette"."background" AS "light_background",
            "light_palette"."background_2" AS "light_background_2",
            "light_palette"."primary" AS "light_primary",
            "light_palette"."secondary" AS "light_secondary",
            "light_palette"."accent" AS "light_accent",
            "light_palette"."accent_2" AS "light_accent_2",
            "light_palette"."accent_3" AS "light_accent_3",

            "dark_palette"."text" AS "dark_text",
            "dark_palette"."text_2" AS "dark_text_2",
            "dark_palette"."text_3" AS "dark_text_3",
            "dark_palette"."interface" AS "dark_interface",
            "dark_palette"."interface_2" AS "dark_interface_2",
            "dark_palette"."interface_3" AS "dark_interface_3",
            "dark_palette"."background" AS "dark_background",
            "dark_palette"."background_2" AS "dark_background_2",
            "dark_palette"."primary" AS "dark_primary",
            "dark_palette"."secondary" AS "dark_secondary",
            "dark_palette"."accent" AS "dark_accent",
            "dark_palette"."accent_2" AS "dark_accent_2",
            "dark_palette"."accent_3" AS "dark_accent_3"

        FROM "Themes" 

        LEFT JOIN "Users" as "author"
            ON "Themes"."User" = "author"."xata_id"
        LEFT JOIN "ThemePalettes" as "light_palette" 
            ON "light_palette"."theme" = "Themes"."xata_id" AND "light_palette"."mode" = 'light'
        LEFT JOIN "ThemePalettes" as "dark_palette" 
            ON "dark_palette"."theme" = "Themes"."xata_id" AND "dark_palette"."mode" = 'dark'
        
        
        ORDER BY "Themes"."xata_createdat" DESC

        LIMIT ${BATCH_SIZE} 

        OFFSET ${offset}`,
    );

    if (themes.count === 0) {
      break;
    }

    console.log(themes.map((theme) => theme.name));

    const existingThemes = await db
      .select({
        id: schema.theme.id,
        legacy_id: schema.theme.legacy_id,
        slug: schema.theme.slug,
      })
      .from(schema.theme)
      .where(
        inArray(
          schema.theme.slug,
          themes.map((theme) => theme.name),
        ),
      );

    const alreadyExistsInDB = (slug: string) =>
      existingThemes.some((theme) => theme.slug === slug);
    const thereAreDuplicates = (slug: string) =>
      themes.filter((theme) => theme.name === slug).length > 1;

    const result = await db
      .insert(schema.theme)
      .values(
        themes.map(
          (theme) =>
            ({
              id: generateId(),
              legacy_id: theme.xata_id,
              name: theme.display_name,
              slug: alreadyExistsInDB(theme.name)
                ? `${theme.name}-${getSlugId()}`
                : thereAreDuplicates(theme.name)
                  ? `${theme.name}-${getSlugId()}`
                  : theme.name,
              is_public: theme.is_public,

              light_bg: theme.light_background,
              light_bg_2: theme.light_background_2,
              light_ui: theme.light_interface,
              light_ui_2: theme.light_interface_2,
              light_ui_3: theme.light_interface_3,
              light_tx: theme.light_text,
              light_tx_2: theme.light_text_2,
              light_tx_3: theme.light_text_3,
              light_pr: theme.light_primary,
              light_sc: theme.light_secondary,
              light_ac_1: theme.light_accent,
              light_ac_2: theme.light_accent_2,
              light_ac_3: theme.light_accent_3,

              dark_bg: theme.dark_background,
              dark_bg_2: theme.dark_background_2,
              dark_ui: theme.dark_interface,
              dark_ui_2: theme.dark_interface_2,
              dark_ui_3: theme.dark_interface_3,
              dark_tx: theme.dark_text,
              dark_tx_2: theme.dark_text_2,
              dark_tx_3: theme.dark_text_3,
              dark_pr: theme.dark_primary,
              dark_sc: theme.dark_secondary,
              dark_ac_1: theme.dark_accent,
              dark_ac_2: theme.dark_accent_2,
              dark_ac_3: theme.dark_accent_3,

              created_at: new Date(theme.xata_createdat),
              updated_at: new Date(theme.xata_updatedat),

              user_id: users.find(
                (user) => user.clerk_id === theme.author_clerk_id,
              )?.id,
            }) satisfies schema.ThemeInsert,
        ),
      )
      .onConflictDoNothing({
        target: schema.theme.legacy_id,
      });

    console.log("Inserted themes: ", result.rowCount);

    offset += BATCH_SIZE;
  }
} catch (error) {
  console.error(error);
} finally {
  process.exit(0);
}
