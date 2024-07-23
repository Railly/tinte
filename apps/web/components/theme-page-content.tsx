/* eslint-disable @next/next/no-img-element */
"use client";
import { ThemeConfig } from "@/lib/core/types";
import { useUser } from "@clerk/nextjs";
import { ShareThemeDialog } from "./share-theme-dialog";
import { Button, buttonVariants } from "./ui/button";
import {
  IconDownload,
  IconEdit,
  IconHeart,
  IconUser,
  IconGlobe,
  IconLock,
  IconTinte,
  IconLoading,
} from "./ui/icons";
import Link from "next/link";
import { useMemo, useState } from "react";
import { generateVSCodeTheme } from "@/lib/core";
import { ThemePreview } from "./theme-preview";
import { cn } from "@/lib/utils";
import { LandingHeader } from "./landing-header";
import IconRaycast from "@/public/logos/raycast.svg";
import { motion } from "framer-motion";
import { isThemeOwner, getThemeCategoryLabel } from "@/app/utils";
import { Badge } from "./ui/badge";
import { FEATURED_THEME_LOGOS } from "@/lib/constants";
import { useThemeExport } from "@/lib/hooks/use-theme-export";
import { useBinaryTheme } from "@/lib/hooks/use-binary-theme";

export function ThemePageContent({
  themeConfig,
}: {
  themeConfig: ThemeConfig;
}) {
  const user = useUser();
  const { currentTheme } = useBinaryTheme();
  const isOwner = isThemeOwner(user.user?.id, themeConfig);
  const vsCodeTheme = useMemo(
    () => generateVSCodeTheme(themeConfig),
    [themeConfig]
  );
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  const { loading, exportVSIX } = useThemeExport();

  const handleDownloadTheme = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await exportVSIX(themeConfig, currentTheme === "dark");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ThemePreview
                vsCodeTheme={vsCodeTheme}
                width="w-full"
                small={false}
                height="h-[80vh]"
              />
            </motion.div>
            <motion.div
              className="w-full md:w-1/3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-card rounded-lg shadow-md dark:shadow-foreground/5 border p-8 backdrop-blur-sm bg-opacity-30">
                <h1 className="text-3xl font-bold mb-6">
                  {themeConfig.displayName}
                </h1>
                <div className="flex items-center gap-4 mb-8">
                  {themeConfig.category === "rayso" ? (
                    <>
                      <IconRaycast className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-medium">
                          Ray.so Theme by
                          <a
                            href="https://ray.so"
                            className={cn(
                              buttonVariants({ variant: "link" }),
                              "px-0 pl-2"
                            )}
                          >
                            Raycast
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Theme Creator
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {themeConfig.user?.image_url ? (
                        <img
                          src={themeConfig.user?.image_url || ""}
                          className="w-12 h-12 rounded-full border-2"
                          alt="User avatar"
                        />
                      ) : (
                        <IconUser className="w-12 h-12 rounded-full" />
                      )}
                      <div>
                        <p className="font-medium">
                          {themeConfig.user?.username || "Anonymous"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Theme Creator
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary">
                    {themeConfig.category === "user" && (
                      <>
                        {themeConfig.user?.image_url ? (
                          <img
                            src={themeConfig.user?.image_url}
                            className="w-5 h-5 mr-2 rounded-full"
                            alt={themeConfig.user?.username || "User"}
                          />
                        ) : (
                          <IconUser className="w-4 h-4 mr-2" />
                        )}
                        {themeConfig.user?.username || "Anonymous"}
                      </>
                    )}
                    {themeConfig.category === "community" && (
                      <IconTinte className="w-4 h-4 mr-2" />
                    )}
                    {themeConfig.category === "rayso" && (
                      <IconRaycast className="w-4 h-4 mr-2" />
                    )}
                    {themeConfig.category === "featured" && (
                      <div className="mr-2">
                        {
                          FEATURED_THEME_LOGOS[
                            themeConfig.displayName as keyof typeof FEATURED_THEME_LOGOS
                          ]
                        }
                      </div>
                    )}
                    {themeConfig.category !== "user" &&
                      getThemeCategoryLabel(themeConfig.category)}
                  </Badge>
                  <Badge variant="outline">
                    {themeConfig.isPublic ? (
                      <IconGlobe className="w-4 h-4 mr-2 text-cyan-700 dark:text-cyan-400" />
                    ) : (
                      <IconLock className="w-3 h-3 mr-2 text-rose-600 dark:text-rose-400" />
                    )}
                    {themeConfig.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Likes</span>
                    <motion.span
                      className="font-medium flex items-center gap-1"
                      key={likes}
                      initial={{ scale: 1.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconHeart className="w-5 h-5 text-red-500" />
                      {likes}
                    </motion.span>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button
                    className="w-full text-foreground transition-all bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    onClick={handleLike}
                  >
                    <IconHeart className="mr-2 h-5 w-5" />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDownloadTheme}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="animate-spin">
                        <IconLoading className="mr-2" />
                      </span>
                    ) : (
                      <IconDownload className="mr-2" />
                    )}
                    Download
                  </Button>
                  <Link
                    href={`/generator?theme=${themeConfig.name}`}
                    className={cn(
                      "w-full",
                      buttonVariants({ variant: "outline" })
                    )}
                  >
                    <IconEdit className="mr-2" />
                    Edit
                  </Link>
                  <ShareThemeDialog
                    themeConfig={themeConfig}
                    isOwner={isOwner}
                    canNotEdit={!isOwner}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
