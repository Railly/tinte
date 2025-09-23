"use client";

import { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWorkbenchStore, type WorkbenchTab } from "@/stores/workbench-store";
import { useThemeContext } from "@/providers/theme";
import type { UserThemeData } from "@/types/user-theme";

import { WorkbenchHeader } from "./workbench-header";
import { WorkbenchMobile } from "./workbench-mobile";
import { WorkbenchPreviewPane } from "./workbench-preview-pane";
import { WorkbenchSidebar } from "./workbench-sidebar";

interface WorkbenchMainProps {
  chatId: string;
  defaultTab?: WorkbenchTab;
  initialTheme?: UserThemeData | null;
  userThemes?: UserThemeData[];
  tweakCNThemes?: UserThemeData[];
  tinteThemes?: UserThemeData[];
  raysoThemes?: UserThemeData[];
}

export function WorkbenchMain({ chatId, defaultTab, initialTheme, userThemes = [], tweakCNThemes = [], tinteThemes = [], raysoThemes = [] }: WorkbenchMainProps) {
  const initializeWorkbench = useWorkbenchStore(
    (state) => state.initializeWorkbench,
  );
  const { selectTheme } = useThemeContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    initializeWorkbench(chatId);

    // If we have an initialTheme from server, use it immediately
    if (initialTheme) {
      console.log('🎨 [WorkbenchMain] Using server-side initial theme:', initialTheme);
      selectTheme(initialTheme);
      return;
    }

    // Fallback: Check if chatId corresponds to a theme slug in pre-loaded themes
    const allThemes = [...userThemes, ...tweakCNThemes, ...tinteThemes, ...raysoThemes];
    const themeBySlug = allThemes.find(theme => theme.slug === chatId);

    if (themeBySlug) {
      console.log('🎨 [WorkbenchMain] Found theme by slug in pre-loaded themes:', themeBySlug);
      selectTheme(themeBySlug);
    }
  }, [chatId, initialTheme, initializeWorkbench, selectTheme, userThemes, tweakCNThemes, tinteThemes, raysoThemes]);

  // Mobile layout
  if (isMobile) {
    return <WorkbenchMobile chatId={chatId} defaultTab={defaultTab} />;
  }

  // Desktop layout with SidebarProvider
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen w-full flex flex-col">
        <WorkbenchHeader chatId={chatId} userThemes={userThemes} tweakCNThemes={tweakCNThemes} tinteThemes={tinteThemes} raysoThemes={raysoThemes} />
        <div className="flex flex-1">
          <WorkbenchSidebar defaultTab={defaultTab} />
          <SidebarInset className="flex flex-col">
            <div className="flex-1">
              <WorkbenchPreviewPane />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
