'use client';

import { useQueryState } from 'nuqs';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface CreateThemeButtonProps {
  isAuthenticated: boolean;
}

export function CreateThemeButton({ isAuthenticated }: CreateThemeButtonProps) {
  const [, setCreateDialog] = useQueryState('create');

  if (!isAuthenticated) {
    return null;
  }

  const handleCreate = () => {
    setCreateDialog('true');
  };

  return (
    <Button onClick={handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      Create Theme
    </Button>
  );
}