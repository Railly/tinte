"use client";

import { Save, Shuffle, Slash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Logo from "@/components/shared/logo";
import { ProviderSwitcher } from "@/components/shared/provider-switcher";
import { SaveThemeDialog } from "@/components/shared/save-theme-dialog";
import { ThemeSelector } from "@/components/shared/theme-selector";
import { UserDropdown } from "@/components/shared/user-dropdown";
import { siteConfig } from "@/config/site";
import { authClient } from "@/lib/auth-client";
import type { ThemeData } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/providers/theme";
import type { UserThemeData } from "@/types/user-theme";
import DiscordIcon from "../shared/icons/discord";
import GithubIcon from "../shared/icons/github";
import TwitterIcon from "../shared/icons/twitter";
import { ThemeSwitcher } from "../shared/theme-switcher";
import { TinteCommandMenu } from "../tinte-command-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface WorkbenchHeaderProps {
  chatId: string;
  userThemes?: UserThemeData[];
}

export function WorkbenchHeader({
  chatId,
  userThemes = [],
}: WorkbenchHeaderProps) {
  const {
    allThemes,
    activeTheme,
    handleThemeSelect,
    navigateTheme,
    addTheme,
    unsavedChanges,
    isSaving,
    canSave,
    saveCurrentTheme,
    user,
    isAuthenticated,
    isAnonymous,
  } = useThemeContext();
  const { data: session } = authClient.useSession();
  const activeId = activeTheme?.id || null;
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Add user themes to the theme context
  useEffect(() => {
    userThemes.forEach((userTheme) => {
      const existingTheme = allThemes.find((t) => t.id === userTheme.id);
      if (!existingTheme) {
        // Add user data to the theme before adding to context
        const themeWithUser: ThemeData = {
          ...userTheme,
          user: userTheme.user,
        };
        addTheme(themeWithUser);
      }
    });
  }, [userThemes, allThemes, addTheme]);

  // Check if this is a user's own editable theme (consistent with store logic)
  const isOwnTheme =
    activeTheme?.user?.id === user?.id ||
    activeTheme?.author === "You" ||
    (activeTheme?.id && activeTheme.id.startsWith("theme_") && user);

  const isCustomTheme =
    activeTheme?.name?.includes("Custom") || activeTheme?.id?.startsWith("custom_");
  const shouldShowSaveButton =
    (isOwnTheme || isCustomTheme) && (canSave || isAnonymous);

  // Handle save theme - direct update for own themes, modal for custom unsaved
  const handleSaveTheme = async () => {
    if (!canSave) {
      toast.error("Please sign in to save themes");
      return;
    }

    if (!unsavedChanges) {
      toast.success("Theme is already up to date");
      return;
    }

    // Check if this is the user's own theme that already exists in the database
    const isOwnExistingTheme =
      isOwnTheme &&
      activeTheme?.id &&
      !activeTheme.id.startsWith("custom_") &&
      (activeTheme.id.startsWith("theme_") || (activeTheme.user?.id === user?.id));


    // If it's the user's own existing theme, update directly without modal
    if (isOwnExistingTheme) {
      try {
        const success = await saveCurrentTheme();
        if (success) {
          toast.success("Theme updated successfully!");
        } else {
          toast.error("Failed to update theme");
        }
      } catch (error) {
        console.error("Error updating theme:", error);
        toast.error("Error updating theme");
      }
      return;
    }

    // For custom unsaved themes or new themes, show the modal
    setShowSaveDialog(true);
  };

  // Handle actual save with name from modal
  const handleSaveWithName = async (name: string, makePublic: boolean) => {
    try {
      const success = await saveCurrentTheme(name, makePublic);
      if (success) {
        toast.success("Theme saved successfully!");
      } else {
        toast.error("Failed to save theme");
      }
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Error saving theme");
      throw error; // Re-throw so modal can handle error state
    }
  };

  // Get default theme name for modal
  const getDefaultThemeName = () => {
    if (activeTheme.name.includes("(unsaved)")) {
      return activeTheme.name.replace(" (unsaved)", "");
    }
    if (activeTheme.name === "Custom" || activeTheme.name.includes("Custom")) {
      return "My Custom Theme";
    }
    return activeTheme.name;
  };

  return (
    <header className="sticky px-3 md:px-4 flex items-center justify-between h-[var(--header-height)] top-0 z-50 w-full border-b bg-background/95 backdrop-blur shrink-0">
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <Link href="/">
          <Logo size={24} />
        </Link>
        <Slash className="w-4 h-4 text-border -rotate-[15deg] hidden sm:block" />
        <div className="flex items-center gap-2 min-w-0">
          <ThemeSelector
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
            onClick={() => navigateTheme("random")}
            className="h-8 w-8 p-0"
            title="Random theme"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          {shouldShowSaveButton && (
            <Button
              onClick={handleSaveTheme}
              disabled={isSaving || (!canSave && !isAnonymous)}
              variant="default"
              size="icon"
              className={cn(
                "h-8 w-8 p-0 relative transition-all duration-200",
                unsavedChanges && canSave ? "" : "grayscale opacity-50",
              )}
              title={
                !canSave && !isAnonymous
                  ? "Sign in to save themes"
                  : isSaving
                    ? "Saving..."
                    : unsavedChanges
                      ? "Save changes"
                      : "No changes to save"
              }
            >
              <Save className={cn("h-4 w-4", isSaving && "animate-spin")} />
              {unsavedChanges && canSave && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              )}
            </Button>
          )}
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
        <div className="hidden sm:flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="h-4 w-4 [&>path]:!fill-muted-foreground" />
            </a>
          </Button>
          <div className="hidden md:flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon className="h-4 w-4 [&>path]:!fill-muted-foreground" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DiscordIcon className="h-4 w-4 [&>path]:!fill-muted-foreground" />
                <span className="sr-only">Discord</span>
              </a>
            </Button>
          </div>
        </div>
        <Separator orientation="vertical" className="!h-8 hidden sm:block" />
        <UserDropdown avatarSize="sm" />
      </div>

      {/* Save Theme Dialog */}
      <SaveThemeDialog
        isOpen={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSaveWithName}
        defaultName={getDefaultThemeName()}
        isLoading={isSaving}
      />
    </header>
  );
}
