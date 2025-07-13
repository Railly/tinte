'use client';

import { useCallback } from 'react';
import { useQueryStates } from 'nuqs';
import { createProjectAction } from '@/lib/actions/project-actions';
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

export function ThemeCreateDialog() {
  const [{ create: createDialog }, setParams] = useQueryStates(themeFormParsers);

  const handleClose = useCallback(() => {
    setParams({ create: null });
  }, [setParams]);

  const [formState, formAction] = useFormAction(createProjectAction, {
    onSuccess: handleClose,
  });

  const isDialogOpen = createDialog === 'true';

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <ThemeFormError error={formState.error} />
          
          <ThemeNameField fieldErrors={formState.fieldErrors} />
          <ThemeDescriptionField fieldErrors={formState.fieldErrors} />
          <ThemeVisibilityField fieldErrors={formState.fieldErrors} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}