import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import type { Theme } from '@/lib/db/schema';

interface ThemeFormFieldsProps {
  theme?: Theme | null;
  fieldErrors?: Record<string, string[]>;
}

export function ThemeNameField({ theme, fieldErrors }: ThemeFormFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Theme Name</Label>
      <Input
        id="name"
        name="name"
        placeholder="My Awesome Theme"
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
        placeholder="A beautiful dark theme for VS Code"
        defaultValue={theme?.description || ''}
      />
      {fieldErrors?.description && (
        <p className="text-sm text-destructive">{fieldErrors.description[0]}</p>
      )}
    </div>
  );
}

export function ThemeContentField({ theme, fieldErrors }: ThemeFormFieldsProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Theme Content (JSON)</Label>
      <textarea
        id="content"
        name="content"
        placeholder='{"colors": {"primary": "#000000"}}'
        defaultValue={theme?.content || ''}
        className="w-full h-32 p-3 text-sm border rounded-md"
        required
      />
      {fieldErrors?.content && (
        <p className="text-sm text-destructive">{fieldErrors.content[0]}</p>
      )}
    </div>
  );
}

export function ThemePublicField({ theme }: ThemeFormFieldsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="public"
        name="public"
        defaultChecked={theme?.public || false}
      />
      <Label htmlFor="public" className="text-sm">
        Make this theme public
      </Label>
    </div>
  );
}

export function ThemeFormError({ error }: { error?: string }) {
  if (!error) return null;
  
  return (
    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
      {error}
    </div>
  );
}