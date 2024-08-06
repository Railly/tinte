import {
  IconTinte,
  IconEdit,
  IconLoading,
  IconDownload,
  IconSave,
  IconGlobe,
  IconLock,
  IconUser,
  IconShare,
  IconPalette,
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { ThemeConfig } from "@/lib/core/types";
import { useTheme } from "next-themes";
import { useThemeExport } from "@/lib/hooks/use-theme-export";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShareThemeDialog } from "./share-theme-dialog";
import { SignInDialog } from "./sign-in-dialog";
import { isThemeOwner } from "@/app/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";

export const Header = ({
  themeConfig,
  setThemeConfig,
}: {
  themeConfig: ThemeConfig;
  setThemeConfig: Dispatch<SetStateAction<ThemeConfig>>;
}): JSX.Element => {
  const user = useUser();
  const { theme } = useTheme();
  const { loading, exportVSIX } = useThemeExport();
  const [themeName, setThemeName] = useState(
    themeConfig.displayName || "My Awesome Theme",
  );
  const isEditing = themeConfig.displayName !== themeName;
  const [isUpdating, setIsUpdating] = useState(false);
  const canNotEdit = themeConfig.category !== "user";
  const router = useRouter();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  useEffect(() => {
    if (themeConfig.displayName) {
      setThemeName(themeConfig.displayName);
    }
  }, [themeConfig.displayName]);

  const handleExport = async () => {
    if (loading) return;
    await exportVSIX(themeConfig, theme === "dark");
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleUpdateName(themeConfig);
    }
  };

  const handleUpdateName = async (themeConfig: ThemeConfig) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/theme/${themeConfig.id}/name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: themeName,
          userId: user.user?.id,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to update theme. Please try again.");
        return;
      }
      toast.success("Theme updated successfully");
      setThemeConfig({ ...themeConfig, displayName: themeName });
      router.refresh();
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateThemeStatus = async (themeId: string, isPublic: boolean) => {
    try {
      toast.info(
        `Making ${themeConfig.displayName} ${isPublic ? "public" : "private"}`,
      );
      const response = await fetch(`/api/theme/${themeId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic, userId: user.user?.id }),
      });

      toast.dismiss();
      if (!response.ok) {
        toast.error("Failed to update theme status");
        return;
      }
      toast.success(`Theme is now ${isPublic ? "public" : "private"}`);
      setThemeConfig({ ...themeConfig, isPublic });
      router.refresh();
    } catch (error) {
      console.error("Error updating theme public status:", error);
      throw error;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeName(e.target.value);
  };

  return (
    <TooltipProvider>
      <header className="flex items-center justify-between py-2 px-4 h-14 border-b">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <IconTinte />
            <h1 className="text-md font-bold">tinte</h1>
          </Link>
          <Separator orientation="vertical" className="h-4 hidden md:block" />
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/gallery"
              className={cn(
                buttonVariants({ variant: "link" }),
                "px-0 text-muted-foreground hover:text-foreground",
              )}
            >
              Gallery
            </Link>
            <a
              href="https://github.com/Railly/tinte"
              className={cn(
                buttonVariants({ variant: "link" }),
                "px-0 text-muted-foreground hover:text-foreground",
              )}
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="flex-grow max-w-sm mx-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <span
                  className={cn(
                    "absolute left-2 top-2 transform",
                    canNotEdit && "opacity-50",
                  )}
                >
                  {themeConfig.isPublic ? (
                    <IconGlobe className="w-4 h-4 mr-2 text-cyan-700 dark:text-cyan-400" />
                  ) : (
                    <IconLock className="w-3.5 h-3.5 mr-2 text-rose-600 dark:text-rose-400" />
                  )}
                </span>
                <Input
                  value={themeName}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="text-center font-medium pr-10"
                  placeholder="Enter theme name"
                  disabled={canNotEdit}
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateName(themeConfig)}
                    >
                      {isUpdating ? (
                        <IconLoading className="w-4 h-4" />
                      ) : (
                        <IconSave className="w-4 h-4" />
                      )}
                    </Button>
                  ) : (
                    <IconEdit
                      className={cn("h-4 w-4", canNotEdit && "opacity-50")}
                    />
                  )}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">
                {canNotEdit ? "Can't edit system themes" : "Rename Theme"}
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HamburgerMenuIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/gallery">
                    <IconPalette className="w-4 h-4 mr-1" />
                    Gallery
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href="https://github.com/Railly/tinte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <GitHubLogoIcon className="w-4 h-4 mr-1" />
                    GitHub
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExport}
                  disabled={loading}
                  className="flex items-center"
                >
                  {loading ? (
                    <IconLoading className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <IconDownload className="w-4 h-4 mr-1" />
                  )}
                  <span>{loading ? "Exporting..." : "Export Theme"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    const dialog = document.querySelector(
                      "[data-share-dialog]",
                    ) as HTMLElement;
                    if (dialog) dialog.click();
                  }}
                  className="flex items-center"
                >
                  <IconShare className="w-4 h-4 mr-1" />
                  Share Theme
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ShareThemeDialog
              themeConfig={themeConfig}
              isOwner={isThemeOwner(user.user?.id, themeConfig)}
              canNotEdit={canNotEdit}
              updateThemeStatus={updateThemeStatus}
            />
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
          </div>
          <Separator
            orientation="vertical"
            className="h-4 mx-2 hidden md:block"
          />
          <div className="flex justify-center items-center">
            {!user.isLoaded ? (
              <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
            ) : user.isSignedIn ? (
              <UserButton />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSignInDialogOpen(true)}
              >
                <IconUser className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>
      <SignInDialog
        open={isSignInDialogOpen}
        setOpen={setIsSignInDialogOpen}
        redirectUrl={`/generator?theme=${themeConfig.name}`}
      />
    </TooltipProvider>
  );
};
