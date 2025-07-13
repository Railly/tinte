'use client';

import { useCallback } from 'react';
import { useQueryStates } from 'nuqs';
import { updateProjectAction } from '@/lib/actions/project-actions';
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
  ThemeVisibilityField,
  ThemeFormError
} from './theme-form-fields';
import { themeFormParsers } from '@/lib/search-params';
import type { Project } from '@/lib/db/schema';

interface ThemeEditDialogProps {
  themes: Project[];
}

export function ThemeEditDialog({ themes }: ThemeEditDialogProps) {
  const [{ edit: editThemeId }, setParams] = useQueryStates(themeFormParsers);
  
  const editingTheme = editThemeId ? themes.find(t => t.id === editThemeId) : null;

  const handleClose = useCallback(() => {
    setParams({ edit: null });
  }, [setParams]);

  const [formState, formAction] = useFormAction(updateProjectAction, {
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
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={editThemeId || ''} />
          
          <ThemeFormError error={formState.error} />
          
          <ThemeNameField theme={editingTheme} fieldErrors={formState.fieldErrors} />
          <ThemeDescriptionField theme={editingTheme} fieldErrors={formState.fieldErrors} />
          <ThemeVisibilityField theme={editingTheme} fieldErrors={formState.fieldErrors} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}