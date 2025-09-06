"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CHAT_CONFIG } from "@/lib/chat-constants";
import { useWorkbenchStore, type WorkbenchTab } from "@/stores/workbench-store";
import { WorkbenchMobile } from "./workbench-mobile";
import { WorkbenchPreviewPane } from "./workbench-preview-pane";
import { WorkbenchSidebar } from "./workbench-sidebar";

interface WorkbenchMainProps {
  chatId: string;
  isStatic?: boolean;
  defaultTab?: WorkbenchTab;
}

export function WorkbenchMain({
  chatId,
  isStatic = false,
  defaultTab,
}: WorkbenchMainProps) {
  // Only what THIS component needs for layout decisions
  const split = useWorkbenchStore((state) => state.split);
  const initializeWorkbench = useWorkbenchStore(
    (state) => state.initializeWorkbench,
  );
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
        defaultTab={defaultTab}
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
          <WorkbenchSidebar defaultTab={defaultTab} isStatic />
        </aside>
        <WorkbenchPreviewPane />
      </div>
    );
  }

  // Dynamic layout (default)
  return (
    <div className="h-[calc(100dvh-var(--header-height))] w-full overflow-hidden flex">
      <motion.aside
        initial={{ width: "100%" }}
        animate={{ width: split ? CHAT_CONFIG.SIDEBAR_WIDTH : "100%" }}
        transition={{ type: "spring", ...CHAT_CONFIG.ANIMATION.SPRING }}
        className="border-r bg-background flex flex-col flex-shrink-0"
        style={{ willChange: "width" }}
      >
        <WorkbenchSidebar split={split} defaultTab={defaultTab} />
      </motion.aside>

      <AnimatePresence>{split && <WorkbenchPreviewPane />}</AnimatePresence>
    </div>
  );
}
