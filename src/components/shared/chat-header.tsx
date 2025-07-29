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

interface ChatHeaderProps {
  chatId: string;
}

export function ChatHeader({ chatId }: ChatHeaderProps) {
  return (
    <header className="sticky px-4 flex items-center justify-between h-[var(--header-height)] top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex items-center gap-3">
        <Logo size={24} />
        <Slash className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-sm">
          {chatId.slice(0, 8)}
        </span>
        <Slash className="w-4 h-4 text-muted-foreground" />
        <ProviderSwitcher />
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
            <GithubIcon className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
          <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer">
            <TwitterIcon className="h-4 w-4" />
          </a>
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
