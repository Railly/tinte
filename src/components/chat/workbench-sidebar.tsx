import { motion } from 'motion/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProviderDesignPanel } from '@/components/shared/provider-design-panel';
import { ChatContent } from './chat-content';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import type { WorkbenchTab, UseWorkbenchStateReturn } from '@/hooks/use-workbench-state';
import { useTheme } from '@/hooks/use-theme';

interface WorkbenchSidebarProps {
  split: boolean;
  activeTab: WorkbenchTab;
  onTabChange: (tab: WorkbenchTab) => void;
  state: Pick<UseWorkbenchStateReturn,
    'seed' | 'loading' | 'currentTheme' | 'tinteTheme' |
    'currentTokens' | 'handleTokenEdit' | 'handleThemeSelect' | 'currentProvider' | 'isDark' | 'tokensLoading'
  >;
}

const TAB_CONFIG = [
  { id: 'chat' as const, label: 'Chat' },
  { id: 'design' as const, label: 'Design' },
];

export function WorkbenchSidebar({
  split,
  activeTab,
  onTabChange,
  state
}: WorkbenchSidebarProps) {
  const { allThemes } = useTheme();

  return (
    <motion.aside
      initial={{ width: '100%' }}
      animate={{ width: split ? CHAT_CONFIG.SIDEBAR_WIDTH : '100%' }}
      transition={{ type: 'spring', ...CHAT_CONFIG.ANIMATION.SPRING }}
      className="border-r bg-background flex flex-col flex-shrink-0"
      style={{ willChange: 'width' }}
    >
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as WorkbenchTab)}
        className="flex flex-col h-full"
      >
        <TabsList className="m-3">
          {TAB_CONFIG.map(({ id, label }) => (
            <TabsTrigger key={id} value={id}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="chat" className="flex-1">
          <ChatContent loading={state.loading} seed={state.seed as any} />
        </TabsContent>

        <TabsContent value="design" className="flex-1">
          <ProviderDesignPanel
            activeTheme={state.currentTheme}
            allThemes={allThemes}
            currentTokens={state.currentTokens}
            onTokenEdit={state.handleTokenEdit}
            onThemeSelect={state.handleThemeSelect}
            tokensLoading={state.tokensLoading}
          />
        </TabsContent>
      </Tabs>
    </motion.aside>
  );
}