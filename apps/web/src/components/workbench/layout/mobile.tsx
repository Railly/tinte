"use client";

import { MobileThemeControls, MobileThemeEditor } from "@/components/shared/mobile";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useWorkbenchUrlSync } from "@/components/workbench/hooks/use-url-sync";
import { useWorkbenchStore, type WorkbenchTab } from "@/stores/workbench-store";
import { WorkbenchPreviewPane } from "./preview-pane";

interface WorkbenchMobileProps {
  themeSlug: string;
  defaultTab?: WorkbenchTab;
  initialPrompt?: string;
}

export function WorkbenchMobile({
  themeSlug: _themeSlug,
  defaultTab,
  initialPrompt,
}: WorkbenchMobileProps) {
  // Direct store access
  const _loading = useWorkbenchStore((state) => state.loading);
  const drawerOpen = useWorkbenchStore((state) => state.drawerOpen);
  const setDrawerOpen = useWorkbenchStore((state) => state.setDrawerOpen);

  // URL state
  const { activeTab, setActiveTab } = useWorkbenchUrlSync(
    defaultTab || "canonical",
  );

  return (
    <div className="h-[calc(100dvh-var(--header-height))] w-full flex flex-col">
      <MobileThemeControls onThemeEditorOpen={() => setDrawerOpen(true)} />
      <div className="flex-1 overflow-hidden">
        <WorkbenchPreviewPane />
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <Button
          variant={activeTab === "agent" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("agent")}
          className="bg-background/95 backdrop-blur-sm border shadow-sm"
        >
          Agent
        </Button>
        <Button
          variant={activeTab === "canonical" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("canonical")}
          className="bg-background/95 backdrop-blur-sm border shadow-sm"
        >
          Canonical
        </Button>
      </div>

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
