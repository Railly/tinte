'use client';

import { useActionState } from 'react';
import { useEffect } from 'react';
import { useThemeStore, useThemeSelectors } from '@/lib/stores/theme-store';
import { createThemeAction, updateThemeAction } from '@/lib/actions/theme-actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { X } from 'lucide-react';

export function ThemeForm() {
  const { isCreating, isEditing, editingTheme, cancelEditing } = useThemeStore();
  const { isFormOpen } = useThemeSelectors();

  const [createState, createFormAction] = useActionState(createThemeAction, { success: false });
  const [updateState, updateFormAction] = useActionState(updateThemeAction, { success: false });

  const isUpdate = isEditing && editingTheme;
  const formAction = isUpdate ? updateFormAction : createFormAction;
  const formState = isUpdate ? updateState : createState;

  console.log({ formState })

  // Close form and reset store when action succeeds
  useEffect(() => {
    if (formState.success) {
      cancelEditing();
    }
  }, [formState.success, cancelEditing]);

  if (!isFormOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            {isUpdate ? 'Edit Theme' : 'Create New Theme'}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={cancelEditing}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form action={formAction}>
          {isUpdate && (
            <input type="hidden" name="id" value={editingTheme?.id} />
          )}

          <CardContent className="space-y-4">
            {formState.error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {formState.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Theme Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingTheme?.name}
                placeholder="My Awesome Theme"
                required
              />
              {formState.fieldErrors?.name && (
                <p className="text-sm text-destructive">{formState.fieldErrors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                name="description"
                defaultValue={editingTheme?.description || ''}
                placeholder="A beautiful dark theme for VS Code"
              />
              {formState.fieldErrors?.description && (
                <p className="text-sm text-destructive">{formState.fieldErrors.description[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Theme Content (JSON)</Label>
              <textarea
                id="content"
                name="content"
                defaultValue={editingTheme?.content}
                placeholder='{"colors": {"primary": "#000000"}}'
                className="w-full h-32 p-3 text-sm border rounded-md"
                required
              />
              {formState.fieldErrors?.content && (
                <p className="text-sm text-destructive">{formState.fieldErrors.content[0]}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="public"
                name="public"
                defaultChecked={editingTheme?.public}
              />
              <Label htmlFor="public" className="text-sm">
                Make this theme public
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={cancelEditing}>
              Cancel
            </Button>
            <Button type="submit"
              disabled={!isCreating || isEditing}
            >
              {isUpdate ? 'Update Theme' : 'Create Theme'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}