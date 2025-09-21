import { readFileSync } from "fs";
import { customAlphabet } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema/user";

const generateId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10,
);

interface CSVUser {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  primary_email_address: string;
  primary_phone_number: string;
  verified_email_addresses: string;
  unverified_email_addresses: string;
  verified_phone_numbers: string;
  unverified_phone_numbers: string;
  totp_secret: string;
  password_digest: string;
  password_hasher: string;
}

function parseCSV(filePath: string): CSVUser[] {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const user: any = {};
    
    headers.forEach((header, index) => {
      user[header] = values[index] || '';
    });
    
    return user as CSVUser;
  });
}

async function migrateUsers() {
  console.log("🚀 Starting CSV user migration...");

  try {
    // 1. Parse CSV file
    const csvPath = "./public/ins_2jOu3IjMiolBWlhZq26j2nFLGvZ.csv";
    const csvUsers = parseCSV(csvPath);
    console.log(`📊 Found ${csvUsers.length} users in CSV`);

    // 2. Get existing users
    console.log("🔍 Fetching existing users...");
    const existingUsers = await db.select().from(user);
    console.log(`📊 Found ${existingUsers.length} existing users`);

    let updatedCount = 0;
    let insertedCount = 0;

    // 3. Process each CSV user
    for (const csvUser of csvUsers) {
      if (!csvUser.id || !csvUser.primary_email_address) continue;

      const fullName = [csvUser.first_name, csvUser.last_name]
        .filter(Boolean)
        .join(' ') || csvUser.username || 'Unknown User';

      // Check if user exists by clerk_id
      const existingUser = existingUsers.find(u => u.clerk_id === csvUser.id);

      const isEmailVerified = Boolean(csvUser.verified_email_addresses && 
                                      csvUser.verified_email_addresses.includes(csvUser.primary_email_address));

      if (existingUser) {
        // Update existing user
        await db
          .update(user)
          .set({
            name: fullName,
            email: csvUser.primary_email_address,
            email_verified: isEmailVerified,
            clerk_id: csvUser.id,
            updated_at: new Date(),
          })
          .where(eq(user.id, existingUser.id));
        
        updatedCount++;
        console.log(`✅ Updated: ${csvUser.id} (${csvUser.username || csvUser.primary_email_address})`);
      } else {
        // Insert new user
        await db.insert(user).values({
          id: generateId(),
          name: fullName,
          email: csvUser.primary_email_address,
          email_verified: isEmailVerified,
          image: null,
          clerk_id: csvUser.id,
        });
        
        insertedCount++;
        console.log(`✅ Inserted: ${csvUser.id} (${csvUser.username || csvUser.primary_email_address})`);
      }
    }

    console.log(`🎉 Migration completed successfully!`);
    console.log(`📊 Updated: ${updatedCount} users`);
    console.log(`📊 Inserted: ${insertedCount} users`);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateUsers()
  .then(() => {
    console.log("✅ Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration script failed:", error);
    process.exit(1);
  });