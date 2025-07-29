'use client';

import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProviderDesignPanel } from '@/components/shared/provider-design-panel';
import { ChatContent } from './chat-content';
import { useTokenEditor } from '@/hooks/use-token-editor';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import type { SeedPayload } from '@/utils/seed-mapper';
import type { ThemeData as AppThemeData } from '@/lib/theme-applier';
import { useTinteTheme } from '@/hooks/use-tinte-theme';

interface ChatSidebarProps {
  split: boolean;
  loading: boolean;
  seed: SeedPayload | null;
}

export function ChatSidebar({
  split,
  loading,
  seed,
}: ChatSidebarProps) {
  const { activeThemeRef, handleThemeSelect, allThemes } = useTinteTheme();
  const { currentTokens, handleTokenEdit, resetTokens } = useTokenEditor();

  const handleThemeSelectWithReset = (selectedTheme: AppThemeData) => {
    resetTokens();
    handleThemeSelect(selectedTheme);
  };
  return (
    <motion.aside
      initial={{ width: '100%' }}
      animate={{ width: split ? CHAT_CONFIG.SIDEBAR_WIDTH : '100%' }}
      transition={{ type: 'spring', ...CHAT_CONFIG.ANIMATION.SPRING }}
      className="border-r border-border bg-background flex flex-col"
      style={{ willChange: 'width' }}
    >
      <Tabs defaultValue="chat" className="flex flex-col">
        <TabsList className="mx-3 mt-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex flex-1 flex-col mt-0">
          <ChatContent loading={loading} seed={seed} />
        </TabsContent>

        <TabsContent value="design" className="flex flex-col mt-0">
          <ProviderDesignPanel
            activeThemeRef={activeThemeRef}
            allThemes={allThemes}
            currentTokens={currentTokens}
            onTokenEdit={handleTokenEdit}
            onThemeSelect={handleThemeSelectWithReset}
          />
        </TabsContent>
      </Tabs>
    </motion.aside>
  );
}