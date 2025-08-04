'use client';

import { Slash } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProviderSwitcher } from '@/components/shared/provider-switcher';
import { ThemeSwitcher } from '../shared/theme-switcher';
import { siteConfig } from '@/config/site';
import { Button } from '../ui/button';
import GithubIcon from '../shared/icons/github';
import TwitterIcon from '../shared/icons/twitter';
import { Separator } from '../ui/separator';
import DiscordIcon from '../shared/icons/discord';
import { TinteCommandMenu } from '../tinte-command-menu';
import Link from 'next/link';

interface WorkbenchHeaderProps {
  chatId: string;
}

export function WorkbenchHeader({ chatId }: WorkbenchHeaderProps) {
  return (
    <header className="sticky px-3 md:px-4 flex items-center justify-between h-[var(--header-height)] top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <Link href="/">
          <Logo size={24} />
        </Link>
        <Slash className="w-4 h-4 text-border -rotate-[15deg] hidden sm:block" />
        <span className="font-medium text-sm truncate">
          {chatId.slice(0, 8)}
        </span>
        <Slash className="w-4 h-4 text-border -rotate-[15deg] hidden sm:block" />
        <ProviderSwitcher />
        <Separator orientation='vertical' className='!h-8 hidden md:block' />
        <div className="hidden lg:block">
          <TinteCommandMenu className="w-48" />
        </div>
      </div>

      <div className="flex h-full items-center gap-1 md:gap-2">
        <ThemeSwitcher variant='dual' />
        <Separator orientation='vertical' className='!h-8 hidden sm:block' />
        <div className="hidden sm:flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="h-4 w-4 [&>path]:!fill-muted-foreground" />
            </a>
          </Button>
          <div className="hidden md:flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer">
                <TwitterIcon className="h-4 w-4 [&>path]:!fill-muted-foreground" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
                <DiscordIcon className="h-4 w-4 [&>path]:!fill-muted-foreground" />
                <span className="sr-only">Discord</span>
              </a>
            </Button>
          </div>
        </div>
        <Separator orientation='vertical' className='!h-8 hidden sm:block' />
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
