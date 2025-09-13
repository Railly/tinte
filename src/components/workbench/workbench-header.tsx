"use client";

import { LogIn, Shuffle, Slash } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import Logo from "@/components/shared/logo";
import { ProviderSwitcher } from "@/components/shared/provider-switcher";
import { ThemeSelector } from "@/components/shared/theme-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";
import { authClient } from "@/lib/auth-client";
import type { ThemeData } from "@/lib/theme-tokens";
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

export function WorkbenchHeader({ chatId, userThemes = [] }: WorkbenchHeaderProps) {
  const { allThemes, activeTheme, handleThemeSelect, navigateTheme, addTheme } =
    useThemeContext();
  const { data: session } = authClient.useSession();
  const activeId = activeTheme?.id || null;

  // Add user themes to the theme context
  useEffect(() => {
    userThemes.forEach(userTheme => {
      const existingTheme = allThemes.find(t => t.id === userTheme.id);
      if (!existingTheme) {
        // Add user data to the theme before adding to context
        const themeWithUser: ThemeData = {
          ...userTheme,
          user: userTheme.user
        };
        addTheme(themeWithUser);
      }
    });
  }, [userThemes, allThemes, addTheme]);

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
            onSelect={handleThemeSelect}
            triggerClassName="w-[14rem]"
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
        {session ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
            <AvatarFallback>{(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <Button
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => authClient.signIn.social({ provider: "github" })}
          >
            <LogIn className="h-3 w-3 mr-1" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
