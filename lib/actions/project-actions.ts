"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-utils";
import {
  addProject,
  updateProject,
  deleteProject,
  searchProjects,
} from "@/lib/db/queries";
import { Project } from "../db/schema";

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  visibility: z.enum(["public", "private", "unlisted"]).default("private"),
});

const updateProjectSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Name too long")
    .optional(),
  description: z.string().max(500, "Description too long").optional(),
  visibility: z.enum(["public", "private", "unlisted"]).optional(),
});

// Action result types
type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createProjectAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await requireAuth(); // Get the user ID

    const validatedFields = createProjectSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      visibility: formData.get("visibility") || "private",
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Pass userId and validated data to addProject
    const result = await addProject(userId, validatedFields.data);

    revalidatePath("/");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error({ error });
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

export async function updateProjectAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth(); // Ensure user is authenticated

    const validatedFields = updateProjectSchema.safeParse({
      id: formData.get("id"),
      name: formData.get("name") || undefined,
      description: formData.get("description") || undefined,
      visibility: formData.get("visibility") || undefined,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, ...updateData } = validatedFields.data;
    const result = await updateProject(id, updateData);

    revalidatePath("/");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

export async function deleteProjectAction(
  projectId: string
): Promise<ActionResult> {
  try {
    await requireAuth(); // Ensure user is authenticated

    const result = await deleteProject(projectId);

    revalidatePath("/");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

// Quick action for toggling project visibility
export async function toggleProjectVisibilityAction(
  projectId: string,
  visibility: "public" | "private" | "unlisted"
): Promise<ActionResult> {
  try {
    await requireAuth(); // Ensure user is authenticated

    const result = await updateProject(projectId, { visibility });

    revalidatePath("/");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

// Redirect actions (for form submissions that should redirect)
export async function createProjectAndRedirectAction(formData: FormData) {
  const result = await createProjectAction({ success: false }, formData);

  if (result.success) {
    redirect("/");
  }

  return result;
}

export async function updateProjectAndRedirectAction(formData: FormData) {
  const result = await updateProjectAction({ success: false }, formData);

  if (result.success) {
    redirect("/");
  }

  return result;
}

// Search action for client components
export async function searchProjectsAction(
  query: string,
  options: {
    limit?: number;
    publicOnly?: boolean;
  } = {}
): Promise<ActionResult<Project[]>> {
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

    const result = await searchProjects({
      query: query.trim(),
      limit,
      publicOnly: publicOnly || !userId,
      userId,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Search action error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Search failed",
    };
  }
}
