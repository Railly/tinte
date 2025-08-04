'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { ThemeEditorPanel } from '@/components/shared/theme-editor-panel';
import { MobileThemeControls } from '@/components/shared/mobile-theme-controls';
import { MobileThemeEditor } from '@/components/shared/mobile-theme-editor';
import { WorkbenchPreviewPane } from './workbench-preview-pane';
import { ChatContent } from './chat-content';
import type { WorkbenchTab } from '@/hooks/use-workbench-state';

interface ResponsiveWorkbenchProps {
  chatId: string;
  isStatic: boolean;
  activeTab: WorkbenchTab;
  onTabChange: (tab: WorkbenchTab) => void;
  tinteTheme: any;
  onExportAll: () => void;
  onExportTinte: () => void;
  chatLoading?: boolean;
  chatSeed?: any;
  split?: boolean;
}

export function ResponsiveWorkbench({
  chatId: _chatId,
  isStatic,
  activeTab,
  onTabChange,
  tinteTheme,
  onExportAll,
  onExportTinte,
  chatLoading = false,
  chatSeed,
  split = false
}: ResponsiveWorkbenchProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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
            <ChatContent loading={chatLoading} seed={chatSeed} />
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