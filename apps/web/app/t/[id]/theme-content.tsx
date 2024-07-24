/* eslint-disable @next/next/no-img-element */
"use client";
import { ThemeConfig } from "@/lib/core/types";
import { useUser } from "@clerk/nextjs";
import { ShareThemeDialog } from "../../../components/share-theme-dialog";
import { Button, buttonVariants } from "../../../components/ui/button";
import {
  IconDownload,
  IconEdit,
  IconUser,
  IconGlobe,
  IconLock,
  IconTinte,
  IconLoading,
} from "../../../components/ui/icons";
import Link from "next/link";
import { useMemo, useState } from "react";
import { generateVSCodeTheme } from "@/lib/core";
import { ThemePreview } from "../../../components/theme-preview";
import { cn } from "@/lib/utils";
import { LandingHeader } from "../../../components/landing-header";
import IconRaycast from "@/public/logos/raycast.svg";
import { motion } from "framer-motion";
import { isThemeOwner, getThemeCategoryLabel } from "@/app/utils";
import { Badge } from "../../../components/ui/badge";
import { FEATURED_THEME_LOGOS } from "@/lib/constants";
import { useThemeExport } from "@/lib/hooks/use-theme-export";
import { useBinaryTheme } from "@/lib/hooks/use-binary-theme";

export function ThemeContent({ themeConfig }: { themeConfig: ThemeConfig }) {
  const user = useUser();
  const { currentTheme } = useBinaryTheme();
  const isOwner = isThemeOwner(user.user?.id, themeConfig);
  const vsCodeTheme = useMemo(
    () => generateVSCodeTheme(themeConfig),
    [themeConfig]
  );

  const { loading, exportVSIX } = useThemeExport();
  const [imageLoading, setImageLoading] = useState(true);

  const handleDownloadTheme = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await exportVSIX(themeConfig, currentTheme === "dark");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Column */}
          <div className="w-1/2 p-4 overflow-y-auto">
            <div>
              <div className="bg-card rounded-lg shadow-md dark:shadow-foreground/5 border p-8 backdrop-blur-sm bg-opacity-30">
                <h1 className="text-3xl font-bold mb-6">
                  {themeConfig.displayName}
                </h1>
                <div className="flex items-center gap-4 mb-8">
                  {themeConfig.category === "rayso" ? (
                    <>
                      <IconRaycast className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-medium">Ray.so Theme</p>
                        <a
                          href="https://ray.so"
                          className={cn(
                            buttonVariants({ variant: "link" }),
                            "px-0 text-sm text-muted-foreground"
                          )}
                        >
                          Raycast
                        </a>
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
                <div className="space-y-4">
                  <Button
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
                <div className="relative mt-4">
                  {imageLoading && (
                    <div
                      className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                      style={{ height: 321, width: 612 }}
                    />
                  )}
                  <img
                    src={`/api/og?id=${themeConfig.id}`}
                    alt={`${themeConfig.displayName} theme preview`}
                    className={cn(
                      "w-full h-auto rounded-lg shadow-lg",
                      imageLoading ? "invisible" : "visible"
                    )}
                    height={630}
                    width={1200}
                    onLoad={() => setImageLoading(false)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Code Editor */}
          <div className="w-1/2 h-full p-4">
            <ThemePreview
              vsCodeTheme={vsCodeTheme}
              width="w-full"
              small={false}
              height="h-[88vh]"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
