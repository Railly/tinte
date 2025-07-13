import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Project } from '@/lib/db/schema';

interface ThemeFormFieldsProps {
  theme?: Project | null;
  fieldErrors?: Record<string, string[]>;
}

export function ThemeNameField({ theme, fieldErrors }: ThemeFormFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Project Name</Label>
      <Input
        id="name"
        name="name"
        placeholder="My Awesome Theme Project"
        defaultValue={theme?.name || ''}
        required
      />
      {fieldErrors?.name && (
        <p className="text-sm text-destructive">{fieldErrors.name[0]}</p>
      )}
    </div>
  );
}

export function ThemeDescriptionField({ theme, fieldErrors }: ThemeFormFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description (Optional)</Label>
      <Input
        id="description"
        name="description"
        placeholder="A beautiful theme collection for multiple editors"
        defaultValue={theme?.description || ''}
      />
      {fieldErrors?.description && (
        <p className="text-sm text-destructive">{fieldErrors.description[0]}</p>
      )}
    </div>
  );
}

export function ThemeVisibilityField({ theme, fieldErrors }: ThemeFormFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="visibility">Visibility</Label>
      <Select name="visibility" defaultValue={theme?.visibility || "private"}>
        <SelectTrigger>
          <SelectValue placeholder="Select visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="unlisted">Unlisted</SelectItem>
          <SelectItem value="public">Public</SelectItem>
        </SelectContent>
      </Select>
      {fieldErrors?.visibility && (
        <p className="text-sm text-destructive">{fieldErrors.visibility[0]}</p>
      )}
    </div>
  );
}

// Legacy exports for backward compatibility
export const ThemeContentField = () => null; // Remove content field
export const ThemePublicField = ThemeVisibilityField; // Alias for visibility

export function ThemeFormError({ error }: { error?: string }) {
  if (!error) return null;
  
  return (
    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
      {error}
    </div>
  );
}