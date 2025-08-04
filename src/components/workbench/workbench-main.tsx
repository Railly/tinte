'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useWorkbench } from '@/hooks/use-workbench';
import { useIsMobile } from '@/hooks/use-mobile';
import { WorkbenchSidebar } from './workbench-sidebar';
import { WorkbenchPreviewPane } from './workbench-preview-pane';
import { WorkbenchMobile } from './workbench-mobile';
import { CHAT_CONFIG } from '@/lib/chat-constants';

interface WorkbenchMainProps {
  chatId: string;
  isStatic?: boolean;
}

export function WorkbenchMain({ chatId, isStatic = false }: WorkbenchMainProps) {
  const {
    activeTab,
    split,
    loading,
    initializeWorkbench,
    tinteTheme,
    handleExportAll,
    handleExportTinte,
    setActiveTab
  } = useWorkbench(isStatic ? 'design' : 'chat');
  
  const isMobile = useIsMobile();

  useEffect(() => {
    const cleanup = initializeWorkbench(chatId, isStatic);
    return cleanup;
  }, [chatId, isStatic, initializeWorkbench]);

  // Mobile layout
  if (isMobile) {
    return (
      <WorkbenchMobile
        chatId={chatId}
        isStatic={isStatic}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tinteTheme={tinteTheme}
        onExportAll={handleExportAll}
        onExportTinte={handleExportTinte}
        chatLoading={loading}
        split={split}
      />
    );
  }

  // Static layout (design mode)
  if (isStatic) {
    return (
      <div className="h-[calc(100dvh-var(--header-height))] w-full overflow-hidden flex">
        <aside
          className="border-r bg-background flex flex-col flex-shrink-0"
          style={{ width: CHAT_CONFIG.SIDEBAR_WIDTH }}
        >
          <WorkbenchSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            chatLoading={loading}
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

  // Dynamic layout (default)
  return (
    <div className="h-[calc(100dvh-var(--header-height))] w-full overflow-hidden flex">
      <motion.aside
        initial={{ width: '100%' }}
        animate={{ width: split ? CHAT_CONFIG.SIDEBAR_WIDTH : '100%' }}
        transition={{ type: 'spring', ...CHAT_CONFIG.ANIMATION.SPRING }}
        className="border-r bg-background flex flex-col flex-shrink-0"
        style={{ willChange: 'width' }}
      >
        <WorkbenchSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          chatLoading={loading}
          split={split}
        />
      </motion.aside>

      <AnimatePresence>
        {split && (
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