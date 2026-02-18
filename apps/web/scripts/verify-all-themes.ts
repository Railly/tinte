import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config();

const sql = neon(process.env.DATABASE_URL!);

async function verifyAllThemes() {
  console.log("🔍 Verifying all themes in database...\n");

  // Get all users
  const allUsers = await sql`SELECT id FROM "user"`;
  const userIds = new Set(allUsers.map((u) => u.id));
  console.log(`Total users in database: ${allUsers.length}`);

  // Get all themes
  const allThemes = await sql`
    SELECT id, name, slug, user_id, created_at
    FROM "theme"
    ORDER BY created_at DESC
  `;
  console.log(`Total themes in database: ${allThemes.length}\n`);

  // Categorize themes
  const validThemes = [];
  const orphanedThemes = [];
  const anonymousThemes = [];

  for (const theme of allThemes) {
    if (!theme.user_id) {
      anonymousThemes.push(theme);
    } else if (userIds.has(theme.user_id)) {
      validThemes.push(theme);
    } else {
      orphanedThemes.push(theme);
    }
  }

  console.log("📊 Theme categorization:");
  console.log(`   ✅ Valid themes (user exists): ${validThemes.length}`);
  console.log(
    `   ❌ Orphaned themes (user doesn't exist): ${orphanedThemes.length}`,
  );
  console.log(`   ⚪ Anonymous themes (no user_id): ${anonymousThemes.length}`);

  if (orphanedThemes.length > 0) {
    console.log(`\n⚠️  Found ${orphanedThemes.length} orphaned themes!`);
    console.log("\nSample orphaned themes (first 10):");
    for (const theme of orphanedThemes.slice(0, 10)) {
      console.log(`   - ${theme.name} (${theme.slug})`);
      console.log(`     user_id: ${theme.user_id}`);
      console.log(`     created: ${theme.created_at}`);
    }

    console.log(
      `\n🗑️  These themes will be deleted because their users don't exist.`,
    );
    console.log("Proceed? (This script will delete them)");
  } else {
    console.log("\n✅ All themes are valid! No orphaned themes found.");
  }

  return { validThemes, orphanedThemes, anonymousThemes };
}

verifyAllThemes()
  .then((result) => {
    console.log("\n✅ Verification complete");
    console.log(`Valid: ${result.validThemes.length}`);
    console.log(`Orphaned: ${result.orphanedThemes.length}`);
    console.log(`Anonymous: ${result.anonymousThemes.length}`);
  })
  .catch(console.error);
