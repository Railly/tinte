"use client";

import { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWorkbenchStore, type WorkbenchTab } from "@/stores/workbench-store";
import { useThemeContext } from "@/providers/theme";
import { useThemeSlugRedirect } from "@/hooks/use-theme-slug-redirect";
import type { UserThemeData } from "@/types/user-theme";

import { WorkbenchHeader } from "./workbench-header";
import { WorkbenchMobile } from "./workbench-mobile";
import { WorkbenchPreviewPane } from "./workbench-preview-pane";
import { WorkbenchSidebar } from "./workbench-sidebar";

interface WorkbenchMainProps {
  themeSlug: string;
  defaultTab?: WorkbenchTab;
  initialTheme?: UserThemeData | null;
  userThemes?: UserThemeData[];
  tweakCNThemes?: UserThemeData[];
  tinteThemes?: UserThemeData[];
  raysoThemes?: UserThemeData[];
  initialPrompt?: string;
}

export function WorkbenchMain({ themeSlug, defaultTab, initialTheme, userThemes = [], tweakCNThemes = [], tinteThemes = [], raysoThemes = [], initialPrompt }: WorkbenchMainProps) {
  const initializeWorkbench = useWorkbenchStore(
    (state) => state.initializeWorkbench,
  );
  const { selectTheme } = useThemeContext();
  const isMobile = useIsMobile();

  // Check if themeSlug looks like a generated ID (36 chars with dashes) to enable auto-redirect
  const isGeneratedId = themeSlug.match(/^[0-9a-zA-Z_-]{21}$/) || themeSlug.match(/^[0-9a-f-]{36}$/i);

  // Enable slug redirect for generated IDs (when themes are created with AI)
  // Note: We'll pass messages from the chat logic when available
  useThemeSlugRedirect({
    chatId: themeSlug,
    enabled: Boolean(isGeneratedId && initialPrompt)
  });

  useEffect(() => {
    initializeWorkbench(themeSlug);

    const allThemes = [...userThemes, ...tinteThemes, ...tweakCNThemes, ...raysoThemes];
    const builtInThemes = [...tinteThemes, ...tweakCNThemes, ...raysoThemes];

    // Priority 1: Use server-provided theme
    if (initialTheme) {
      selectTheme(initialTheme);
      return;
    }

    // Priority 2: Use first built-in theme for "new" slug
    if (themeSlug === 'new') {
      if (builtInThemes[0]) selectTheme(builtInThemes[0]);
      return;
    }

    // Priority 3: Find theme by slug
    const matchedTheme = allThemes.find(t => t.slug === themeSlug);
    if (matchedTheme) {
      selectTheme(matchedTheme);
      return;
    }

    // Priority 4: Fallback to first built-in theme
    if (builtInThemes[0]) {
      selectTheme(builtInThemes[0]);
    }
  }, [themeSlug, initialTheme, initializeWorkbench, selectTheme, userThemes, tweakCNThemes, tinteThemes, raysoThemes]);

  // Mobile layout
  if (isMobile) {
    return <WorkbenchMobile themeSlug={themeSlug} defaultTab={defaultTab} initialPrompt={initialPrompt} />;
  }

  // Desktop layout with SidebarProvider
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen w-full flex flex-col">
        <WorkbenchHeader themeSlug={themeSlug} userThemes={userThemes} tweakCNThemes={tweakCNThemes} tinteThemes={tinteThemes} raysoThemes={raysoThemes} />
        <div className="flex flex-1">
          <WorkbenchSidebar defaultTab={defaultTab} initialPrompt={initialPrompt} />
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
