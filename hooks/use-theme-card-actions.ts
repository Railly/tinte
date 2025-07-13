import { useOptimistic, useTransition } from 'react';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';
import { useThemeStore } from '@/lib/stores/theme-store';
import { toggleProjectVisibilityAction, deleteProjectAction } from '@/lib/actions/project-actions';
import type { Project } from '@/lib/db/schema';

type ProjectOptimistic = Project & {
  deleted?: boolean;
  deleteFailed?: boolean;
};

export function useThemeCardActions(theme: Project) {
  const { setSelectedTheme } = useThemeStore();
  const [, setEditThemeId] = useQueryState('edit');
  const [, setDeleteThemeId] = useQueryState('delete');
  const [isPending, startTransition] = useTransition();
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(
    theme as ProjectOptimistic,
    (state: ProjectOptimistic, update: Partial<ProjectOptimistic>) => ({ ...state, ...update })
  );

  const handleSelect = () => {
    setSelectedTheme(optimisticTheme);
  };

  const handleEdit = () => {
    setEditThemeId(optimisticTheme.id);
  };

  const handleToggleVisibility = (newVisibility: "public" | "private" | "unlisted") => {
    const currentVisibility = optimisticTheme.visibility;
    
    startTransition(async () => {
      setOptimisticTheme({ visibility: newVisibility });
      
      try {
        const result = await toggleProjectVisibilityAction(optimisticTheme.id, newVisibility);
        if (!result.success) {
          setOptimisticTheme({ visibility: currentVisibility });
          toast.error('Failed to update project visibility', {
            description: result.error || 'Please try again later'
          });
        }
      } catch (error) {
        setOptimisticTheme({ visibility: currentVisibility });
        toast.error('Failed to update project visibility', {
          description: 'Network error. Please try again later'
        });
      }
    });
  };

  const handleDelete = () => {
    setDeleteThemeId(optimisticTheme.id);
  };

  const handleConfirmDelete = () => {
    setOptimisticTheme({ deleted: true, deleteFailed: false });
    setDeleteThemeId(null);
    
    startTransition(async () => {
      try {
        const result = await deleteProjectAction(optimisticTheme.id);
        if (!result.success) {
          setOptimisticTheme({ deleted: false, deleteFailed: true });
          toast.error('Failed to delete project', {
            description: result.error || 'Please try again later'
          });
        } else {
          toast.success('Project deleted successfully');
        }
      } catch (error) {
        setOptimisticTheme({ deleted: false, deleteFailed: true });
        toast.error('Failed to delete project', {
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
    handleToggleVisibility,
    handleDelete,
    handleConfirmDelete,
  };
}