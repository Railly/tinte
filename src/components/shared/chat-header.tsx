'use client';

import { Slash } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProviderSwitcher } from '@/components/shared/provider-switcher';
import { ThemeSwitcher } from './theme-switcher';
import { siteConfig } from '@/config/site';
import { Button } from '../ui/button';
import GithubIcon from './icons/github';
import TwitterIcon from './icons/twitter';
import { Separator } from '../ui/separator';
import DiscordIcon from './icons/discord';
import { TinteCommandMenu } from '../tinte-command-menu';
import Link from 'next/link';

interface ChatHeaderProps {
  chatId: string;
}

export function ChatHeader({ chatId }: ChatHeaderProps) {
  return (
    <header className="sticky px-4 flex items-center justify-between h-[var(--header-height)] top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Logo size={24} />
        </Link>
        <Slash className="w-4 h-4 text-border -rotate-[15deg]" />
        <span className="font-medium text-sm">
          {chatId.slice(0, 8)}
        </span>
        <Slash className="w-4 h-4 text-border -rotate-[15deg]" />
        <ProviderSwitcher />
        <Separator orientation='vertical' className='!h-8' />
        <TinteCommandMenu className="w-48" />
      </div>

      <div className="flex h-full items-center gap-2">
        <ThemeSwitcher variant='dual' />
        <Separator orientation='vertical' className='!h-8' />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
            <GithubIcon className="h-4 w-4 [&>path]:!fill-muted-foreground" />
          </a>
        </Button>
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
        <Separator orientation='vertical' className='!h-8' />
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
