import {
  IconTinte,
  IconShare,
  IconEdit,
  IconLoading,
  IconDownload,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { ThemeConfig } from "@/lib/core/types";
import { useTheme } from "next-themes";
import { useThemeExport } from "@/lib/hooks/use-theme-export";

export const Header = ({
  themeConfig,
}: {
  themeConfig: ThemeConfig;
}): JSX.Element => {
  const user = useUser();
  const { theme } = useTheme();
  const { loading, exportVSIX } = useThemeExport();
  const [themeName, setThemeName] = useState(
    themeConfig.displayName || "My Awesome Theme"
  );

  useEffect(() => {
    if (themeConfig.displayName) {
      setThemeName(themeConfig.displayName);
    }
  }, [themeConfig.displayName]);

  const handleSave = () => {
    // Implement save functionality
    console.log("Saving theme:", themeName);
  };

  const handleGenerate = () => {
    // Implement generate functionality
    console.log("Generating theme:", themeName);
  };

  const handleExport = async () => {
    if (loading) return;
    await exportVSIX(themeConfig, theme === "dark");
  };

  return (
    <TooltipProvider>
      <header className="flex items-center justify-between gap-4 py-2 px-4 h-14 border-b">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <IconTinte />
            <h1 className="text-md font-bold">tinte</h1>
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "link" }), "px-0")}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className={cn(buttonVariants({ variant: "link" }), "px-0")}
            >
              Gallery
            </Link>
          </div>
        </div>
        <div className="flex-grow max-w-sm mx-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Input
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  className="text-center font-medium pr-7"
                  placeholder="Enter theme name"
                  disabled
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <IconEdit />
                </span>
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <span className="text-xs">Rename</span>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={handleSave}>
                <IconSave />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Save Theme</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={handleGenerate}>
                <IconGenerate />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Generate with AI</span>
            </TooltipContent>
          </Tooltip> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="mr-2" variant="outline" disabled>
                <IconShare />
                <span className="ml-2">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Share Theme</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled={loading} onClick={handleExport}>
                {loading ? (
                  <IconLoading className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <IconDownload className="w-4 h-4 mr-2" />
                )}
                <span>{loading ? "Exporting..." : "Export"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Export Theme</span>
            </TooltipContent>
          </Tooltip>
          {/* Profile Template with initials RH */}
          <Separator orientation="vertical" className="h-4 mx-2" />
          <div className="w-8 h-8 flex justify-center items-center">
            {!user.isLoaded ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : (
              <UserButton />
            )}
          </div>
          {/* <ThemeSelector /> */}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <a
                className={cn(buttonVariants({ variant: "ghost" }))}
                href="https://donate.railly.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconHeart />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Support</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className={cn(buttonVariants({ variant: "ghost" }))}
                href="https://github.com/Railly/tinte"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconGithub className="text-foreground" />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">Github</span>
            </TooltipContent>
          </Tooltip> */}
          {/* <SubscriptionForm /> */}
        </div>
      </header>
    </TooltipProvider>
  );
};
