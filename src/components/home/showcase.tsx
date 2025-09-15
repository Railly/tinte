"use client";

import { ArrowRight, User, Users, Heart } from "lucide-react";
import { useState } from "react";
import RaycastIcon from "@/components/shared/icons/raycast";
import TweakCNIcon from "@/components/shared/icons/tweakcn";
import Logo from "@/components/shared/logo";
import { ThemeCard, ThemeCardSkeleton } from "@/components/shared/theme-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThemeContext } from "@/providers/theme";
import { extractRaysoThemeData } from "@/utils/rayso-presets";
import { extractTinteThemeData } from "@/utils/tinte-presets";
import { extractTweakcnThemeData } from "@/utils/tweakcn-presets";
import type { UserThemeData } from "@/types/user-theme";
import type { SessionData } from "@/types/auth";

interface ShowcaseProps {
  session: SessionData;
  userThemes: UserThemeData[];
  publicThemes: UserThemeData[];
  favoriteThemes?: UserThemeData[];
}

export function Showcase({ session, userThemes, publicThemes, favoriteThemes = [] }: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState("community");
  const { isDark, handleThemeSelect, mounted } = useThemeContext();

  // Static theme data for showcase (no SSR issues)
  const tweakcnThemes = extractTweakcnThemeData(isDark).map(
    (themeData, index) => ({
      ...themeData,
      description: `Beautiful ${themeData.name.toLowerCase()} theme with carefully crafted color combinations`,
      author: "tweakcn",
      provider: "tweakcn" as const,
      downloads: 0,
      likes: 0,
      views: 0,
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

  // Show skeletons while theme context is mounting
  const shouldShowSkeletons = !mounted;

  return (
    <div className="w-full space-y-8 p-4 mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-foreground flex items-center justify-center">
                  {activeTab === "community" ? (
                    <Users className="size-5 text-background" />
                  ) : activeTab === "tinte" ? (
                    <Logo size={24} className="text-foreground" />
                  ) : activeTab === "user" ? (
                    <User className="size-5 text-background" />
                  ) : activeTab === "favorites" ? (
                    <Heart className="size-5 text-background" />
                  ) : activeTab === "tweakcn" ? (
                    <TweakCNIcon className="size-5 text-background" />
                  ) : activeTab === "rayso" ? (
                    <RaycastIcon className="size-5 text-background" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <h2 className="text-xl font-medium">
                  {activeTab === "community" ? "From the Community" :
                    activeTab === "tinte" ? "Tinte Themes" :
                      activeTab === "user" ? "My Themes" :
                        activeTab === "favorites" ? "My Favorites" :
                          activeTab === "tweakcn" ? "tweakcn Themes" :
                            activeTab === "rayso" ? "ray.so Themes" :
                              "From the Community"}
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              {activeTab === "community" ? "Explore what the community is crafting with Tinte." :
                activeTab === "tinte" ? "Beautiful themes created by the Tinte team." :
                  activeTab === "user" ? "Your personal theme collection." :
                    activeTab === "favorites" ? "Themes you've marked as favorites." :
                      activeTab === "tweakcn" ? "Curated themes from tweakcn.com." :
                        activeTab === "rayso" ? "Modern themes from ray.so." :
                          "Explore what the community is crafting with Tinte."}
            </p>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse border rounded-sm w-full sm:w-auto overflow-x-auto">
              <div className="flex min-w-max w-full sm:w-auto">
                <TabsTrigger
                  value="community"
                  className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 flex-1 sm:flex-initial whitespace-nowrap"
                >
                  <Users className="w-3 h-3" />
                  <span className="hidden sm:inline">Community</span>
                </TabsTrigger>
                <TabsTrigger
                  value="tinte"
                  className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 flex-1 sm:flex-initial whitespace-nowrap"
                >
                  <Logo size={12} />
                  <span className="hidden sm:inline">tinte</span>
                </TabsTrigger>
                {session && (
                  <TabsTrigger
                    value="user"
                    className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 flex-1 sm:flex-initial whitespace-nowrap"
                  >
                    {session.user.image ? (
                      <img src={session.user.image} alt="Profile" className="w-3 h-3 rounded-full" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span className="hidden sm:inline">My Themes</span>
                  </TabsTrigger>
                )}
                {session && (
                  <TabsTrigger
                    value="favorites"
                    className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 flex-1 sm:flex-initial whitespace-nowrap"
                  >
                    <Heart className="w-3 h-3" />
                    <span className="hidden sm:inline">Favorites</span>
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="tweakcn"
                  className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 flex-1 sm:flex-initial whitespace-nowrap"
                >
                  <TweakCNIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">tweakcn</span>
                </TabsTrigger>
                <TabsTrigger
                  value="rayso"
                  className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border-none py-2 px-3 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e text-xs gap-1.5 flex-1 sm:flex-initial whitespace-nowrap"
                >
                  <RaycastIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">ray.so</span>
                </TabsTrigger>
              </div>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Provider Content */}
      <div>
        {activeTab === "community" && (
          <div className="space-y-4">
            {shouldShowSkeletons ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ThemeCardSkeleton key={index} />
                ))}
              </div>
            ) : publicThemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {publicThemes.slice(0, 8).map((theme, index) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    index={index}
                    onThemeSelect={handleThemeSelect}
                    showUserInfo={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <Users className="w-12 h-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No community themes yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Be the first to share a theme with the community!
                  </p>
                </div>
                <Button className="mt-4" asChild>
                  <a href="/workbench">Create Theme</a>
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "user" && session && (
          <div className="space-y-4">
            {shouldShowSkeletons ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ThemeCardSkeleton key={index} />
                ))}
              </div>
            ) : userThemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userThemes.map((theme, index) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    index={index}
                    onThemeSelect={handleThemeSelect}
                    showUserInfo={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <User className="w-12 h-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No themes yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Start creating your first theme in the workbench!
                  </p>
                </div>
                <Button className="mt-4" asChild>
                  <a href="/workbench">Create Theme</a>
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && session && (
          <div className="space-y-4">
            {shouldShowSkeletons ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ThemeCardSkeleton key={index} />
                ))}
              </div>
            ) : favoriteThemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteThemes.slice(0, 8).map((theme, index) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    index={index}
                    onThemeSelect={handleThemeSelect}
                    showUserInfo={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <Heart className="w-12 h-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No favorites yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Start exploring themes and mark your favorites!
                  </p>
                </div>
                <Button className="mt-4" asChild>
                  <a href="/themes">Browse Themes</a>
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "tweakcn" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shouldShowSkeletons ? (
              Array.from({ length: 8 }).map((_, index) => (
                <ThemeCardSkeleton key={index} />
              ))
            ) : (
              tweakcnThemes.slice(0, 8).map((theme, index) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  index={index}
                  onThemeSelect={handleThemeSelect}
                  showUserInfo={false}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "rayso" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shouldShowSkeletons ? (
              Array.from({ length: 8 }).map((_, index) => (
                <ThemeCardSkeleton key={index} />
              ))
            ) : (
              raysoThemes.slice(0, 8).map((theme, index) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  index={index}
                  onThemeSelect={handleThemeSelect}
                  showUserInfo={false}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "tinte" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shouldShowSkeletons ? (
              Array.from({ length: 8 }).map((_, index) => (
                <ThemeCardSkeleton key={index} />
              ))
            ) : (
              tinteThemes.slice(0, 8).map((theme, index) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  index={index}
                  onThemeSelect={handleThemeSelect}
                  showUserInfo={false}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Browse All Button */}
      <div className="flex justify-center pb-4">
        <Button
          variant="outline"
          className="gap-2 h-10 px-6"
          asChild
        >
          <a href={`/themes?category=${activeTab}`}>
            Browse All {activeTab === "community" ? "Community" :
              activeTab === "tinte" ? "Tinte" :
                activeTab === "user" ? "My" :
                  activeTab === "favorites" ? "Favorite" :
                    activeTab === "tweakcn" ? "tweakcn" :
                      activeTab === "rayso" ? "ray.so" :
                        "Community"} Themes
            <ArrowRight className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
