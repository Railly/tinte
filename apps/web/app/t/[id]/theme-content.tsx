/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { ThemeConfig } from "@/lib/core/types";
import { useUser } from "@clerk/nextjs";
import { ShareThemeDialog } from "../../../components/share-theme-dialog";
import { Button, buttonVariants } from "../../../components/ui/button";
import {
  IconDownload,
  IconUser,
  IconGlobe,
  IconLock,
  IconTinte,
  IconLoading,
  IconBrush,
} from "../../../components/ui/icons";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { generateVSCodeTheme } from "@/lib/core";
import { ThemePreview } from "../../../components/theme-preview";
import { cn } from "@/lib/utils";
import IconRaycast from "@/public/logos/raycast.svg";
import { isThemeOwner, getThemeCategoryLabel } from "@/app/utils";
import { Badge } from "../../../components/ui/badge";
import { FEATURED_THEME_LOGOS } from "@/lib/constants";
import { useThemeExport } from "@/lib/hooks/use-theme-export";
import { useBinaryTheme } from "@/lib/hooks/use-binary-theme";
import { GeneralHeader } from "@/components/general-header";

export function ThemeContent({ themeConfig }: { themeConfig: ThemeConfig }) {
  const user = useUser();
  const { currentTheme } = useBinaryTheme();
  const isOwner = isThemeOwner(user.user?.id, themeConfig);
  const vsCodeTheme = useMemo(
    () => generateVSCodeTheme(themeConfig),
    [themeConfig],
  );

  const { loading, exportVSIX } = useThemeExport();
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?id=${themeConfig.id}`;
    img.onload = () => {
      setImageLoading(false);
    };
  }, [themeConfig.id]);

  const handleDownloadTheme = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await exportVSIX(themeConfig, currentTheme === "dark");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <GeneralHeader />
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 p-4 overflow-y-auto">
            <div className="bg-card h-full md:h-[88vh] rounded-lg shadow-md dark:shadow-foreground/5 border p-4 sm:p-8 backdrop-blur-sm bg-opacity-30">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                {themeConfig.displayName}
              </h1>
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                {themeConfig.category === "rayso" ? (
                  <>
                    <IconRaycast className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                    <div>
                      <p className="font-medium">Ray.so Theme</p>
                      <a
                        href="https://ray.so"
                        className={cn(
                          buttonVariants({ variant: "link" }),
                          "px-0 text-sm text-muted-foreground",
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
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2"
                        alt="User avatar"
                      />
                    ) : (
                      <IconUser className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
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
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                <Badge variant="secondary">
                  {themeConfig.category === "user" && (
                    <>
                      {themeConfig.user?.image_url ? (
                        <img
                          src={themeConfig.user?.image_url}
                          className="w-4 h-4 sm:w-5 sm:h-5 mr-2 rounded-full"
                          alt={themeConfig.user?.username || "User"}
                        />
                      ) : (
                        <IconUser className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      )}
                      {themeConfig.user?.username || "Anonymous"}
                    </>
                  )}
                  {themeConfig.category === "community" && (
                    <IconTinte className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  )}
                  {themeConfig.category === "rayso" && (
                    <IconRaycast className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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
                    <IconGlobe className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-cyan-700 dark:text-cyan-400" />
                  ) : (
                    <IconLock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-2 text-rose-600 dark:text-rose-400" />
                  )}
                  {themeConfig.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              <div className="space-y-3 sm:space-y-4">
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
                  href={`/vscode/editor?theme=${themeConfig.name}`}
                  className={cn(
                    "w-full",
                    buttonVariants({ variant: "outline" }),
                  )}
                >
                  <IconBrush className="mr-2 w-4 h-4" />
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
                  <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                    <IconLoading />
                  </div>
                )}
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/og?id=${themeConfig.id}`}
                  alt={`${themeConfig.displayName} theme preview`}
                  className={cn(
                    "w-full h-auto rounded-lg shadow-lg transition-opacity duration-300",
                    imageLoading ? "opacity-0" : "opacity-100",
                  )}
                  height={630}
                  width={1200}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Code Editor */}
          <div className="w-full lg:w-1/2 h-[50vh] lg:h-full p-4">
            <ThemePreview
              themeConfig={themeConfig}
              vsCodeTheme={vsCodeTheme}
              width="w-full"
              small={false}
              height="h-full md:h-[88vh]"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
