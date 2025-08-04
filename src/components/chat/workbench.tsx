'use client';

import { AnimatePresence } from 'motion/react';
import { useWorkbenchState } from '@/hooks/use-workbench-state';
import { useThemeContext } from '@/providers/theme';
import { useChatState } from '@/hooks/use-chat-state';
import { useIsMobile } from '@/hooks/use-mobile';
import { WorkbenchSidebar } from './workbench-sidebar';
import { WorkbenchPreviewPane } from './workbench-preview-pane';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import { ResponsiveWorkbench } from './responsive-workbench';

interface WorkbenchProps {
  chatId: string;
  isStatic?: boolean;
}

export function Workbench({ chatId, isStatic = false }: WorkbenchProps) {
  const state = useWorkbenchState(chatId, isStatic ? "design" : undefined);
  const { tinteTheme, handleExportAll, handleExportTinte } = useThemeContext();
  const chatState = useChatState(chatId);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ResponsiveWorkbench
        chatId={chatId}
        isStatic={isStatic}
        activeTab={state.activeTab}
        onTabChange={state.setActiveTab}
        tinteTheme={tinteTheme}
        onExportAll={handleExportAll}
        onExportTinte={handleExportTinte}
        chatLoading={chatState.loading}
        chatSeed={chatState.seed}
        split={state.split}
      />
    );
  }

  if (isStatic) {
    return (
      <div className="h-[calc(100dvh-var(--header-height))] w-full overflow-hidden flex">
        <aside
          className="border-r bg-background flex flex-col flex-shrink-0"
          style={{ width: CHAT_CONFIG.SIDEBAR_WIDTH }}
        >
          <WorkbenchSidebar
            activeTab={state.activeTab}
            onTabChange={state.setActiveTab}
            isStatic={true}
          />
        </aside>

        <WorkbenchPreviewPane
          theme={tinteTheme}
          onExportAll={handleExportAll}
          onExportTinte={handleExportTinte}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-var(--header-height))] w-full overflow-hidden flex">
      <WorkbenchSidebar
        split={state.split}
        activeTab={state.activeTab}
        onTabChange={state.setActiveTab}
        chatLoading={chatState.loading}
        chatSeed={chatState.seed}
      />

      <AnimatePresence>
        {state.split && (
          <WorkbenchPreviewPane
            theme={tinteTheme}
            onExportAll={handleExportAll}
            onExportTinte={handleExportTinte}
          />
        )}
      </AnimatePresence>
    </div>
  );
}