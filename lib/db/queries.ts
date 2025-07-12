import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createPublicServerSupabaseClient } from "@/lib/supabase/public-server";
import { getCurrentUserId } from "@/lib/auth-utils";
import { Theme } from "@/lib/db/schema";

// Get all themes visible to the current user (their own + public ones)
export async function getThemesByUser() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return data as Theme[];
}

// Get only public themes (for unauthenticated users)
export async function getPublicThemes() {
  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase
      .from("themes")
      .select("*")
      .eq("public", true)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Supabase error in getPublicThemes:", error);
      throw error;
    }
    return data as Theme[];
  } catch (err) {
    console.error("Error in getPublicThemes:", err);
    throw err;
  }
}

// Get only user's own themes (both public and private)
export async function getUserThemes() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return data as Theme[];
}

// Add a new theme
export async function addTheme(
  userId: string,
  data: {
    name: string;
    description?: string;
    content: string;
    public?: boolean;
  }
) {
  const supabase = createServerSupabaseClient();
  const { data: result, error } = await supabase
    .from("themes")
    .insert({
      name: data.name,
      description: data.description,
      content: data.content,
      public: data.public ?? false,
      userId: userId, // Explicitly set the user_id
    })
    .select()
    .single();

  if (error) throw error;
  return result as Theme;
}

// Update a theme
export async function updateTheme(
  themeId: number,
  data: Partial<{
    name: string;
    description: string;
    content: string;
    public: boolean;
  }>
) {
  const supabase = createServerSupabaseClient();
  const { data: result, error } = await supabase
    .from("themes")
    .update({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", themeId)
    .select()
    .single();

  if (error) throw error;
  return result as Theme;
}

// Delete a theme
export async function deleteTheme(themeId: number) {
  const supabase = createServerSupabaseClient();
  const { data: result, error } = await supabase
    .from("themes")
    .delete()
    .eq("id", themeId)
    .select()
    .single();

  if (error) throw error;
  return result as Theme;
}

// Get a specific theme by ID
export async function getThemeById(themeId: number) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("id", themeId)
    .single();

  if (error) throw error;
  return data as Theme;
}

// Search themes with filters
export async function searchThemes(params: {
  query?: string;
  publicOnly?: boolean;
  userId?: string | null;
  limit?: number;
}) {
  const { query, publicOnly, userId, limit = 50 } = params;
  
  const supabase = userId ? createServerSupabaseClient() : createPublicServerSupabaseClient();
  
  let queryBuilder = supabase
    .from("themes")
    .select("*");

  // Apply visibility filters
  if (!userId) {
    // Not authenticated - only public themes
    queryBuilder = queryBuilder.eq("public", true);
  } else if (publicOnly) {
    // Authenticated but requesting only public
    queryBuilder = queryBuilder.eq("public", true);
  } else {
    // Authenticated - own themes + public themes
    queryBuilder = queryBuilder.or(`public.eq.true,userId.eq.${userId}`);
  }

  // Apply search filter
  if (query?.trim()) {
    const searchTerm = `%${query.trim()}%`;
    queryBuilder = queryBuilder.or(
      `name.ilike.${searchTerm},description.ilike.${searchTerm}`
    );
  }

  queryBuilder = queryBuilder
    .order("createdAt", { ascending: false })
    .limit(limit);

  const { data, error } = await queryBuilder;

  if (error) throw error;
  return data as Theme[];
}
