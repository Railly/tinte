// @ts-nocheck
import { vsCodeThemes, users } from "@/db/schema";
import { xataDB } from "./src/db/legacy";
import { inArray, sql } from "drizzle-orm";
import { db } from "./src/db";

const main = async () => {
  const themes = await xataDB.execute(sql`
    SELECT
  *
FROM
  "Themes";
  `);

  for (const theme of themes.rows) {
    try {
      const palettes = await xataDB.execute(sql`
        SELECT * FROM "ThemePalettes" WHERE "theme" = ${theme.xata_id}
      `);
      for (const palette of palettes.rows) {
        console.log(
          `${theme.display_name} - ${palette.mode} - ${palette.text}`
        );
      }

      const cleanTheme = {
        id: theme.xata_id.replace("rec_", ""),
        userId: theme.User,

        name: theme.display_name,
        isPublic: theme.is_public,
        category: theme.category,

        light: {
          ...palettes.rows.find((p) => p.mode === "light"),
          mode: undefined,
          theme: undefined,
          xata_id: undefined,
          xata_version: undefined,
          xata_createdat: undefined,
          xata_updatedat: undefined,
        },
        dark: {
          ...palettes.rows.find((p) => p.mode === "dark"),
          mode: undefined,
          theme: undefined,
          xata_id: undefined,
          xata_version: undefined,
          xata_createdat: undefined,
          xata_updatedat: undefined,
        },

        createdAt: new Date(theme.xata_createdat),
        updatedAt: new Date(theme.xata_updatedat),
      };

      console.log(cleanTheme);
      await db.insert(vsCodeThemes).values(cleanTheme);
    } catch (error) {
      console.error(error);
    }

    console.log("--------------------------------");
  }

  console.log("done");
};

await main();
