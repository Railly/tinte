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
import { useWorkbenchUrlSync } from '@/hooks/use-workbench-url-sync';

interface WorkbenchMobileProps {
  chatId: string;
  isStatic: boolean;
}

export function WorkbenchMobile({
  chatId: _chatId,
  isStatic,
}: WorkbenchMobileProps) {
  // Direct store access
  const split = useWorkbenchStore((state) => state.split);
  const loading = useWorkbenchStore((state) => state.loading);
  const drawerOpen = useWorkbenchStore((state) => state.drawerOpen);
  const setDrawerOpen = useWorkbenchStore((state) => state.setDrawerOpen);
  
  // URL state
  const { activeTab, setActiveTab } = useWorkbenchUrlSync(isStatic ? 'design' : 'chat');
  
  // Theme context (only what this component needs)
  // Export functions are handled by WorkbenchPreviewPane itself

  const showPreview = isStatic || split;
  const showTabs = !isStatic && !split;

  return (
    <div className="h-[calc(100dvh-var(--header-height))] w-full flex flex-col">
      {showPreview && (
        <>
          <MobileThemeControls onThemeEditorOpen={() => setDrawerOpen(true)} />
          <div className="flex-1 overflow-hidden">
            <WorkbenchPreviewPane />
          </div>
        </>
      )}

      {showTabs && (
        <div className="h-full">
          {activeTab === 'chat' ? (
            <ChatContent loading={loading} />
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
            onClick={() => setActiveTab('chat')}
            className="bg-background/95 backdrop-blur-sm border shadow-sm"
          >
            Chat
          </Button>
          <Button
            variant={activeTab === 'design' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('design')}
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