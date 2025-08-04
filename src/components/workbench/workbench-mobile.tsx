'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { ThemeEditorPanel } from '@/components/shared/theme-editor-panel';
import { MobileThemeControls } from '@/components/shared/mobile-theme-controls';
import { MobileThemeEditor } from '@/components/shared/mobile-theme-editor';
import { WorkbenchPreviewPane } from './workbench-preview-pane';
import { ChatContent } from './chat-content';
import { useWorkbenchStore } from '@/stores/workbench-store';
import type { WorkbenchTab } from '@/stores/workbench-store';

interface WorkbenchMobileProps {
  chatId: string;
  isStatic: boolean;
  activeTab: WorkbenchTab;
  onTabChange: (tab: WorkbenchTab) => void;
  tinteTheme: any;
  onExportAll: () => void;
  onExportTinte: () => void;
  chatLoading?: boolean;
  split?: boolean;
}

export function WorkbenchMobile({
  chatId: _chatId,
  isStatic,
  activeTab,
  onTabChange,
  tinteTheme,
  onExportAll,
  onExportTinte,
  chatLoading = false,
  split = false
}: WorkbenchMobileProps) {
  const { drawerOpen, toggleDrawer, setDrawerOpen } = useWorkbenchStore((state) => ({
    drawerOpen: state.drawerOpen,
    toggleDrawer: state.toggleDrawer,
    setDrawerOpen: state.setDrawerOpen
  }));

  const showPreview = isStatic || split;
  const showTabs = !isStatic && !split;

  return (
    <div className="h-[calc(100dvh-var(--header-height))] w-full flex flex-col">
      {showPreview && (
        <>
          <MobileThemeControls onThemeEditorOpen={() => setDrawerOpen(true)} />
          <div className="flex-1 overflow-hidden">
            <WorkbenchPreviewPane
              theme={tinteTheme}
              onExportAll={onExportAll}
              onExportTinte={onExportTinte}
            />
          </div>
        </>
      )}

      {showTabs && (
        <div className="h-full">
          {activeTab === 'chat' ? (
            <ChatContent loading={chatLoading} />
          ) : (
            <div className="h-full p-4">
              <ThemeEditorPanel />
            </div>
          )}
        </div>
      )}

      {showTabs && (
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <Button
            variant={activeTab === 'chat' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTabChange('chat')}
            className="bg-background/95 backdrop-blur-sm border shadow-sm"
          >
            Chat
          </Button>
          <Button
            variant={activeTab === 'design' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTabChange('design')}
            className="bg-background/95 backdrop-blur-sm border shadow-sm"
          >
            Design
          </Button>
        </div>
      )}

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Theme Editor</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-hidden">
            <MobileThemeEditor />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}