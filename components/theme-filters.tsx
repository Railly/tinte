'use client';

import { useQueryStates } from 'nuqs';
import { useThemeStore } from '@/lib/stores/theme-store';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { themeSearchParsers } from '@/lib/search-params';

export function ThemeFilters() {
  const [{ publicOnly: showPublicOnly }, setSearchParams] = useQueryStates(themeSearchParsers);
  const { viewMode, setViewMode } = useThemeStore();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        <Button
          variant={!showPublicOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setSearchParams({ publicOnly: false })}
        >
          All Themes
        </Button>
        <Button
          variant={showPublicOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setSearchParams({ publicOnly: true })}
        >
          Public Only
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Search:</span>
        <Button
          variant={viewMode === 'grid' ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          {viewMode === 'grid' ? "List View" : "Grid View"}
        </Button>
      </div>
    </div>
  );
}