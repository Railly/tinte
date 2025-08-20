import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/shared/theme-selector';
import { ChatContent } from './chat-content';
import { useThemeContext } from '@/providers/theme';
import { useWorkbenchStore } from '@/stores/workbench-store';
import { useWorkbenchUrlSync } from '@/hooks/use-workbench-url-sync';
import { WORKBENCH_TABS } from './workbench.config';
import type { WorkbenchTab } from '@/stores/workbench-store';

interface WorkbenchSidebarProps {
  isStatic?: boolean;
  split?: boolean;
}

export function WorkbenchSidebar({
  isStatic = false,
  split = false,
}: WorkbenchSidebarProps) {
  // Get own data - no prop drilling
  const loading = useWorkbenchStore((state) => state.loading);
  const { activeTab, setActiveTab } = useWorkbenchUrlSync(isStatic ? 'design' : 'chat');
  const { allThemes, activeTheme, handleThemeSelect, navigateTheme } = useThemeContext();
  const activeId = activeTheme?.id || null;

  return (
    <div className="flex flex-col h-full">
      {/* Theme Navigation */}
      <div className="flex gap-2 p-3">
        <ThemeSelector
          themes={allThemes}
          activeId={activeId}
          onSelect={handleThemeSelect}
          triggerClassName="flex-1"
          label="Browse themes…"
        />
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateTheme('prev')}
            className="px-2"
            title="Previous theme"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateTheme('next')}
            className="px-2"
            title="Next theme"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateTheme('random')}
            className="px-2"
            title="Random theme"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs - Simple and extensible */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as WorkbenchTab)}
        className="flex flex-col h-full"
      >
        <TabsList className="mx-3">
          {WORKBENCH_TABS.map(({ id, label }) => (
            <TabsTrigger key={id} value={id}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {WORKBENCH_TABS.map(({ id, component: Component, requiresLoading }) => (
          <TabsContent
            key={id}
            value={id}
            className={isStatic ? "flex-1 m-0 p-0" : "flex-1"}
          >
            {requiresLoading ? (
              <ChatContent loading={loading} />
            ) : (
              <Component />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}