'use client';

import { useQueryState } from 'nuqs';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface CreateThemeButtonProps {
  userId: string | null;
}

export function CreateThemeButton({ userId }: CreateThemeButtonProps) {
  const [, setCreateDialog] = useQueryState('create');

  if (!userId) {
    return null;
  }

  const handleCreate = () => {
    setCreateDialog('true');
  };

  return (
    <Button onClick={handleCreate} size="sm">
      <Plus className="h-4 w-4 mr-2" />
      Create Theme
    </Button>
  );
}