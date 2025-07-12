'use client';

import { useThemeStore } from '@/lib/stores/theme-store';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface CreateThemeButtonProps {
  isAuthenticated: boolean;
}

export function CreateThemeButton({ isAuthenticated }: CreateThemeButtonProps) {
  const { startCreating } = useThemeStore();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button onClick={startCreating}>
      <Plus className="h-4 w-4 mr-2" />
      Create Theme
    </Button>
  );
}