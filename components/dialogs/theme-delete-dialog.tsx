'use client';

import { useCallback } from 'react';
import { useQueryStates } from 'nuqs';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog';
import { themeFormParsers } from '@/lib/search-params';
import { useThemeCardActions } from '@/hooks/use-theme-card-actions';
import type { Project } from '@/lib/db/schema';

interface ThemeDeleteDialogProps {
  themes: Project[];
}

function ThemeDeleteContent({ theme, onClose }: { theme: Project; onClose: () => void }) {
  const { handleConfirmDelete } = useThemeCardActions(theme);

  const handleConfirm = () => {
    handleConfirmDelete();
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Delete Theme
        </AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete "<strong>{theme.name}</strong>"? 
          This action cannot be undone and will permanently remove the theme.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Delete Theme
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export function ThemeDeleteDialog({ themes }: ThemeDeleteDialogProps) {
  const [{ delete: deleteThemeId }, setParams] = useQueryStates(themeFormParsers);

  const deletingTheme = deleteThemeId ? themes.find(t => t.id === deleteThemeId) : null;

  const handleClose = useCallback(() => {
    setParams({ delete: null });
  }, [setParams]);

  const isDialogOpen = !!deleteThemeId && !!deletingTheme;

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={(open) => !open && handleClose()}>
      {deletingTheme && (
        <ThemeDeleteContent theme={deletingTheme} onClose={handleClose} />
      )}
    </AlertDialog>
  );
}