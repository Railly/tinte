'use client';

import { AnimatePresence } from 'motion/react';
import { useWorkbenchState } from '@/hooks/use-workbench-state';
import { useWorkbenchExports } from '@/hooks/use-workbench-exports';
import { WorkbenchSidebar } from './workbench-sidebar';
import { WorkbenchPreviewPane } from './workbench-preview-pane';

interface TinteWorkbenchProps {
  chatId: string;
}

export function TinteWorkbench({ chatId }: TinteWorkbenchProps) {
  const state = useWorkbenchState(chatId);
  
  const { handleExportAll, handleExportTinte } = useWorkbenchExports(
    state.tinteTheme,
    state.conversion,
    state.exportTheme
  );

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