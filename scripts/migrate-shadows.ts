import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { sql } from "drizzle-orm";

/**
 * Migration script to move shadow properties from top-level to palettes.light/dark
 *
 * Before:
 * {
 *   "shadow": { "color": "...", ... },
 *   "palettes": { "light": {...}, "dark": {...} }
 * }
 *
 * After:
 * {
 *   "palettes": {
 *     "light": { ..., "shadow": { "color": "...", ... } },
 *     "dark": { ..., "shadow": { "color": "...", ... } }
 *   }
 * }
 */

async function migrateShadows() {
  console.log("🚀 Starting shadow migration...");

  // Fetch all themes with shadcn_override
  const themes = await db
    .select({
      id: theme.id,
      name: theme.name,
      shadcn_override: theme.shadcn_override,
    })
    .from(theme)
    .where(sql`${theme.shadcn_override} IS NOT NULL`);

  console.log(`📊 Found ${themes.length} themes with shadcn_override`);

  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const themeRecord of themes) {
    const override = themeRecord.shadcn_override as any;

    // Skip if no top-level shadow
    if (!override.shadow) {
      console.log(`⏭️  Skipping ${themeRecord.name} - no top-level shadow`);
      skippedCount++;
      continue;
    }

    // Skip if shadow is already in palettes
    if (override.palettes?.light?.shadow || override.palettes?.dark?.shadow) {
      console.log(`⏭️  Skipping ${themeRecord.name} - shadow already in palettes`);
      skippedCount++;
      continue;
    }

    try {
      const topLevelShadow = override.shadow;

      // Create new structure with shadow in both palettes
      const migratedOverride = {
        ...override,
        palettes: {
          light: {
            ...(override.palettes?.light || {}),
            shadow: topLevelShadow,
          },
          dark: {
            ...(override.palettes?.dark || {}),
            shadow: topLevelShadow,
          },
        },
      };

      // Remove top-level shadow
      delete migratedOverride.shadow;

      // Update in database
      await db
        .update(theme)
        .set({
          shadcn_override: migratedOverride as any,
          updated_at: new Date(),
        })
        .where(sql`${theme.id} = ${themeRecord.id}`);

      console.log(`✅ Migrated ${themeRecord.name}`);
      migratedCount++;
    } catch (error) {
      console.error(`❌ Error migrating ${themeRecord.name}:`, error);
      errorCount++;
    }
  }

  console.log("\n📈 Migration Summary:");
  console.log(`✅ Migrated: ${migratedCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total: ${themes.length}`);

  console.log("\n✨ Migration complete!");
}

// Run migration
migrateShadows()
  .then(() => {
    console.log("🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  });
