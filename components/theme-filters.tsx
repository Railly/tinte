'use client';

import { useThemeStore } from '@/lib/stores/theme-store';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ThemeFilters() {
  const { showPublicOnly, setShowPublicOnly } = useThemeStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Show:</span>
      <Button
        variant={!showPublicOnly ? "default" : "outline"}
        size="sm"
        onClick={() => setShowPublicOnly(false)}
      >
        All Themes
      </Button>
      <Button
        variant={showPublicOnly ? "default" : "outline"}
        size="sm"
        onClick={() => setShowPublicOnly(true)}
      >
        Public Only
      </Button>
    </div>
  );
}