import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/shared/theme-selector';
import { ThemeEditorPanel } from '@/components/shared/theme-editor-panel';
import { ChatContent } from './chat-content';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import { useThemeContext } from '@/providers/theme';
import type { WorkbenchTab } from '@/stores/workbench-store';

interface WorkbenchSidebarProps {
  activeTab: WorkbenchTab;
  onTabChange: (tab: WorkbenchTab) => void;
  split?: boolean;
  chatLoading?: boolean;
  isStatic?: boolean;
  width?: string;
}

const TAB_CONFIG = [
  { id: 'chat' as const, label: 'Chat' },
  { id: 'design' as const, label: 'Design' },
];

export function WorkbenchSidebar({
  activeTab,
  onTabChange,
  split = false,
  chatLoading = false,
  isStatic = false,
  width
}: WorkbenchSidebarProps) {
  const { allThemes, activeTheme, handleThemeSelect, navigateTheme } = useThemeContext();
  const activeId = activeTheme?.id || null;
  const content = (
    <>
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 px-3 pt-3">
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
          <Tabs
            value={activeTab}
            onValueChange={(v) => onTabChange(v as WorkbenchTab)}
            className="flex flex-col h-full"
          >
            <TabsList className="mx-3">
              {TAB_CONFIG.map(({ id, label }) => (
                <TabsTrigger key={id} value={id}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="chat" className={isStatic ? "flex-1 m-0 p-0" : "flex-1"}>
              <ChatContent loading={chatLoading} />
            </TabsContent>

            <TabsContent value="design" className={isStatic ? "flex-1 m-0 p-0" : "flex-1"}>
              <ThemeEditorPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );

  if (isStatic) {
    return content;
  }

  return (
    <motion.aside
      initial={{ width: '100%' }}
      animate={{ width: split ? (width || CHAT_CONFIG.SIDEBAR_WIDTH) : '100%' }}
      transition={{ type: 'spring', ...CHAT_CONFIG.ANIMATION.SPRING }}
      className="border-r bg-background flex flex-col flex-shrink-0"
      style={{ willChange: 'width' }}
    >
      {content}
    </motion.aside>
  );
}