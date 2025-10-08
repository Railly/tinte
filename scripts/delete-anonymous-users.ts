import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config();

const sql = neon(process.env.DATABASE_URL!);

async function deleteAnonymousUsers() {
  console.log("Starting anonymous users cleanup...\n");

  try {
    // Find users that don't have Clerk ID format (user_xxxxx)
    // After migration, all valid users should have Clerk IDs as their id
    const anonymousUsers = await sql`
      SELECT id, name, email, created_at
      FROM "user"
      WHERE id NOT LIKE 'user_%'
    `;

    if (anonymousUsers.length === 0) {
      console.log(
        "✓ No anonymous users found. All users have valid Clerk IDs.",
      );
      return;
    }

    console.log(`Found ${anonymousUsers.length} anonymous users:\n`);

    for (const user of anonymousUsers) {
      console.log(
        `  - ${user.id} | ${user.email || "no email"} | ${user.name || "no name"}`,
      );
    }

    console.log("\nChecking their themes and favorites...");

    // Check how many themes they created
    const themesCount = await sql`
      SELECT COUNT(*) as count
      FROM "theme"
      WHERE user_id NOT LIKE 'user_%'
    `;
    console.log(`  - Themes created: ${themesCount[0].count}`);

    // Check how many favorites they have
    const favoritesCount = await sql`
      SELECT COUNT(*) as count
      FROM "user_favorites"
      WHERE user_id NOT LIKE 'user_%'
    `;
    console.log(`  - Favorites: ${favoritesCount[0].count}`);

    console.log("\nDeleting anonymous users and their data...");

    // Delete users (cascades will handle user_favorites, themes will be set to NULL)
    const _result = await sql`
      DELETE FROM "user"
      WHERE id NOT LIKE 'user_%'
    `;

    console.log(`\n✅ Deleted ${anonymousUsers.length} anonymous users`);
    console.log(`   - Their favorites were deleted (cascade)`);
    console.log(`   - Their themes are now anonymous (user_id = NULL)`);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    throw error;
  }
}

deleteAnonymousUsers();
