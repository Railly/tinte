'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth-utils';
import { addTheme, updateTheme, deleteTheme } from '@/lib/db/queries';

// Validation schemas
const createThemeSchema = z.object({
  name: z.string().min(1, 'Theme name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  content: z.string().min(1, 'Theme content is required'),
  public: z.boolean().default(false),
});

const updateThemeSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Theme name is required').max(100, 'Name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  content: z.string().min(1, 'Theme content is required').optional(),
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
    const userId = await requireAuth();
    
    const validatedFields = createThemeSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      content: formData.get('content'),
      public: formData.get('public') === 'on',
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid form data',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const result = await addTheme(userId, validatedFields.data);
    
    revalidatePath('/themes');
    revalidatePath('/');
    
    return {
      success: true,
      data: result[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create theme',
    };
  }
}

export async function updateThemeAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await requireAuth();
    
    const validatedFields = updateThemeSchema.safeParse({
      id: Number(formData.get('id')),
      name: formData.get('name') || undefined,
      description: formData.get('description') || undefined,
      content: formData.get('content') || undefined,
      public: formData.get('public') === 'on',
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid form data',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, ...updateData } = validatedFields.data;
    const result = await updateTheme(userId, id, updateData);
    
    if (result.length === 0) {
      return {
        success: false,
        error: 'Theme not found or unauthorized',
      };
    }
    
    revalidatePath('/themes');
    revalidatePath('/');
    
    return {
      success: true,
      data: result[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update theme',
    };
  }
}

export async function deleteThemeAction(
  themeId: number
): Promise<ActionResult> {
  try {
    const userId = await requireAuth();
    
    const result = await deleteTheme(userId, themeId);
    
    if (result.length === 0) {
      return {
        success: false,
        error: 'Theme not found or unauthorized',
      };
    }
    
    revalidatePath('/themes');
    revalidatePath('/');
    
    return {
      success: true,
      data: result[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete theme',
    };
  }
}

// Quick action for toggling theme visibility
export async function toggleThemePublicAction(
  themeId: number,
  isPublic: boolean
): Promise<ActionResult> {
  try {
    const userId = await requireAuth();
    
    const result = await updateTheme(userId, themeId, { public: isPublic });
    
    if (result.length === 0) {
      return {
        success: false,
        error: 'Theme not found or unauthorized',
      };
    }
    
    revalidatePath('/themes');
    revalidatePath('/');
    
    return {
      success: true,
      data: result[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update theme',
    };
  }
}

// Redirect actions (for form submissions that should redirect)
export async function createThemeAndRedirectAction(formData: FormData) {
  const result = await createThemeAction({ success: false }, formData);
  
  if (result.success) {
    redirect('/themes');
  }
  
  return result;
}

export async function updateThemeAndRedirectAction(formData: FormData) {
  const result = await updateThemeAction({ success: false }, formData);
  
  if (result.success) {
    redirect('/themes');
  }
  
  return result;
}