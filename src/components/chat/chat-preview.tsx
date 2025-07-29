'use client';

import { motion } from 'motion/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PROVIDERS } from '@/lib/providers';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import { useTinteTheme } from '@/hooks/use-tinte-theme';
import { useQueryState } from 'nuqs';
import { ThemeData } from '@/lib/theme-applier';

interface ChatPreviewProps {
  split: boolean;
}

export function ChatPreview({ split }: ChatPreviewProps) {
  const { activeThemeRef, allThemes, isDark } = useTinteTheme();
  const [provider] = useQueryState('provider');

  const currentProvider = provider ? PROVIDERS[provider] : PROVIDERS.shadcn;

  if (!split) return null;

  return (
    <motion.main
      key="preview"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: 'spring', ...CHAT_CONFIG.ANIMATION.PREVIEW_SPRING }}
      className="size-full p-4 overflow-hidden"
    >
      <ScrollArea className="h-[calc(100dvh-var(--header-height)_-_2.5rem)]">
        <currentProvider.Preview theme={activeThemeRef.current || allThemes[0] as ThemeData} mode={isDark ? 'dark' : 'light'} />
      </ScrollArea>
    </motion.main>
  );
}