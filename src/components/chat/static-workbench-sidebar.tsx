import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProviderDesignPanel } from '@/components/shared/provider-design-panel';
import { ChatContent } from './chat-content';
import type { WorkbenchTab, UseWorkbenchStateReturn } from '@/hooks/use-workbench-state';
import { ThemeData } from '@/lib/theme-applier';

interface StaticWorkbenchSidebarProps {
  activeTab: WorkbenchTab;
  onTabChange: (tab: WorkbenchTab) => void;
  state: Pick<UseWorkbenchStateReturn,
    'seed' | 'loading' | 'currentTheme' | 'tinteTheme' | 'allThemes' |
    'currentTokens' | 'handleTokenEdit' | 'handleThemeSelect' | 'currentProvider' | 'isDark'
  >;
}

const TAB_CONFIG = [
  { id: 'chat' as const, label: 'Chat' },
  { id: 'design' as const, label: 'Design' },
];

export function StaticWorkbenchSidebar({
  activeTab,
  onTabChange,
  state
}: StaticWorkbenchSidebarProps) {

  return (
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

      <TabsContent value="chat" className="flex-1 m-0 p-0">
        <ChatContent
          seed={state.seed}
          loading={state.loading}
        />
      </TabsContent>

      <TabsContent value="design" className="flex-1 m-0 p-0">
        <ProviderDesignPanel
          allThemes={state.allThemes as ThemeData[]}
          activeTheme={state.currentTheme}
          currentTokens={state.currentTokens}
          onTokenEdit={state.handleTokenEdit}
          onThemeSelect={state.handleThemeSelect}
          tokensLoading={state.tokensLoading}
        />
      </TabsContent>
    </Tabs>
  );
}