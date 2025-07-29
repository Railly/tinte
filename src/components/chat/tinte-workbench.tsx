'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Download, RefreshCcw, Sun, Moon } from 'lucide-react';

import { PROVIDERS, ThemeMode } from '@/lib/providers';
import { ALL_PROVIDERS } from '@/config/providers';
import { ProviderDesignPanel } from '@/components/shared/provider-design-panel';
import { ChatContent } from './chat-content';
import { MappingPanel } from './mapping-panel';
import { useTokenEditor } from '@/hooks/use-token-editor';
import { useTinteTheme } from '@/hooks/use-tinte-theme';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import type { ThemeData as AppThemeData } from '@/lib/theme-applier';
import { useQueryState } from 'nuqs';
import { ScrollArea } from '../ui/scroll-area';
import { useChatState } from '@/hooks/use-chat-state';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';

interface TinteWorkbenchProps {
  chatId: string;
}

export function TinteWorkbench({ chatId }: TinteWorkbenchProps) {
  const { seed, split, loading } = useChatState(chatId);
  const [tab, setTab] = useState<'chat' | 'design' | 'mapping'>('chat');
  const [provider] = useQueryState('provider', { defaultValue: 'shadcn' });
  const [mode, setMode] = useState<ThemeMode>('light');

  const { activeThemeRef, handleThemeSelect, allThemes, isDark } = useTinteTheme();
  const { currentTokens, handleTokenEdit, resetTokens } = useTokenEditor(activeThemeRef.current, isDark);

  const handleThemeSelectWithReset = (selectedTheme: AppThemeData) => {
    handleThemeSelect(selectedTheme);
    resetTokens();
  };

  // Get current provider adapter
  const currentProviderKey = provider ? provider : 'shadcn';
  const currentProvider = PROVIDERS[currentProviderKey];
  const currentProviderConfig = ALL_PROVIDERS.find(p => p.id === currentProviderKey) || ALL_PROVIDERS[0];
  const currentTheme = activeThemeRef.current || allThemes[0] as AppThemeData;

  return (
    <div className="flex h-[calc(100dvh-var(--header-height))] w-full overflow-hidden">
      <motion.aside
        initial={{ width: '100%' }}
        animate={{ width: split ? CHAT_CONFIG.SIDEBAR_WIDTH : '100%' }}
        transition={{ type: 'spring', ...CHAT_CONFIG.ANIMATION.SPRING }}
        className="border-r bg-background flex flex-col flex-shrink-0"
        style={{ willChange: 'width' }}
      >
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="flex flex-col h-full">
          <TabsList className="m-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="mapping">Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1">
            <ChatContent loading={loading} seed={seed} />
          </TabsContent>

          <TabsContent value="design" className="flex-1">
            <ProviderDesignPanel
              activeThemeRef={activeThemeRef}
              allThemes={allThemes}
              currentTokens={currentTokens}
              onTokenEdit={handleTokenEdit}
              onThemeSelect={handleThemeSelectWithReset}
            />
          </TabsContent>

          <TabsContent value="mapping" className="flex-1">
            <MappingPanel
              provider={currentProviderKey}
              mode={mode}
              theme={currentTheme}
            />
          </TabsContent>
        </Tabs>
      </motion.aside>

      <AnimatePresence>
        {split && (
          <motion.main
            key="preview"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: 'spring', ...CHAT_CONFIG.ANIMATION.PREVIEW_SPRING }}
            className="flex flex-col overflow-hidden"
          >
            <RightPaneHeader
              provider={currentProviderConfig}
              mode={mode}
              setMode={setMode}
              onExport={() => {
                if (currentProvider?.export) {
                  const exportData = currentProvider.export(currentTheme);
                  console.log('Export for', currentProviderConfig.name, exportData);
                }
              }}
            />
            <Separator />

            <PreviewContent
              provider={currentProvider}
              providerConfig={currentProviderConfig}
              theme={currentTheme}
              mode={mode}
            />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Right Pane Header */
function RightPaneHeader({
  provider,
  mode,
  setMode,
  onExport,
}: {
  provider: { id: string; name: string; icon: React.ComponentType<{ className?: string }> };
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  onExport: () => void;
}) {
  const Icon = provider.icon;

  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium text-sm">{provider.name}</span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher variant="dual" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport}>
              Export for {provider.name}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Export Tinte JSON')}>
              Export Tinte JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" onClick={() => location.reload()} className="h-8 w-8 p-0">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* Preview Content */
function PreviewContent({
  provider,
  providerConfig,
  theme,
  mode,
}: {
  provider: any;
  providerConfig: { id: string; name: string; icon: React.ComponentType<{ className?: string }> };
  theme: AppThemeData;
  mode: ThemeMode;
}) {
  const PreviewComponent = provider?.Preview;

  if (!PreviewComponent) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No preview available for {providerConfig.name}
      </div>
    );
  }

  return (
    <ScrollArea className="p-4 h-[calc(100dvh-var(--header-height)_-_4.5rem)]">
      <PreviewComponent theme={theme} mode={mode} />
    </ScrollArea>
  );
}