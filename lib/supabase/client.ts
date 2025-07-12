import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

export function getSupabaseClient() {
  const { session } = useSession();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => session?.getToken() ?? null,
    }
  );
}
