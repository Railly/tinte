'use client';

import { useCallback } from 'react';
import { useQueryStates } from 'nuqs';
import { updateThemeAction } from '@/lib/actions/theme-actions';
import { useFormAction } from '@/hooks/use-form-action';
import { Button } from '../ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../ui/dialog';
import { 
  ThemeNameField,
  ThemeDescriptionField,
  ThemeContentField,
  ThemePublicField,
  ThemeFormError
} from './theme-form-fields';
import { themeFormParsers } from '@/lib/search-params';
import type { Theme } from '@/lib/db/schema';

interface ThemeEditDialogProps {
  themes: Theme[];
}

export function ThemeEditDialog({ themes }: ThemeEditDialogProps) {
  const [{ edit: editThemeId }, setParams] = useQueryStates(themeFormParsers);
  
  const editingTheme = editThemeId ? themes.find(t => t.id === parseInt(editThemeId)) : null;

  const handleClose = useCallback(() => {
    setParams({ edit: null });
  }, [setParams]);

  const [formState, formAction] = useFormAction(updateThemeAction, {
    onSuccess: handleClose,
  });

  const isDialogOpen = !!editThemeId && !!editingTheme;

  if (!editingTheme) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Theme</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={editThemeId || ''} />
          
          <ThemeFormError error={formState.error} />
          
          <ThemeNameField theme={editingTheme} fieldErrors={formState.fieldErrors} />
          <ThemeDescriptionField theme={editingTheme} fieldErrors={formState.fieldErrors} />
          <ThemeContentField theme={editingTheme} fieldErrors={formState.fieldErrors} />
          <ThemePublicField theme={editingTheme} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Theme
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}