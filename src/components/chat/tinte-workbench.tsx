'use client';

import { AnimatePresence } from 'motion/react';
import { useWorkbenchState } from '@/hooks/use-workbench-state';
import { useWorkbenchExports } from '@/hooks/use-workbench-exports';
import { WorkbenchSidebar } from './workbench-sidebar';
import { StaticWorkbenchSidebar } from './static-workbench-sidebar';
import { WorkbenchPreviewPane } from './workbench-preview-pane';
import { CHAT_CONFIG } from '@/lib/chat-constants';

interface TinteWorkbenchProps {
  chatId: string;
  isStatic?: boolean;
}

export function TinteWorkbench({ chatId, isStatic = false }: TinteWorkbenchProps) {
  const state = useWorkbenchState(chatId, isStatic ? "design" : undefined);
  
  const { handleExportAll, handleExportTinte } = useWorkbenchExports(
    state.tinteTheme,
    state.conversion,
    state.exportTheme
  );

  if (isStatic) {
    return (
      <div className="flex h-[calc(100dvh-var(--header-height))] w-full overflow-hidden">
        <aside 
          className="border-r bg-background flex flex-col flex-shrink-0"
          style={{ width: CHAT_CONFIG.SIDEBAR_WIDTH }}
        >
          <StaticWorkbenchSidebar
            activeTab={state.activeTab}
            onTabChange={state.setActiveTab}
            state={state}
          />
        </aside>
        
        <WorkbenchPreviewPane
          theme={state.tinteTheme}
          onExportAll={handleExportAll}
          onExportTinte={handleExportTinte}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-var(--header-height))] w-full overflow-hidden">
      <WorkbenchSidebar
        split={state.split}
        activeTab={state.activeTab}
        onTabChange={state.setActiveTab}
        state={state}
      />

      <AnimatePresence>
        {state.split && (
          <WorkbenchPreviewPane
            theme={state.tinteTheme}
            onExportAll={handleExportAll}
            onExportTinte={handleExportTinte}
          />
        )}
      </AnimatePresence>
    </div>
  );
}