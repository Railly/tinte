import type { WorkbenchTab } from "@/stores/workbench-store";
import { ChatContent } from "./chat-content";
import { ColorsEditor } from "./colors-editor";
import { TokensEditor } from "./tokens-editor";

// Simple, extensible tab configuration
export const WORKBENCH_TABS = [
  {
    id: "agent" as const,
    label: "Agent",
    component: ChatContent,
    requiresLoading: true,
  },
  {
    id: "colors" as const,
    label: "Colors",
    component: ColorsEditor,
    requiresLoading: false,
  },
  {
    id: "tokens" as const,
    label: "Tokens",
    component: TokensEditor,
    requiresLoading: false,
  },
] as const;

// Easy to add new tabs:
// { id: 'mapping', label: 'Mapping', component: MappingPanel, requiresLoading: false }

export type TabConfig = (typeof WORKBENCH_TABS)[number];

export function getTabConfig(tabId: WorkbenchTab): TabConfig | undefined {
  return WORKBENCH_TABS.find((tab) => tab.id === tabId);
}

// App configuration
export const WORKBENCH_CONFIG = {
  DEFAULT_TAB: "agent" as WorkbenchTab,
  STATIC_TAB: "colors" as WorkbenchTab,
  CHAT_ID_DISPLAY_LENGTH: 8,
} as const;
