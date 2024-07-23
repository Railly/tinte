/* eslint-disable @next/next/no-img-element */
"use client";
import { ThemeConfig } from "@/lib/core/types";
import { useUser } from "@clerk/nextjs";
import { ShareThemeDialog } from "./share-theme-dialog";
import { Button, buttonVariants } from "./ui/button";
import { IconDownload, IconEdit, IconHeart } from "./ui/icons";
import Link from "next/link";
import { useMemo } from "react";
import { generateVSCodeTheme } from "@/lib/core";
import { ThemePreview } from "./theme-preview";
import { cn } from "@/lib/utils";
import { LandingHeader } from "./landing-header";

export function ThemePageContent({
  themeConfig,
}: {
  themeConfig: ThemeConfig;
}) {
  const { user } = useUser();
  const isOwner = user?.id === themeConfig.user?.clerk_id;
  const vsCodeTheme = useMemo(
    () => generateVSCodeTheme(themeConfig),
    [themeConfig]
  );

  const updateThemeStatus = async (themeId: string, isPublic: boolean) => {
    // Implement the API call to update theme status
    console.log(
      `Updating theme ${themeId} to ${isPublic ? "public" : "private"}`
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <LandingHeader />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <ThemePreview
                vsCodeTheme={vsCodeTheme}
                width="w-full"
                small={false}
                height="h-[80vh]"
              />
            </div>
            <div className="w-full md:w-1/3">
              <div className="bg-card rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4">
                  {themeConfig.displayName}
                </h1>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={themeConfig.user?.image_url || ""}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">
                      {themeConfig.user?.username || "Anonymous"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Theme Creator
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{themeConfig.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Visibility</span>
                    <span className="font-medium">
                      {themeConfig.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Likes</span>
                    <span className="font-medium flex items-center gap-1">
                      <IconHeart className="w-4 h-4" />0
                    </span>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <Button className="w-full" onClick={() => {}}>
                    <IconHeart className="mr-2 h-4 w-4" />
                    Like
                  </Button>
                  <Button variant="outline" className="w-full">
                    <IconDownload className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  {isOwner && (
                    <Link
                      href={`/edit/${themeConfig.id}`}
                      className={cn(
                        "w-full",
                        buttonVariants({ variant: "secondary" })
                      )}
                    >
                      <IconEdit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  )}
                  <ShareThemeDialog
                    themeConfig={themeConfig}
                    isOwner={isOwner}
                    canNotEdit={!isOwner}
                    updateThemeStatus={updateThemeStatus}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
