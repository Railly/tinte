import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: ".env.local" });

/**
 * Direct database connection using Drizzle ORM
 *
 * USAGE GUIDELINES:
 *
 * 1. Use adminDb for:
 *    - Database migrations (npm run db:migrate)
 *    - Administrative tasks
 *    - Scripts that need to bypass RLS policies
 *    - Analytics and reporting
 *
 * 2. DO NOT use adminDb for:
 *    - User-facing operations in API routes/Server Actions
 *    - Any operation that should respect user permissions
 *
 * 3. For user operations, use Supabase clients instead:
 *    - createServerSupabaseClient() for authenticated operations
 *    - createPublicSupabaseClient() for public data access
 *
 * This approach keeps security simple and reliable by leveraging
 * Supabase's built-in RLS and authentication handling.
 */

const adminClient = postgres(process.env.DATABASE_URL!);
export const adminDb = drizzle(adminClient);
