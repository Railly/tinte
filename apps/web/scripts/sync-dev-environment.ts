import { clerkClient } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

// Load dev environment
config();

const sql = neon(process.env.DATABASE_URL!);

async function syncDevEnvironment() {
  console.log("🔄 Starting dev environment sync...\n");

  try {
    // Step 1: Sync users from Clerk
    console.log("📥 Step 1: Fetching users from Clerk (dev)...");
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({ limit: 500 });
    console.log(`Found ${clerkUsers.data.length} users in Clerk\n`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const clerkUser of clerkUsers.data) {
      try {
        const userId = clerkUser.id;
        const email = clerkUser.emailAddresses.find(
          (e) => e.id === clerkUser.primaryEmailAddressId,
        );
        const name =
          clerkUser.fullName ||
          clerkUser.firstName ||
          clerkUser.lastName ||
          null;

        // Check if user exists
        const existingUser = await sql`
          SELECT id FROM "user" WHERE id = ${userId}
        `;

        // Check if email exists
        const existingEmail = email?.emailAddress
          ? await sql`SELECT id FROM "user" WHERE email = ${email.emailAddress}`
          : [];

        if (existingUser.length > 0) {
          // Update
          await sql`
            UPDATE "user"
            SET
              name = ${name},
              email = ${email?.emailAddress || null},
              email_verified = ${email?.verification?.status === "verified"},
              image = ${clerkUser.imageUrl || null},
              updated_at = NOW()
            WHERE id = ${userId}
          `;
          updated++;
          console.log(`✓ Updated: ${email?.emailAddress || userId}`);
        } else if (existingEmail.length > 0) {
          // Skip if email exists with different ID
          skipped++;
          console.log(
            `⚠ Skipped: ${email?.emailAddress} (email already exists)`,
          );
        } else {
          // Create
          await sql`
            INSERT INTO "user" (id, name, email, email_verified, image, created_at, updated_at)
            VALUES (
              ${userId},
              ${name},
              ${email?.emailAddress || null},
              ${email?.verification?.status === "verified"},
              ${clerkUser.imageUrl || null},
              ${new Date(clerkUser.createdAt)},
              NOW()
            )
          `;
          created++;
          console.log(`+ Created: ${email?.emailAddress || userId}`);
        }
      } catch (error) {
        console.error(`❌ Error syncing user ${clerkUser.id}:`, error);
      }
    }

    console.log(`\n✅ User sync completed:`);
    console.log(`   - Created: ${created}`);
    console.log(`   - Updated: ${updated}`);
    console.log(`   - Skipped: ${skipped}`);

    // Step 2: Check theme ownership
    console.log("\n🔍 Step 2: Checking theme ownership...");

    const allThemes = await sql`
      SELECT id, name, slug, user_id
      FROM "theme"
      ORDER BY created_at DESC
    `;

    console.log(`Total themes: ${allThemes.length}`);

    const allUsers = await sql`SELECT id FROM "user"`;
    const userIds = new Set(allUsers.map((u) => u.id));

    const orphanedThemes = allThemes.filter(
      (theme) => theme.user_id && !userIds.has(theme.user_id),
    );
    const anonymousThemes = allThemes.filter((theme) => !theme.user_id);
    const validThemes = allThemes.filter(
      (theme) => theme.user_id && userIds.has(theme.user_id),
    );

    console.log(`\n📊 Theme ownership status:`);
    console.log(`   - Valid themes (user exists): ${validThemes.length}`);
    console.log(
      `   - Orphaned themes (user doesn't exist): ${orphanedThemes.length}`,
    );
    console.log(
      `   - Anonymous themes (no user_id): ${anonymousThemes.length}`,
    );

    // Step 3: Delete orphaned themes
    if (orphanedThemes.length > 0) {
      console.log(`\n🗑️  Step 3: Deleting orphaned themes...`);
      console.log(`\nOrphaned themes to delete:`);
      for (const theme of orphanedThemes) {
        console.log(
          `   - ${theme.name} (${theme.slug}) - owner: ${theme.user_id}`,
        );
      }

      const orphanedIds = orphanedThemes.map((t) => t.id);

      await sql`
        DELETE FROM "theme"
        WHERE id = ANY(${orphanedIds})
      `;

      console.log(`\n✅ Deleted ${orphanedThemes.length} orphaned themes`);
    } else {
      console.log(`\n✅ Step 3: No orphaned themes to delete`);
    }

    console.log(`\n🎉 Dev environment sync completed!`);
    console.log(`\n📝 Summary:`);
    console.log(`   - Users synced: ${created + updated}`);
    console.log(`   - Valid themes: ${validThemes.length}`);
    console.log(`   - Orphaned themes deleted: ${orphanedThemes.length}`);
    console.log(`   - Anonymous themes kept: ${anonymousThemes.length}`);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    throw error;
  }
}

syncDevEnvironment();
