import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { customAlphabet } from "nanoid";

import { db } from "@/db";
import * as schema from "@/db/schema";

const generateId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10,
);

const BATCH_SIZE = 1000;

try {
  const legacyDB = drizzle(process.env.LEGACY_DATABASE_URL!);

  let offset = 0;

  while (true) {
    const users = await legacyDB.execute(
      sql`SELECT * FROM "Users" LIMIT ${BATCH_SIZE} OFFSET ${offset}`,
    );

    if (users.count === 0) {
      break;
    }

    console.log(users.count);
    console.log(users.map((user) => user.username));

    const result = await db
      .insert(schema.user)
      .values(
        users.map((user) => ({
          id: generateId(),
          username: user.username as string | null,
          clerk_id: user.clerk_id as string,
          image_url: user.image_url as string | null,
          created_at: new Date(user.xata_createdat as string),
          updated_at: new Date(user.xata_updatedat as string),
        })),
      )
      .onConflictDoNothing({
        target: schema.user.clerk_id,
      });

    console.log("Inserted users: ", result.rowCount);

    offset += BATCH_SIZE;
  }
} catch (error) {
  console.error(error);
} finally {
  process.exit(0);
}
