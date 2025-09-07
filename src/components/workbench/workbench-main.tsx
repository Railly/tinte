"use client";

import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useWorkbenchStore, type WorkbenchTab } from "@/stores/workbench-store";
import { WorkbenchHeader } from "./workbench-header";
import { WorkbenchMobile } from "./workbench-mobile";
import { WorkbenchPreviewPane } from "./workbench-preview-pane";
import { WorkbenchSidebar } from "./workbench-sidebar";

interface WorkbenchMainProps {
  chatId: string;
  defaultTab?: WorkbenchTab;
}

export function WorkbenchMain({
  chatId,
  defaultTab,
}: WorkbenchMainProps) {
  // Only what THIS component needs for layout decisions
  const split = useWorkbenchStore((state) => state.split);
  const initializeWorkbench = useWorkbenchStore(
    (state) => state.initializeWorkbench,
  );
  const isMobile = useIsMobile();

  useEffect(() => {
    const cleanup = initializeWorkbench(chatId);
    return cleanup;
  }, [chatId, initializeWorkbench]);

  // Mobile layout
  if (isMobile) {
    return (
      <WorkbenchMobile
        chatId={chatId}
        defaultTab={defaultTab}
      />
    );
  }

  // Desktop layout with SidebarProvider
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen w-full flex flex-col">
        <WorkbenchHeader chatId={chatId} />
        <div className="flex flex-1">
          <WorkbenchSidebar defaultTab={defaultTab} />
          <SidebarInset className="flex flex-col">
            <div className="flex-1">
              {split && <WorkbenchPreviewPane />}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
