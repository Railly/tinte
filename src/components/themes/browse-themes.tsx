"use client";

import { Heart, Loader2, Search, User, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
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
import { PROVIDER_ICONS } from "@/config/providers";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useLoop } from "@/hooks/use-loop";
import { useThemeSearch } from "@/hooks/use-theme-search";
import { useThemeContext } from "@/providers/theme";
import type { SessionData } from "@/types/auth";
import type { UserThemeData } from "@/types/user-theme";
import { mergeRefs } from "@/utils/merge-refs";

// All static preset imports removed - using database themes passed as props

interface BrowseThemesProps {
  session: SessionData;
  userThemes: UserThemeData[];
  publicThemes: UserThemeData[];
  favoriteThemes: UserThemeData[];
  tweakCNThemes: UserThemeData[];
  tinteThemes: UserThemeData[];
  raysoThemes: UserThemeData[];
  publicThemesCount: number;
  initialCategory?: string;
  initialSearch?: string;
}

export function BrowseThemes({
  session,
  userThemes,
  publicThemes,
  favoriteThemes,
  tweakCNThemes,
  tinteThemes,
  raysoThemes,
  publicThemesCount,
  initialCategory = "community",
  initialSearch = "",
}: BrowseThemesProps) {
  const { isDark, handleThemeSelect, mounted } = useThemeContext();

  // Animation hooks for provider cycling
  const [ref, bounds] = useMeasure();
  const [active, ref2] = useLoop();

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

  // TweakCN themes now come from database as props

  // All themes now come from database via props (no more static extraction)

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
        allThemes = tweakCNThemes;
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
    tweakCNThemes.length +
    raysoThemes.length +
    tinteThemes.length;

  // Show skeletons while theme context is mounting, theme state is not ready, or searching
  const shouldShowSkeletons = !mounted || (searchTerm.trim() && isSearching);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="w-full mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="space-y-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                <div className="flex flex-col items-center justify-center gap-2">
                  <span>Discover {totalThemes.toLocaleString()}+</span>
                  <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                    <motion.div
                      animate={{
                        width: bounds.width > 0 ? bounds.width : "auto",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 55,
                      }}
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      <div
                        ref={mergeRefs([ref, ref2])}
                        className="flex items-center gap-2 w-fit whitespace-nowrap"
                      >
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                          <AnimatePresence mode="wait" initial={false}>
                            {Object.entries(PROVIDER_ICONS).map(
                              ([name, IconComponent]) => (
                                <motion.div
                                  key={name}
                                  initial={{
                                    scale: 0.5,
                                    filter: "blur(4px)",
                                    opacity: 0,
                                  }}
                                  animate={
                                    name === active
                                      ? {
                                          scale: 1,
                                          filter: "blur(0px)",
                                          opacity: 1,
                                        }
                                      : {
                                          scale: 0.5,
                                          filter: "blur(4px)",
                                          opacity: 0,
                                        }
                                  }
                                  exit={{
                                    scale: 0.5,
                                    filter: "blur(4px)",
                                    opacity: 0,
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 45,
                                  }}
                                  className="absolute inset-0"
                                >
                                  <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                                </motion.div>
                              ),
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold whitespace-nowrap">
                          <AnimatePresence mode="popLayout" initial={false}>
                            {active?.split("").map((letter, index) => {
                              return (
                                <motion.div
                                  initial={{ opacity: 0, filter: "blur(2px)" }}
                                  animate={{
                                    opacity: 1,
                                    filter: "blur(0px)",
                                    transition: {
                                      type: "spring",
                                      stiffness: 350,
                                      damping: 55,
                                      delay: index * 0.015,
                                    },
                                  }}
                                  exit={{
                                    opacity: 0,
                                    filter: "blur(2px)",
                                    transition: {
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 55,
                                    },
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 55,
                                  }}
                                  key={index + letter + active}
                                  className="inline-block"
                                >
                                  {letter}
                                  {letter === " " ? "\u00A0" : ""}
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                    <span>Themes</span>
                  </div>
                </div>
              </h1>
              <p className="py-2 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Ready-to-use color palettes for modern applications. Copy,
                paste, and ship beautiful designs instantly.
              </p>
            </div>

            {/* Primary Search */}
            <div className="relative max-w-lg mx-auto">
              {isSearching ? (
                <Loader2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground animate-spin" />
              ) : (
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                placeholder={isSearching ? "Searching..." : "Search themes..."}
                className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary/50 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="border rounded-xl bg-card/50 backdrop-blur-sm p-4 space-y-4">
            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Browse by Category
              </h3>
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList
                  className={`bg-muted/30 h-auto p-1 w-full justify-start overflow-x-auto ${searchTerm.trim() ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex gap-1 min-w-max">
                    <TabsTrigger
                      value="community"
                      disabled={!!searchTerm.trim()}
                      className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 px-4 text-sm gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Users className="w-4 h-4" />
                      Community
                    </TabsTrigger>
                    {session && (
                      <TabsTrigger
                        value="user"
                        disabled={!!searchTerm.trim()}
                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 px-4 text-sm gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt="Profile"
                            className="w-4 h-4 rounded-full"
                          />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        My Themes
                      </TabsTrigger>
                    )}
                    {session && (
                      <TabsTrigger
                        value="favorites"
                        disabled={!!searchTerm.trim()}
                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 px-4 text-sm gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Heart className="w-4 h-4" />
                        Favorites
                      </TabsTrigger>
                    )}
                    <div className="w-px h-8 bg-border mx-2" />
                    <TabsTrigger
                      value="tweakcn"
                      disabled={!!searchTerm.trim()}
                      className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 px-4 text-sm gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TweakCNIcon className="w-4 h-4" />
                      TweakCN
                    </TabsTrigger>
                    <TabsTrigger
                      value="rayso"
                      disabled={!!searchTerm.trim()}
                      className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 px-4 text-sm gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RaycastIcon className="w-4 h-4" />
                      Ray.so
                    </TabsTrigger>
                    <TabsTrigger
                      value="tinte"
                      disabled={!!searchTerm.trim()}
                      className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg py-2.5 px-4 text-sm gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Logo size={16} />
                      Tinte
                    </TabsTrigger>
                  </div>
                </TabsList>
              </Tabs>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Sort by
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] h-9">
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

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  View
                </span>
                <div className="flex border rounded-lg p-1 bg-muted/30">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="h-7 px-3 text-xs rounded-md"
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="h-7 px-3 text-xs rounded-md"
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </Button>
                </div>
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
                : `Showing ${filteredThemes.length} results`}
            </p>
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
                <h3 className="text-lg font-medium text-destructive">
                  Search Error
                </h3>
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
          {!shouldShowSkeletons &&
            !searchError &&
            filteredThemes.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <Search className="w-12 h-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    {searchTerm.trim()
                      ? "No themes found"
                      : "No themes in this category"}
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
