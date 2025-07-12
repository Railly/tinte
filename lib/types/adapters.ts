/**
 * Type adapters to ensure consistency between database and client representations
 * This file acts as a bridge to handle any format differences (snake_case vs camelCase, etc.)
 */

import type { Theme, ThemeFormData } from '@/lib/db/schema';

/**
 * Validates that a database result matches our expected Theme type
 * Useful for runtime type checking when data comes from external sources
 */
export function validateTheme(data: unknown): data is Theme {
  if (!data || typeof data !== 'object') return false;
  
  const theme = data as Record<string, unknown>;
  
  return (
    typeof theme.id === 'number' &&
    typeof theme.name === 'string' &&
    (theme.description === null || typeof theme.description === 'string') &&
    typeof theme.content === 'string' &&
    typeof theme.userId === 'string' &&
    typeof theme.public === 'boolean' &&
    theme.createdAt instanceof Date &&
    theme.updatedAt instanceof Date
  );
}

/**
 * Converts form data to database insert format
 * Ensures all required fields are present and properly typed
 */
export function formDataToInsert(formData: ThemeFormData, userId: string): Omit<Theme, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: formData.name.trim(),
    description: formData.description?.trim() || null,
    content: formData.content,
    userId,
    public: formData.public ?? false,
  };
}

/**
 * Converts database theme to form data for editing
 */
export function themeToFormData(theme: Theme): ThemeFormData {
  return {
    name: theme.name,
    description: theme.description || undefined,
    content: theme.content,
    public: theme.public,
  };
}

/**
 * Type-safe theme update data
 */
export type ThemeUpdateData = Partial<Pick<Theme, 'name' | 'description' | 'content' | 'public'>>;

/**
 * Validates theme update data
 */
export function validateThemeUpdate(data: unknown): data is ThemeUpdateData {
  if (!data || typeof data !== 'object') return false;
  
  const update = data as Record<string, unknown>;
  
  // At least one field must be present
  const hasValidField = [
    update.name && typeof update.name === 'string',
    update.description === null || typeof update.description === 'string',
    update.content && typeof update.content === 'string',
    typeof update.public === 'boolean'
  ].some(Boolean);
  
  return hasValidField;
}