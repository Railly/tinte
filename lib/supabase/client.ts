import { createClient } from "@supabase/supabase-js";

// Create a basic Supabase client for public access
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create Supabase client with Clerk session integration
export function createClerkSupabaseClient(getToken: (() => Promise<string | null>) | null) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'Cache-Control': 'no-cache',
        },
      },
      accessToken: getToken || (() => Promise.resolve(null)),
    }
  );
}
