import { motion } from 'motion/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ThemeEditorPanel } from '@/components/shared/theme-editor-panel';
import { ChatContent } from './chat-content';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import type { WorkbenchTab } from '@/hooks/use-workbench-state';

interface WorkbenchSidebarProps {
  split: boolean;
  activeTab: WorkbenchTab;
  onTabChange: (tab: WorkbenchTab) => void;
  chatLoading: boolean;
  chatSeed: any;
}

const TAB_CONFIG = [
  { id: 'chat' as const, label: 'Chat' },
  { id: 'design' as const, label: 'Design' },
];

export function WorkbenchSidebar({
  split,
  activeTab,
  onTabChange,
  chatLoading,
  chatSeed
}: WorkbenchSidebarProps) {

  return (
    <motion.aside
      initial={{ width: '100%' }}
      animate={{ width: split ? CHAT_CONFIG.SIDEBAR_WIDTH : '100%' }}
      transition={{ type: 'spring', ...CHAT_CONFIG.ANIMATION.SPRING }}
      className="border-r bg-background flex flex-col flex-shrink-0"
      style={{ willChange: 'width' }}
    >
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as WorkbenchTab)}
        className="flex flex-col h-full"
      >
        <TabsList className="m-3">
          {TAB_CONFIG.map(({ id, label }) => (
            <TabsTrigger key={id} value={id}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="chat" className="flex-1">
          <ChatContent loading={chatLoading} seed={chatSeed} />
        </TabsContent>

        <TabsContent value="design" className="flex-1">
          <ThemeEditorPanel />
        </TabsContent>
      </Tabs>
    </motion.aside>
  );
}