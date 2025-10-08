import { clerkClient } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config();

const sql = neon(process.env.DATABASE_URL!);

async function syncClerkUsers() {
  console.log("Starting Clerk user sync...\n");

  try {
    const client = await clerkClient();

    // Get all users from Clerk
    console.log("Fetching users from Clerk...");
    const clerkUsers = await client.users.getUserList({ limit: 500 });

    console.log(`Found ${clerkUsers.data.length} users in Clerk\n`);

    let synced = 0;
    let updated = 0;
    let created = 0;
    const replaced = 0;

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

        // Check if user exists by Clerk ID
        const existingUser = await sql`
          SELECT id FROM "user" WHERE id = ${userId}
        `;

        // Check if email already exists
        const existingEmail = email?.emailAddress
          ? await sql`SELECT id FROM "user" WHERE email = ${email.emailAddress}`
          : [];

        if (existingUser.length > 0) {
          // Update existing user
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
          console.log(`✓ Updated user: ${email?.emailAddress || userId}`);
        } else if (existingEmail.length > 0) {
          // Email already exists - skip this user
          console.log(
            `⚠ Skipping ${email?.emailAddress} - email already exists with ID ${existingEmail[0].id}`,
          );
          synced++;
          continue;
        } else {
          // Create new user
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
          console.log(`+ Created user: ${email?.emailAddress || userId}`);
        }

        synced++;
      } catch (error) {
        console.error(`❌ Error syncing user ${clerkUser.id}:`, error);
        // Continue with next user
      }
    }

    console.log(`\n✅ Sync completed:`);
    console.log(`   - Total synced: ${synced}`);
    console.log(`   - Created: ${created}`);
    console.log(`   - Updated: ${updated}`);
    console.log(`   - Replaced: ${replaced}`);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    throw error;
  }
}

syncClerkUsers();
