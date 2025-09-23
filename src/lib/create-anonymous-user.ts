import { nanoid } from "nanoid";
import { db } from "@/db";
import { user } from "@/db/schema";

export async function createAnonymousUser() {
  const anonymousUserId = nanoid();

  try {
    const [newUser] = await db
      .insert(user)
      .values({
        id: anonymousUserId,
        name: `Anonymous User ${nanoid(6)}`,
        email: `anonymous.${nanoid(8)}@tinte.local`,
        is_anonymous: true,
        email_verified: false,
      })
      .returning();

    return newUser;
  } catch (error) {
    console.error("Error creating anonymous user:", error);
    throw new Error("Failed to create anonymous user");
  }
}