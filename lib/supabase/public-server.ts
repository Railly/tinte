import { createClient } from "@supabase/supabase-js";

/**
 * Public Supabase client for unauthenticated operations
 * Use this for accessing public data that doesn't require authentication
 * (e.g., public themes, landing page data)
 */
export function createPublicServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // No accessToken config - this allows anonymous access
  );
}
