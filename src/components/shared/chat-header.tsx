'use client';

import { Slash } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProviderSwitcher } from '@/components/shared/provider-switcher';

interface ChatHeaderProps {
  chatId: string;
}

export function ChatHeader({ chatId }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="relative flex h-12 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <Slash className="w-4 h-4 text-muted -rotate-[15deg] brightness-125" />
            <span className="font-medium text-sm">
              {chatId.slice(0, 8)}
            </span>
            <Slash className="w-4 h-4 text-muted -rotate-[15deg] brightness-125" />
            <ProviderSwitcher />
          </div>

          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}