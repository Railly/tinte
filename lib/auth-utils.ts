import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Get the current user's ID for server-side operations
 * Use this in Server Components, Server Actions, and API routes
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await currentUser();
  return user?.id || null;
}

/**
 * Get auth info including user ID
 * Lighter weight alternative when you only need the user ID
 */
export async function getAuthUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Require authentication - throws if user is not authenticated
 * Use this when you need to ensure a user is logged in
 */
export async function requireAuth(): Promise<string> {
  const userId = await getAuthUserId();
  if (!userId) {
    throw new Error("Unauthorized: User must be logged in");
  }
  return userId;
}