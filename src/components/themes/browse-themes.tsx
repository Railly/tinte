"use client";

import { Loader2, Search, User, Users, Heart } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { Header } from "@/components/home/header";
import { Footer } from "@/components/shared/footer";
import RaycastIcon from "@/components/shared/icons/raycast";
import TweakCNIcon from "@/components/shared/icons/tweakcn";
import Logo from "@/components/shared/logo";
import {
  ThemeCard,
  ThemeCardListSkeleton,
  ThemeCardSkeleton,
} from "@/components/shared/theme-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useThemeContext } from "@/providers/theme";
import { useThemeSearch } from "@/hooks/use-theme-search";
import type { SessionData } from "@/types/auth";
import type { UserThemeData } from "@/types/user-theme";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { extractTinteThemeData } from "@/utils/tinte-presets";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";

interface BrowseThemesProps {
  session: SessionData;
  userThemes: UserThemeData[];
  publicThemes: UserThemeData[];
  favoriteThemes: UserThemeData[];
  publicThemesCount: number;
  initialCategory?: string;
  initialSearch?: string;
}

export function BrowseThemes({
  session,
  userThemes,
  publicThemes,
  favoriteThemes,
  publicThemesCount,
  initialCategory = "community",
  initialSearch = "",
}: BrowseThemesProps) {
  const { isDark, handleThemeSelect, mounted } = useThemeContext();

  // Use nuqs for URL synchronization
  const [activeCategory, setActiveCategory] = useQueryState(
    "category",
    parseAsString.withDefault(initialCategory),
  );
  const [searchTerm, setSearchTerm] = useQueryState(
    "search",
    parseAsString.withDefault(initialSearch),
  );

  // Use API search hook for real search functionality
  const {
    searchResults,
    isSearching,
    searchError,
    searchQuery,
    setSearchQuery,
  } = useThemeSearch();

  // Sync URL search param with search hook
  useEffect(() => {
    if (searchTerm !== searchQuery) {
      setSearchQuery(searchTerm);
    }
  }, [searchTerm, searchQuery, setSearchQuery]);

  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Initialize infinite scroll for community themes
  const infiniteScrollState = useInfiniteScroll({
    initialThemes: publicThemes.slice(0, 20),
    limit: 20,
    sentinelId: "infinite-scroll-sentinel-browse",
  });

  // Get all themes
  const tweakcnThemes = extractTweakcnThemeData(isDark).map(
    (themeData, index) => ({
      ...themeData,
      description: `Beautiful ${themeData.name.toLowerCase()} theme with carefully crafted color combinations`,
      author: "tweakcn",
      provider: "tweakcn" as const,
      downloads: 0,
      likes: 0,
      tags: [
        themeData.name.split(" ")[0].toLowerCase(),
        "modern",
        "preset",
        "community",
      ],
    }),
  );

  const raysoThemes = extractRaysoThemeData(isDark).map((themeData, index) => ({
    ...themeData,
    description: `Beautiful ${themeData.name.toLowerCase()} theme from ray.so with carefully crafted color combinations`,
    author: "ray.so",
    provider: "rayso" as const,
    downloads: 0,
    likes: 0,
    views: 0,
    tags: [themeData.name.toLowerCase(), "rayso", "modern", "community"],
  }));

  const tinteThemes = extractTinteThemeData(isDark).map((themeData, index) => ({
    ...themeData,
    description: `Stunning ${themeData.name.toLowerCase()} theme created by tinte with modern design principles`,
    author: "tinte",
    provider: "tinte" as const,
    downloads: 0,
    likes: 0,
    views: 0,
    tags: [
      themeData.name.toLowerCase().split(" ")[0],
      "tinte",
      "premium",
      "design",
    ],
  }));

  // Get themes based on search state - using API search when searching
  const getFilteredThemes = () => {
    // If searching, use API search results
    if (searchTerm.trim()) {
      // Use the search results from the API
      const apiResults = searchResults;

      // Sort API search results
      switch (sortBy) {
        case "name":
          return apiResults.sort((a, b) => a.name.localeCompare(b.name));
        case "downloads":
          return apiResults.sort((a, b) => b.downloads - a.downloads);
        case "likes":
          return apiResults.sort((a, b) => b.likes - a.likes);
        default:
          // For search results, default is relevance (keep API order)
          return apiResults;
      }
    }

    // If not searching, show themes based on active category
    let allThemes: any[] = [];

    switch (activeCategory) {
      case "community":
        allThemes = infiniteScrollState.themes;
        break;
      case "user":
        allThemes = userThemes;
        break;
      case "favorites":
        allThemes = favoriteThemes;
        break;
      case "tweakcn":
        allThemes = tweakcnThemes;
        break;
      case "rayso":
        allThemes = raysoThemes;
        break;
      case "tinte":
        allThemes = tinteThemes;
        break;
      default:
        allThemes = infiniteScrollState.themes;
    }

    // Sort category themes
    switch (sortBy) {
      case "name":
        return allThemes.sort((a, b) => a.name.localeCompare(b.name));
      case "downloads":
        return allThemes.sort((a, b) => b.downloads - a.downloads);
      case "likes":
        return allThemes.sort((a, b) => b.likes - a.likes);
      default:
        return allThemes;
    }
  };

  const filteredThemes = getFilteredThemes();
  const totalThemes =
    publicThemesCount +
    userThemes.length +
    tweakcnThemes.length +
    raysoThemes.length +
    tinteThemes.length;

  // Show skeletons while theme context is mounting, theme state is not ready, or searching
  const shouldShowSkeletons = !mounted || (searchTerm.trim() && isSearching);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              {totalThemes} themes for Tinte
            </h1>
            <p className="text-muted-foreground">
              Copy/paste beautiful themes built with Tinte, Tailwind & React.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-sm font-medium">Sort</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="downloads">Downloads</SelectItem>
                    <SelectItem value="likes">Likes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-sm font-medium md:ml-4">Category</span>
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className={`bg-background h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse border rounded-sm w-full overflow-x-auto ${searchTerm.trim() ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex min-w-max">
                      <TabsTrigger
                        value="community"
                        disabled={!!searchTerm.trim()}
                        className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 sm:px-6 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Users className="w-3 h-3" />
                        <span className="hidden sm:inline">Community</span>
                      </TabsTrigger>
                      {session && (
                        <TabsTrigger
                          value="user"
                          disabled={!!searchTerm.trim()}
                          className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {session.user.image ? (
                            <img
                              src={session.user.image}
                              alt="Profile"
                              className="w-3 h-3 rounded-full"
                            />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          <span className="hidden sm:inline">My Themes</span>
                        </TabsTrigger>
                      )}
                      {session && (
                        <TabsTrigger
                          value="favorites"
                          disabled={!!searchTerm.trim()}
                          className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Heart className="w-3 h-3" />
                          <span className="hidden sm:inline">Favorites</span>
                        </TabsTrigger>
                      )}
                      <TabsTrigger
                        value="tweakcn"
                        disabled={!!searchTerm.trim()}
                        className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TweakCNIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">tweakcn</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="rayso"
                        disabled={!!searchTerm.trim()}
                        className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RaycastIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">ray.so</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="tinte"
                        disabled={!!searchTerm.trim()}
                        className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Logo size={12} />
                        <span className="hidden sm:inline">tinte</span>
                      </TabsTrigger>
                    </div>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                {isSearching ? (
                  <Loader2 className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
                ) : (
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                )}
                <Input
                  placeholder={isSearching ? "Searching..." : "Search 12k+ themes..."}
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {searchTerm.trim()
                ? `Found ${filteredThemes.length} themes matching "${searchTerm}"`
                : `Showing ${filteredThemes.length} results`
              }
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View Mode</span>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 rounded-l-none border-l"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Theme Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {shouldShowSkeletons
              ? // Show skeleton cards while loading
              Array.from({ length: 12 }).map((_, index) =>
                viewMode === "grid" ? (
                  <ThemeCardSkeleton key={index} />
                ) : (
                  <ThemeCardListSkeleton key={index} />
                ),
              )
              : filteredThemes.map((theme, index) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  index={index}
                  variant={viewMode}
                  onThemeSelect={handleThemeSelect}
                  showUserInfo={
                    activeCategory === "community" ||
                    activeCategory === "user" ||
                    activeCategory === "favorites"
                  }
                />
              ))}
          </div>

          {/* Infinite scroll sentinel for community tab - only when not searching */}
          {!searchTerm.trim() &&
            activeCategory === "community" &&
            !shouldShowSkeletons &&
            infiniteScrollState.hasMore && (
              <div
                id="infinite-scroll-sentinel-browse"
                className="flex justify-center py-8"
              >
                {infiniteScrollState.loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading more themes...</span>
                  </div>
                ) : (
                  <div className="h-4 w-full" />
                )}
              </div>
            )}

          {!searchTerm.trim() &&
            activeCategory === "community" &&
            infiniteScrollState.error && (
              <div className="text-center py-4">
                <p className="text-red-500 text-sm">
                  {infiniteScrollState.error}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={infiniteScrollState.loadMore}
                >
                  Try Again
                </Button>
              </div>
            )}

          {/* Search Error State */}
          {searchTerm.trim() && searchError && !isSearching && (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-destructive">Search Error</h3>
                <p className="text-muted-foreground text-sm">
                  {searchError}. Please try again.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                }}
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* No Results State */}
          {!shouldShowSkeletons && !searchError && filteredThemes.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <Search className="w-12 h-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {searchTerm.trim() ? "No themes found" : "No themes in this category"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {searchTerm.trim()
                    ? `No themes match "${searchTerm}". Try a different search term.`
                    : "This category doesn't have any themes yet."}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("community");
                }}
              >
                {searchTerm.trim() ? "Clear Search" : "Browse All Themes"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
