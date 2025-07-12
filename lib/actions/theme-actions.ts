"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { addTheme, updateTheme, deleteTheme } from "@/lib/db/queries";
import { indexTheme, deleteThemeFromIndex } from "@/lib/services/search";

// Validation schemas
const createThemeSchema = z.object({
  name: z.string().min(1, "Theme name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  content: z.string().min(1, "Theme content is required"),
  public: z.boolean().default(false),
});

const updateThemeSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "Theme name is required")
    .max(100, "Name too long")
    .optional(),
  description: z.string().max(500, "Description too long").optional(),
  content: z.string().min(1, "Theme content is required").optional(),
  public: z.boolean().optional(),
});

// Action result types
type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createThemeAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await requireAuth(); // Get the user ID

    const validatedFields = createThemeSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      content: formData.get("content"),
      public: formData.get("public") === "on",
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Pass userId and validated data to addTheme
    const result = await addTheme(userId, validatedFields.data);

    // Index the new theme in Upstash Search
    try {
      await indexTheme(result);
    } catch (searchError) {
      console.error("Failed to index theme in search:", searchError);
      // Don't fail the entire operation if search indexing fails
    }

    revalidatePath("/themes");
    revalidatePath("/");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error({ error });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create theme",
    };
  }
}

export async function updateThemeAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth(); // Ensure user is authenticated

    const validatedFields = updateThemeSchema.safeParse({
      id: Number(formData.get("id")),
      name: formData.get("name") || undefined,
      description: formData.get("description") || undefined,
      content: formData.get("content") || undefined,
      public: formData.get("public") === "on",
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, ...updateData } = validatedFields.data;
    const result = await updateTheme(id, updateData);

    // Update the theme in Upstash Search
    try {
      await indexTheme(result);
    } catch (searchError) {
      console.error("Failed to update theme in search:", searchError);
      // Don't fail the entire operation if search indexing fails
    }

    revalidatePath("/themes");
    revalidatePath("/");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update theme",
    };
  }
}

export async function deleteThemeAction(
  themeId: number
): Promise<ActionResult> {
  try {
    await requireAuth(); // Ensure user is authenticated

    const result = await deleteTheme(themeId);

    // Remove the theme from Upstash Search
    try {
      await deleteThemeFromIndex(themeId);
    } catch (searchError) {
      console.error("Failed to remove theme from search:", searchError);
      // Don't fail the entire operation if search deletion fails
    }

    revalidatePath("/themes");
    revalidatePath("/");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete theme",
    };
  }
}

// Quick action for toggling theme visibility
export async function toggleThemePublicAction(
  themeId: number,
  isPublic: boolean
): Promise<ActionResult> {
  try {
    await requireAuth(); // Ensure user is authenticated

    const result = await updateTheme(themeId, { public: isPublic });

    // Update the theme in Upstash Search (visibility change affects search results)
    try {
      await indexTheme(result);
    } catch (searchError) {
      console.error("Failed to update theme visibility in search:", searchError);
      // Don't fail the entire operation if search indexing fails
    }

    revalidatePath("/themes");
    revalidatePath("/");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update theme",
    };
  }
}

// Search action (replaces client-side fetch)
export async function searchThemesAction(
  query: string,
  options: {
    limit?: number;
    publicOnly?: boolean;
  } = {}
): Promise<ActionResult<any[]>> {
  try {
    const { limit = 50, publicOnly = false } = options;
    
    if (!query?.trim()) {
      return { success: true, data: [] };
    }

    // Get current user for permission filtering
    let userId: string | null = null;
    try {
      userId = await requireAuth();
    } catch {
      // User not authenticated - will search public only
    }

    // Use the existing API route logic
    const searchParams = new URLSearchParams({
      q: query.trim(),
      limit: String(limit),
      publicOnly: String(publicOnly || !userId),
    });

    // This calls the Upstash search service
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/search?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    return { success: true, data: data.results || [] };
  } catch (error) {
    console.error('Search action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
    };
  }
}

// Redirect actions (for form submissions that should redirect)
export async function createThemeAndRedirectAction(formData: FormData) {
  const result = await createThemeAction({ success: false }, formData);

  if (result.success) {
    redirect("/themes");
  }

  return result;
}

export async function updateThemeAndRedirectAction(formData: FormData) {
  const result = await updateThemeAction({ success: false }, formData);

  if (result.success) {
    redirect("/themes");
  }

  return result;
}
