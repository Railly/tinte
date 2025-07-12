'use client';

import { Theme } from '@/lib/db/schema';
import { useQueryStates } from 'nuqs';
import { useThemeSearch } from '@/hooks/use-theme-search';
import { ThemeSearch } from './theme-search';
import { ThemeFilters } from './theme-filters';
import { ThemeCard } from './theme-card';
import { themeSearchParsers } from '@/lib/search-params';

interface ThemeListProps {
  filteredThemes: Theme[];
  userId: string | null;
}

export function ThemeList({ filteredThemes, userId }: ThemeListProps) {
  const isAuthenticated = !!userId;
  const [{ q: searchQuery, publicOnly: showPublicOnly }] = useQueryStates(themeSearchParsers);

  const { themes, isPending, isSearchActive, error } = useThemeSearch({
    query: searchQuery,
    publicOnly: showPublicOnly,
    fallbackThemes: filteredThemes,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ThemeSearch />
        {isAuthenticated && <ThemeFilters />}
      </div>

      {error && isSearchActive && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          Search error: {error}
        </div>
      )}

      {isPending && isSearchActive ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery?.trim() ? 'No themes found matching your search.' : 'No themes available.'}
              </p>
            </div>
          ) : (
            themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isOwner={userId === theme.userId}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}