"use client";

import { Heart, Shuffle, Slash } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import Logo from "@/components/shared/logo";
import { ProviderSwitcher } from "@/components/shared/provider-switcher";
import { ThemeSelector } from "@/components/shared/theme-selector";
import { UserDropdown } from "@/components/shared/user-dropdown";
import { siteConfig } from "@/config/site";
import { authClient } from "@/lib/auth-client";
import type { ThemeData } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme";
import type { UserThemeData } from "@/types/user-theme";
import { SocialsDropdown } from "../shared/socials-dropdown";
import { ThemeSwitcher } from "../shared/theme-switcher";
import { TinteCommandMenu } from "../tinte-command-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface WorkbenchHeaderProps {
  themeSlug: string;
  userThemes?: UserThemeData[];
  tweakCNThemes?: UserThemeData[];
  tinteThemes?: UserThemeData[];
  raysoThemes?: UserThemeData[];
}

export function WorkbenchHeader({
  themeSlug,
  userThemes = [],
  tweakCNThemes = [],
  tinteThemes = [],
  raysoThemes = [],
}: WorkbenchHeaderProps) {
  const {
    allThemes,
    activeTheme,
    handleThemeSelect,
    navigateTheme,
    addThemes,
    isAuthenticated,
    mounted,
    favoritesLoaded,
    toggleFavorite,
    getFavoriteStatus,
  } = useThemeContext();
  authClient.useSession();
  const activeId = activeTheme?.id || null;
  // Add themes to store once on mount
  useEffect(() => {
    if (!mounted) return;

    const allNewThemes: ThemeData[] = [
      ...userThemes.map((theme) => ({ ...theme, user: theme.user })),
      ...tweakCNThemes,
      ...tinteThemes,
      ...raysoThemes,
    ];

    if (allNewThemes.length > 0) {
      addThemes(allNewThemes);
    }
  }, [mounted]); // Only depend on mounted to run once

  // Get current favorite state using global store
  const isFavorite =
    activeTheme?.id && mounted && favoritesLoaded
      ? getFavoriteStatus(activeTheme.id)
      : false;

  // Handle toggle favorite using global store
  const handleToggleFavorite = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please sign in to add favorites");
        return;
      }

      if (!activeTheme?.id) {
        toast.error("No theme selected");
        return;
      }

      // Show immediate feedback
      const newFavoriteState = !isFavorite;
      if (newFavoriteState) {
        toast.success("Added to favorites!");
      } else {
        toast.success("Removed from favorites!");
      }

      // Use global store action (handles optimistic updates and server sync)
      const success = await toggleFavorite(activeTheme.id);

      if (!success) {
        toast.error("Failed to update favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite");
    }
  };

  return (
    <header className="sticky px-3 md:px-4 flex items-center justify-between h-[var(--header-height)] top-0 z-50 w-full border-b bg-background/95 backdrop-blur shrink-0">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Link href="/">
          <Logo size={24} />
        </Link>
        <Slash className="w-4 h-4 text-border -rotate-[15deg] hidden sm:block" />
        <div className="flex items-center gap-2 min-w-0">
          <ThemeSelector
            key={`theme-selector-${allThemes.length}`}
            themes={allThemes}
            activeId={activeId}
            activeTheme={activeTheme}
            onSelect={handleThemeSelect}
            triggerClassName="w-[15rem]"
            label="Select theme…"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleFavorite}
            className="h-8 w-8 p-0"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            disabled={!isAuthenticated || !mounted || !favoritesLoaded}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-current text-destructive" : ""}`}
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateTheme("random")}
            className="h-8 w-8 p-0"
            title="Random theme"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
        <Slash className="w-4 h-4 text-border -rotate-[15deg] hidden sm:block" />
        <ProviderSwitcher />
      </div>

      <div className="flex h-full items-center gap-1 md:gap-2">
        <div className="hidden lg:block">
          <TinteCommandMenu className="w-48" />
        </div>
        <ThemeSwitcher />
        <Separator orientation="vertical" className="!h-8 hidden sm:block" />
        <SocialsDropdown />
        <Separator orientation="vertical" className="!h-8 hidden sm:block" />
        <UserDropdown avatarSize="sm" />
      </div>
    </header>
  );
}
