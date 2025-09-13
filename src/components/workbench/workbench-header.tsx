"use client";

import { Shuffle, Slash } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Logo from "@/components/shared/logo";
import { ProviderSwitcher } from "@/components/shared/provider-switcher";
import { ThemeSelector } from "@/components/shared/theme-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";
import type { ThemeData } from "@/lib/theme-tokens";
import { useThemeContext } from "@/providers/theme";
import { generateThemeFromChatId } from "@/utils/tinte-presets";
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
  const activeId = activeTheme?.id || null;
  const initializedChats = useRef(new Set<string>());

  // Add user themes to the theme context
  useEffect(() => {
    userThemes.forEach(userTheme => {
      const existingTheme = allThemes.find(t => t.id === userTheme.id);
      if (!existingTheme) {
        addTheme(userTheme as ThemeData);
      }
    });
  }, [userThemes, allThemes, addTheme]);

  useEffect(() => {
    if (initializedChats.current.has(chatId)) return;

    const chatThemeId = `chat-${chatId}`;
    const existingChatTheme = allThemes.find((t) => t.id === chatThemeId);

    if (!existingChatTheme) {
      const generatedTheme = generateThemeFromChatId(chatId);
      const chatTheme: ThemeData = {
        id: chatThemeId,
        name: `Chat ${chatId.slice(0, 8)}`,
        description: `Generated theme for chat ${chatId}`,
        author: "tinte",
        provider: "tinte",
        downloads: 0,
        likes: 0,
        views: 0,
        createdAt: new Date().toISOString().split("T")[0],
        colors: {
          primary: generatedTheme.light.pr,
          secondary: generatedTheme.light.sc,
          accent: generatedTheme.light.ac_1,
          background: generatedTheme.light.bg,
          foreground: generatedTheme.light.tx,
        },
        tags: ["chat", "generated"],
        rawTheme: generatedTheme,
      };

      addTheme(chatTheme);
      handleThemeSelect(chatTheme);
    }

    initializedChats.current.add(chatId);
  }, [chatId, allThemes, addTheme, handleThemeSelect]);

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
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
