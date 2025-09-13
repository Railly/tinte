"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ThemeCard, ThemeCardSkeleton, ThemeCardListSkeleton } from "@/components/shared/theme-card";
import { Header } from "@/components/home/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useThemeContext } from "@/providers/theme";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { extractTinteThemeData } from "@/utils/tinte-presets";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";
import type { UserThemeData } from "@/types/user-theme";
import type { SessionData } from "@/types/auth";
import RaycastIcon from "@/components/shared/icons/raycast";
import TweakCNIcon from "@/components/shared/icons/tweakcn";
import Logo from "@/components/shared/logo";
import { User, Users } from "lucide-react";

interface BrowseThemesProps {
  session: SessionData;
  userThemes: UserThemeData[];
  publicThemes: UserThemeData[];
  initialCategory?: string;
  initialSearch?: string;
}

export function BrowseThemes({
  session,
  userThemes,
  publicThemes,
  initialCategory = "all",
  initialSearch = ""
}: BrowseThemesProps) {
  const { isDark, handleThemeSelect, mounted } = useThemeContext();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get all themes
  const tweakcnThemes = extractTweakcnThemeData(isDark).map((themeData, index) => ({
    ...themeData,
    description: `Beautiful ${themeData.name.toLowerCase()} theme with carefully crafted color combinations`,
    author: "tweakcn",
    provider: "tweakcn" as const,
    downloads: 8000 + index * 500,
    likes: 400 + index * 50,
    views: 15000 + index * 2000,
    tags: [themeData.name.split(" ")[0].toLowerCase(), "modern", "preset", "community"],
  }));

  const raysoThemes = extractRaysoThemeData(isDark).map((themeData, index) => ({
    ...themeData,
    description: `Beautiful ${themeData.name.toLowerCase()} theme from ray.so with carefully crafted color combinations`,
    author: "ray.so",
    provider: "rayso" as const,
    downloads: 6000 + index * 400,
    likes: 300 + index * 40,
    views: 12000 + index * 1500,
    tags: [themeData.name.toLowerCase(), "rayso", "modern", "community"],
  }));

  const tinteThemes = extractTinteThemeData(isDark).map((themeData, index) => ({
    ...themeData,
    description: `Stunning ${themeData.name.toLowerCase()} theme created by tinte with modern design principles`,
    author: "tinte",
    provider: "tinte" as const,
    downloads: 5000 + index * 350,
    likes: 250 + index * 35,
    views: 10000 + index * 1200,
    tags: [themeData.name.toLowerCase().split(" ")[0], "tinte", "premium", "design"],
  }));

  // Filter themes based on category and search
  const getFilteredThemes = () => {
    let allThemes: any[] = [];

    switch (activeCategory) {
      case "community":
        allThemes = publicThemes;
        break;
      case "user":
        allThemes = userThemes;
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
        allThemes = [...publicThemes, ...userThemes, ...tweakcnThemes, ...raysoThemes, ...tinteThemes];
    }

    if (searchTerm) {
      allThemes = allThemes.filter(theme =>
        theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort themes
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
  const totalThemes = [...publicThemes, ...userThemes, ...tweakcnThemes, ...raysoThemes, ...tinteThemes].length;
  
  // Show skeletons while theme context is mounting or theme state is not ready
  const shouldShowSkeletons = !mounted;

  return (
    <div className="min-h-screen">
      <Header />

      <div className="w-full mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{totalThemes} themes for Tinte</h1>
            <p className="text-muted-foreground">
              Copy/paste beautiful themes built with Tinte, Tailwind & React.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="likes">Likes</SelectItem>
                </SelectContent>
              </Select>

              <span className="text-sm font-medium ml-4">Category</span>
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse border rounded-sm">
                  <TabsTrigger value="all" className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs">
                    All Categories
                  </TabsTrigger>
                  <TabsTrigger value="community" className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5">
                    <Users className="w-3 h-3" />
                    Community
                  </TabsTrigger>
                  {session && (
                    <TabsTrigger value="user" className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5">
                      <User className="w-3 h-3" />
                      My Themes
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="tweakcn" className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5">
                    <TweakCNIcon className="w-3 h-3" />
                    tweakcn
                  </TabsTrigger>
                  <TabsTrigger value="rayso" className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5">
                    <RaycastIcon className="w-3 h-3" />
                    ray.so
                  </TabsTrigger>
                  <TabsTrigger value="tinte" className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5">
                    <Logo size={12} />
                    tinte
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Block</span>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-8 w-64"
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
              Showing {filteredThemes.length} results
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
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {shouldShowSkeletons ? (
              // Show skeleton cards while loading
              Array.from({ length: 12 }).map((_, index) => (
                viewMode === "grid" ? (
                  <ThemeCardSkeleton key={index} />
                ) : (
                  <ThemeCardListSkeleton key={index} />
                )
              ))
            ) : (
              filteredThemes.map((theme, index) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  index={index}
                  variant={viewMode}
                  onThemeSelect={handleThemeSelect}
                />
              ))
            )}
          </div>

          {!shouldShowSkeletons && filteredThemes.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <Search className="w-12 h-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No themes found</h3>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
              <Button variant="outline" onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}