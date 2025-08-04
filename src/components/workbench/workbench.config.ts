import { ChatContent } from './chat-content';
import { ThemeEditorPanel } from '@/components/shared/theme-editor-panel';
import type { WorkbenchTab } from '@/stores/workbench-store';

// Simple, extensible tab configuration
export const WORKBENCH_TABS = [
  { 
    id: 'chat' as const, 
    label: 'Chat',
    component: ChatContent,
    requiresLoading: true,
  },
  { 
    id: 'design' as const, 
    label: 'Design',
    component: ThemeEditorPanel,
    requiresLoading: false,
  },
] as const;

// Easy to add new tabs:
// { id: 'mapping', label: 'Mapping', component: MappingPanel, requiresLoading: false }

export type TabConfig = typeof WORKBENCH_TABS[number];

export function getTabConfig(tabId: WorkbenchTab): TabConfig | undefined {
  return WORKBENCH_TABS.find(tab => tab.id === tabId);
}

// App configuration
export const WORKBENCH_CONFIG = {
  DEFAULT_TAB: 'chat' as WorkbenchTab,
  STATIC_TAB: 'design' as WorkbenchTab,
  CHAT_ID_DISPLAY_LENGTH: 8,
} as const;