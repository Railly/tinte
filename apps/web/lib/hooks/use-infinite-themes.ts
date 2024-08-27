import useSWRInfinite from "swr/infinite";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useInfiniteThemes(
  initialData: any,
  category: string,
  userId?: string | null,
) {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.hasMore) return null;
    const url = new URL(`/api/themes`, window.location.origin);
    url.searchParams.append("page", (pageIndex + 1).toString());
    url.searchParams.append("limit", "20");
    url.searchParams.append("category", category);
    if (userId) url.searchParams.append("userId", userId);
    return url.toString();
  };

  return useSWRInfinite(getKey, fetcher, {
    fallbackData: [initialData],
    revalidateFirstPage: false,
    revalidateAll: false,
    persistSize: false,
  });
}
