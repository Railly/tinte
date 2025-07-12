'use client';

import { useMemo } from 'react';
import { useThemeStore } from '@/lib/stores/theme-store';
import { ThemeCard } from './theme-card';
import { ThemeSearch } from './theme-search';
import { ThemeFilters } from './theme-filters';
import type { Theme } from '@/lib/stores/theme-store';

interface ThemeListClientProps {
  initialPublicThemes: Theme[];
  initialUserThemes: Theme[];
  isAuthenticated: boolean;
}

export function ThemeListClient({ 
  initialPublicThemes, 
  initialUserThemes, 
  isAuthenticated 
}: ThemeListClientProps) {
  const { showPublicOnly, searchQuery } = useThemeStore();
  
  // Combine and filter themes based on client state
  const displayThemes = useMemo(() => {
    let themes = showPublicOnly ? initialPublicThemes : [...initialUserThemes, ...initialPublicThemes];
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      themes = themes.filter(theme => 
        theme.name.toLowerCase().includes(query) ||
        theme.description?.toLowerCase().includes(query)
      );
    }
    
    // Remove duplicates (in case public themes include user's public themes)
    const uniqueThemes = themes.reduce((acc, theme) => {
      if (!acc.find(t => t.id === theme.id)) {
        acc.push(theme);
      }
      return acc;
    }, [] as Theme[]);
    
    return uniqueThemes;
  }, [initialPublicThemes, initialUserThemes, showPublicOnly, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ThemeSearch />
        {isAuthenticated && <ThemeFilters />}
      </div>
      
      {/* Theme grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayThemes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? 'No themes found matching your search.' : 'No themes found.'}
            </p>
          </div>
        ) : (
          displayThemes.map((theme) => (
            <ThemeCard 
              key={theme.id} 
              theme={theme} 
              isOwner={theme.userId === (isAuthenticated ? 'user' : null)}
            />
          ))
        )}
      </div>
    </div>
  );
}