'use client';

import React, { useMemo } from 'react';
import { useThemeStore } from '@/lib/stores/theme-store';
import { ThemeCard } from './theme-card';
import { ThemeSearch } from './theme-search';
import { ThemeFilters } from './theme-filters';
import { InfiniteThemeList } from './infinite-theme-list';
import { useInfiniteSearch } from '@/lib/hooks/use-infinite-search';
import type { Theme } from '@/lib/db/schema';

interface ThemeListClientProps {
  initialPublicThemes: Theme[];
  initialUserThemes: Theme[];
  isAuthenticated: boolean;
  userId: string | null;
}

export function ThemeListClient({
  initialPublicThemes,
  initialUserThemes,
  isAuthenticated,
  userId
}: ThemeListClientProps) {
  const {
    showPublicOnly,
    searchQuery,
    useUpstashSearch,
    isSearching
  } = useThemeStore();

  // Use infinite search hook for Upstash search
  const infiniteSearch = useInfiniteSearch({ pageSize: 12 });

  // Combine and filter themes for fallback (local search/no search)
  const fallbackThemes = useMemo(() => {
    let themes = showPublicOnly ? initialPublicThemes : [...initialUserThemes, ...initialPublicThemes];

    // Filter by search query (fallback for when Upstash is disabled)
    if (searchQuery.trim() && !useUpstashSearch) {
      const query = searchQuery.toLowerCase();
      themes = themes.filter(theme =>
        theme.name.toLowerCase().includes(query) ||
        theme.description?.toLowerCase().includes(query)
      );
    }

    // Remove duplicates
    const uniqueThemes = themes.reduce((acc, theme) => {
      if (!acc.find(t => t.id === theme.id)) {
        acc.push(theme);
      }
      return acc;
    }, [] as Theme[]);

    return uniqueThemes;
  }, [initialPublicThemes, initialUserThemes, showPublicOnly, searchQuery, useUpstashSearch]);

  // Infinite scroll component for DB queries when no search
  const infiniteScrollQuery = useMemo(() => {
    // If not authenticated, always show only public themes
    // If authenticated and showPublicOnly is true, show only public themes
    // If authenticated and showPublicOnly is false, show all accessible themes (own + public)
    const shouldFilterPublic = !isAuthenticated || showPublicOnly;

    return shouldFilterPublic
      ? (query: any) => query.eq('public', true).order('createdAt', { ascending: false })
      : (query: any) => query.order('createdAt', { ascending: false });
  }, [showPublicOnly, isAuthenticated]);

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ThemeSearch />
        {isAuthenticated && <ThemeFilters />}
      </div>

      {/* Conditional rendering based on search state */}
      {useUpstashSearch && infiniteSearch.hasQuery ? (
        // Upstash search with infinite scroll
        <InfiniteSearchResults
          searchData={infiniteSearch.data}
          hasMore={infiniteSearch.hasMore}
          isLoading={infiniteSearch.isLoading}
          isFetching={infiniteSearch.isFetching}
          fetchNextPage={infiniteSearch.fetchNextPage}
          userId={userId}
          searchQuery={searchQuery}
        />
      ) : !searchQuery.trim() ? (
        // No search - use infinite scroll from DB
        <InfiniteThemeList
          tableName="themes"
          pageSize={12}
          trailingQuery={infiniteScrollQuery}
          userId={userId}
          isAuthenticated={isAuthenticated}
        />
      ) : (
        // Fallback local search
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fallbackThemes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No themes found matching your search.
              </p>
            </div>
          ) : (
            fallbackThemes.map((theme) => (
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

// Component for infinite search results
function InfiniteSearchResults({
  searchData,
  hasMore,
  isLoading,
  isFetching,
  fetchNextPage,
  userId,
  searchQuery
}: {
  searchData: Theme[]
  hasMore: boolean
  isLoading: boolean
  isFetching: boolean
  fetchNextPage: () => void
  userId: string | null
  searchQuery: string
}) {
  const loadMoreSentinelRef = React.useRef<HTMLDivElement>(null)
  const observer = React.useRef<IntersectionObserver | null>(null)

  React.useEffect(() => {
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 100px 0px',
      }
    )

    if (loadMoreSentinelRef.current) {
      observer.current.observe(loadMoreSentinelRef.current)
    }

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [isFetching, hasMore, fetchNextPage])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {searchData.length === 0 && !isLoading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              No themes found matching "{searchQuery}".
            </p>
          </div>
        ) : (
          searchData.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isOwner={userId === theme.userId}
            />
          ))
        )}

        {/* Loading skeletons */}
        {(isFetching || isLoading) && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card border rounded-lg p-6 space-y-4">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-20 bg-muted animate-pulse rounded" />
                <div className="flex justify-between">
                  <div className="h-4 bg-muted animate-pulse rounded w-16" />
                  <div className="h-4 bg-muted animate-pulse rounded w-20" />
                </div>
              </div>
            ))}
          </>
        )}

        {!hasMore && searchData.length > 0 && (
          <div className="col-span-full text-center text-muted-foreground py-4 text-sm">
            No more search results.
          </div>
        )}
      </div>

      <div ref={loadMoreSentinelRef} style={{ height: '1px' }} />
    </div>
  )
}