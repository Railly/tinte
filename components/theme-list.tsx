'use client';

import { Project } from '@/lib/db/schema';
import { useQueryStates } from 'nuqs';
import { useThemeSearch } from '@/hooks/use-theme-search';
import { ThemeSearch } from './theme-search';
import { ThemeFilters } from './theme-filters';
import { ThemeCard } from './theme-card';
import { themeSearchParsers } from '@/lib/search-params';

interface ThemeListProps {
  themes: Project[];
  userId: string | null;
}

export function ThemeList({ themes, userId }: ThemeListProps) {
  const [{ q: searchQuery, publicOnly: showPublicOnly }] = useQueryStates(themeSearchParsers);

  const { themes: filteredThemes, isPending, isSearchActive, error } = useThemeSearch({
    query: searchQuery,
    publicOnly: showPublicOnly,
    fallbackThemes: themes,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ThemeSearch />
        {userId && <ThemeFilters />}
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
          {filteredThemes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery?.trim() ? 'No projects found matching your search.' : 'No projects available.'}
              </p>
            </div>
          ) : (
            filteredThemes.map((theme) => (
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