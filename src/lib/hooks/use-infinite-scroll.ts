import { useCallback, useEffect, useRef, useState } from "react";
import type { UserThemeData } from "@/types/user-theme";

interface InfiniteScrollState {
  themes: UserThemeData[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
}

interface InfiniteScrollOptions {
  initialThemes?: UserThemeData[];
  limit?: number;
  sentinelId?: string;
}

export function useInfiniteScroll(options: InfiniteScrollOptions = {}) {
  const {
    initialThemes = [],
    limit = 20,
    sentinelId = "infinite-scroll-sentinel",
  } = options;

  const [state, setState] = useState<InfiniteScrollState>({
    themes: initialThemes,
    loading: false,
    hasMore: initialThemes.length >= limit,
    error: null,
  });

  const pageRef = useRef(1);
  const isLoadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !state.hasMore) return;

    isLoadingRef.current = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const nextPage = pageRef.current + 1;
      const response = await fetch(
        `/api/themes/public?page=${nextPage}&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch themes");
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        themes: [...prev.themes, ...data.themes],
        loading: false,
        hasMore: data.pagination.hasMore,
      }));

      pageRef.current = nextPage;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [limit, state.hasMore]);

  // Infinite scroll observer
  useEffect(() => {
    const checkAndObserve = () => {
      const sentinel = document.getElementById(sentinelId);

      if (!sentinel) {
        // Try again in a bit
        setTimeout(checkAndObserve, 100);
        return null;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0];
          if (target.isIntersecting && state.hasMore && !state.loading) {
            loadMore();
          }
        },
        { threshold: 0.5, rootMargin: "50px" },
      );

      observer.observe(sentinel);
      return observer;
    };

    const observer = checkAndObserve();

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [sentinelId, loadMore, state.hasMore, state.loading]);

  const reset = useCallback((newThemes: UserThemeData[] = []) => {
    setState({
      themes: newThemes,
      loading: false,
      hasMore: true,
      error: null,
    });
    pageRef.current = 1;
    isLoadingRef.current = false;
  }, []);

  return {
    ...state,
    loadMore,
    reset,
  };
}
