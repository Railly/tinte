import { useOptimistic, useTransition } from 'react';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';
import { useThemeStore } from '@/lib/stores/theme-store';
import { toggleThemePublicAction, deleteThemeAction } from '@/lib/actions/theme-actions';
import type { Theme, ThemeOptimistic } from '@/lib/db/schema';

export function useThemeCardActions(theme: Theme) {
  const { setSelectedTheme } = useThemeStore();
  const [, setEditThemeId] = useQueryState('edit');
  const [, setDeleteThemeId] = useQueryState('delete');
  const [isPending, startTransition] = useTransition();
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(
    theme as ThemeOptimistic,
    (state: ThemeOptimistic, update: Partial<ThemeOptimistic>) => ({ ...state, ...update })
  );

  const handleSelect = () => {
    setSelectedTheme(optimisticTheme);
  };

  const handleEdit = () => {
    setEditThemeId(String(optimisticTheme.id));
  };

  const handleTogglePublic = () => {
    const newPublicState = !optimisticTheme.public;
    
    startTransition(async () => {
      setOptimisticTheme({ public: newPublicState });
      
      try {
        const result = await toggleThemePublicAction(optimisticTheme.id, newPublicState);
        if (!result.success) {
          setOptimisticTheme({ public: !newPublicState });
          toast.error('Failed to update theme visibility', {
            description: result.error || 'Please try again later'
          });
        }
      } catch (error) {
        setOptimisticTheme({ public: !newPublicState });
        toast.error('Failed to update theme visibility', {
          description: 'Network error. Please try again later'
        });
      }
    });
  };

  const handleDelete = () => {
    setDeleteThemeId(String(optimisticTheme.id));
  };

  const handleConfirmDelete = () => {
    setOptimisticTheme({ deleted: true, deleteFailed: false });
    setDeleteThemeId(null);
    
    startTransition(async () => {
      try {
        const result = await deleteThemeAction(optimisticTheme.id);
        if (!result.success) {
          setOptimisticTheme({ deleted: false, deleteFailed: true });
          toast.error('Failed to delete theme', {
            description: result.error || 'Please try again later'
          });
        } else {
          toast.success('Theme deleted successfully');
        }
      } catch (error) {
        setOptimisticTheme({ deleted: false, deleteFailed: true });
        toast.error('Failed to delete theme', {
          description: 'Network error. Please try again later'
        });
      }
    });
  };

  return {
    optimisticTheme,
    isPending,
    handleSelect,
    handleEdit,
    handleTogglePublic,
    handleDelete,
    handleConfirmDelete,
  };
}