'use client';

import { useCallback } from 'react';
import { useQueryStates } from 'nuqs';
import { createThemeAction } from '@/lib/actions/theme-actions';
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

export function ThemeCreateDialog() {
  const [{ create: createDialog }, setParams] = useQueryStates(themeFormParsers);

  const handleClose = useCallback(() => {
    setParams({ create: null });
  }, [setParams]);

  const [formState, formAction] = useFormAction(createThemeAction, {
    onSuccess: handleClose,
  });

  const isDialogOpen = createDialog === 'true';

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Theme</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <ThemeFormError error={formState.error} />
          
          <ThemeNameField fieldErrors={formState.fieldErrors} />
          <ThemeDescriptionField fieldErrors={formState.fieldErrors} />
          <ThemeContentField fieldErrors={formState.fieldErrors} />
          <ThemePublicField />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Theme
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}