import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createPublicServerSupabaseClient } from "@/lib/supabase/public-server";
import { getCurrentUserId } from "@/lib/auth-utils";
import { Project } from "@/lib/db/schema";

// Get all projects visible to the current user (their own + public ones)
export async function getProjectsByUser() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return data as Project[];
}

// Get only public projects (for unauthenticated users)
export async function getPublicProjects() {
  try {
    const supabase = createPublicServerSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("visibility", "public")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Supabase error in getPublicProjects:", error);
      throw error;
    }
    return data as Project[];
  } catch (err) {
    console.error("Error in getPublicProjects:", err);
    throw err;
  }
}

// Get only user's own projects (both public and private)
export async function getUserProjects() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return data as Project[];
}

// Add a new project
export async function addProject(
  userId: string,
  data: {
    name: string;
    description?: string;
    visibility?: "public" | "private" | "unlisted";
  }
) {
  const supabase = createServerSupabaseClient();
  const { data: result, error } = await supabase
    .from("projects")
    .insert({
      name: data.name,
      description: data.description,
      visibility: data.visibility ?? "private",
      userId: userId, // Explicitly set the user_id
    })
    .select()
    .single();

  if (error) throw error;
  return result as Project;
}

// Update a project
export async function updateProject(
  projectId: string,
  data: Partial<{
    name: string;
    description: string;
    visibility: "public" | "private" | "unlisted";
  }>
) {
  const supabase = createServerSupabaseClient();
  const { data: result, error } = await supabase
    .from("projects")
    .update(data)
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw error;
  return result as Project;
}

// Delete a project
export async function deleteProject(projectId: string) {
  const supabase = createServerSupabaseClient();
  const { data: result, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw error;
  return result as Project;
}

// Get a specific project by ID
export async function getProjectById(projectId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) throw error;
  return data as Project;
}

// Search projects with filters
export async function searchProjects(params: {
  query?: string;
  publicOnly?: boolean;
  userId?: string | null;
  limit?: number;
}) {
  const { query, publicOnly, userId, limit = 50 } = params;
  
  const supabase = userId ? createServerSupabaseClient() : createPublicServerSupabaseClient();
  
  let queryBuilder = supabase
    .from("projects")
    .select("*");

  // Apply visibility filters
  if (!userId) {
    // Not authenticated - only public projects
    queryBuilder = queryBuilder.eq("visibility", "public");
  } else if (publicOnly) {
    // Authenticated but requesting only public
    queryBuilder = queryBuilder.eq("visibility", "public");
  } else {
    // Authenticated - own projects + public/unlisted projects
    queryBuilder = queryBuilder.or(`visibility.in.(public,unlisted),userId.eq.${userId}`);
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
  return data as Project[];
}

// Legacy aliases for backward compatibility (remove after updating all imports)
export const getThemesByUser = getProjectsByUser;
export const getPublicThemes = getPublicProjects;
export const getUserThemes = getUserProjects;
export const addTheme = addProject;
export const updateTheme = updateProject;
export const deleteTheme = deleteProject;
export const getThemeById = getProjectById;
export const searchThemes = searchProjects;
