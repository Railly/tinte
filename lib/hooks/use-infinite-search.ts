"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useThemeStore } from "@/lib/stores/theme-store";
import { useDebounce } from "@/lib/hooks/use-debounce";
import type { Theme } from "@/lib/db/schema";

interface UseInfiniteSearchProps {
  pageSize?: number;
  debounceMs?: number;
}

interface SearchState {
  data: Theme[];
  hasMore: boolean;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  page: number;
}

export function useInfiniteSearch({
  pageSize = 12,
  debounceMs = 300,
}: UseInfiniteSearchProps = {}) {
  const { searchQuery, showPublicOnly, useUpstashSearch, setIsSearching } =
    useThemeStore();

  const debouncedSearchQuery = useDebounce(searchQuery, debounceMs);

  const [state, setState] = React.useState<SearchState>({
    data: [],
    hasMore: true,
    isLoading: false,
    isFetching: false,
    error: null,
    page: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(
    async (query: string, page: number = 0, append: boolean = false) => {
      // Abort any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      if (!query.trim()) {
        setState({
          data: [],
          hasMore: true,
          isLoading: false,
          isFetching: false,
          error: null,
          page: 0,
        });
        setIsSearching(false);
        return;
      }

      try {
        setState((prev) => ({
          ...prev,
          isLoading: page === 0,
          isFetching: true,
          error: null,
        }));
        setIsSearching(true);

        const searchParams = new URLSearchParams({
          q: query.trim(),
          limit: pageSize.toString(),
          offset: (page * pageSize).toString(),
          publicOnly: showPublicOnly.toString(),
        });

        const response = await fetch(`/api/search?${searchParams}`, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();
        const newResults = data.results || [];

        setState((prev) => ({
          ...prev,
          data: append ? [...prev.data, ...newResults] : newResults,
          hasMore: newResults.length === pageSize,
          isLoading: false,
          isFetching: false,
          page: page,
        }));
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Search error:", error);
          setState((prev) => ({
            ...prev,
            error,
            isLoading: false,
            isFetching: false,
          }));
        }
      } finally {
        setIsSearching(false);
      }
    },
    [pageSize, showPublicOnly, setIsSearching]
  );

  const fetchNextPage = useCallback(() => {
    if (!state.isFetching && state.hasMore && debouncedSearchQuery.trim()) {
      performSearch(debouncedSearchQuery, state.page + 1, true);
    }
  }, [
    debouncedSearchQuery,
    state.isFetching,
    state.hasMore,
    state.page,
    performSearch,
  ]);

  // Effect for new searches (reset to page 0)
  useEffect(() => {
    if (useUpstashSearch) {
      performSearch(debouncedSearchQuery, 0, false);
    }
  }, [debouncedSearchQuery, showPublicOnly, useUpstashSearch, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data: state.data,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    isFetching: state.isFetching,
    error: state.error,
    fetchNextPage,
    hasQuery: debouncedSearchQuery.trim().length > 0,
  };
}
