import { nanoid } from "nanoid";

export function generateSlug(title: string): string {
  // Convert title to slug
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // If base slug is empty or too short, use a generated one
  if (!baseSlug || baseSlug.length < 3) {
    return `theme-${nanoid(8)}`;
  }

  // Add random suffix to ensure uniqueness
  const suffix = nanoid(6);
  return `${baseSlug}-${suffix}`;
}

export function generateThemeId(): string {
  return `theme_${nanoid()}`;
}