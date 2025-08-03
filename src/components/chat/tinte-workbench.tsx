'use client';

import { AnimatePresence } from 'motion/react';
import { useWorkbenchState } from '@/hooks/use-workbench-state';
import { useThemeContext } from '@/providers/theme';
import { useChatState } from '@/hooks/use-chat-state';
import { WorkbenchSidebar } from './workbench-sidebar';
import { StaticWorkbenchSidebar } from './static-workbench-sidebar';
import { WorkbenchPreviewPane } from './workbench-preview-pane';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import { ResponsiveWorkbench } from './responsive-workbench';

interface TinteWorkbenchProps {
  chatId: string;
  isStatic?: boolean;
}

export function TinteWorkbench({ chatId, isStatic = false }: TinteWorkbenchProps) {
  const state = useWorkbenchState(chatId, isStatic ? "design" : undefined);
  const { tinteTheme, handleExportAll, handleExportTinte } = useThemeContext();
  const chatState = useChatState(chatId);

  if (isStatic) {
    return (
      <>
        <div className="hidden md:flex h-[calc(100dvh-var(--header-height))] w-full overflow-hidden">
          <aside
            className="border-r bg-background flex flex-col flex-shrink-0"
            style={{ width: CHAT_CONFIG.SIDEBAR_WIDTH }}
          >
            <StaticWorkbenchSidebar
              activeTab={state.activeTab}
              onTabChange={state.setActiveTab}
            />
          </aside>

          <WorkbenchPreviewPane
            theme={tinteTheme}
            onExportAll={handleExportAll}
            onExportTinte={handleExportTinte}
          />
        </div>

        <div className="md:hidden">
          <ResponsiveWorkbench
            chatId={chatId}
            isStatic={true}
            activeTab={state.activeTab}
            onTabChange={state.setActiveTab}
            tinteTheme={tinteTheme}
            onExportAll={handleExportAll}
            onExportTinte={handleExportTinte}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden md:flex h-[calc(100dvh-var(--header-height))] w-full overflow-hidden">
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

      <div className="md:hidden">
        <ResponsiveWorkbench
          chatId={chatId}
          isStatic={false}
          activeTab={state.activeTab}
          onTabChange={state.setActiveTab}
          chatLoading={chatState.loading}
          chatSeed={chatState.seed}
          split={state.split}
          tinteTheme={tinteTheme}
          onExportAll={handleExportAll}
          onExportTinte={handleExportTinte}
        />
      </div>
    </>
  );
}