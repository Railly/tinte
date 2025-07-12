'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQueryState } from 'nuqs';
import { useThemeStore } from '@/lib/stores/theme-store';
import { ThemeCard } from './theme-card';
import { ThemeSearch } from './theme-search';
import { ThemeFilters } from './theme-filters';
import type { Theme } from '@/lib/db/schema';

interface ThemeListClientProps {
  initialThemes: Theme[];
  isAuthenticated: boolean;
  userId: string | null;
}

export function ThemeListClient({
  initialThemes,
  isAuthenticated,
  userId
}: ThemeListClientProps) {
  const [searchQuery] = useQueryState('q', { defaultValue: '' });
  const [showPublicOnly] = useQueryState('publicOnly', {
    defaultValue: false,
    parse: (value) => value === 'true',
  });
  const { useUpstashSearch } = useThemeStore();
  const [searchResults, setSearchResults] = useState<Theme[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Upstash search effect
  useEffect(() => {
    if (!useUpstashSearch || !searchQuery?.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);

    const performSearch = async () => {
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          limit: '50',
          publicOnly: showPublicOnly.toString(),
        });

        const response = await fetch(`/api/search?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300); // Debounce

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery, useUpstashSearch, showPublicOnly]);

  // Simple client-side filtering for themes (fallback when not using Upstash)
  const filteredThemes = useMemo(() => {
    return initialThemes.filter(theme => {
      // Filter by visibility
      if (!isAuthenticated) return theme.public;
      if (showPublicOnly) return theme.public;
      return theme.public || theme.userId === userId;
    }).filter(theme => {
      // Filter by search query (only for local search)
      if (!searchQuery?.trim() || useUpstashSearch) return true;
      const query = searchQuery.toLowerCase();
      return theme.name.toLowerCase().includes(query) ||
        theme.description?.toLowerCase().includes(query);
    });
  }, [initialThemes, isAuthenticated, showPublicOnly, userId, searchQuery, useUpstashSearch]);

  // Choose which themes to display
  const displayedThemes = useMemo(() => {
    if (useUpstashSearch && searchQuery?.trim()) {
      return searchResults;
    }
    return filteredThemes;
  }, [useUpstashSearch, searchQuery, searchResults, filteredThemes]);

  // Show loading state for search
  const showLoading = useUpstashSearch && searchQuery?.trim() && isSearching;

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ThemeSearch />
        {isAuthenticated && <ThemeFilters />}
      </div>

      {/* Theme grid */}
      {showLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedThemes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery?.trim() ? 'No themes found matching your search.' : 'No themes available.'}
              </p>
            </div>
          ) : (
            displayedThemes.map((theme) => (
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