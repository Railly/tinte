import type { WorkbenchTab } from "@/stores/workbench-store";
import { AgentTab } from "./tabs/agent-tab";
import { ColorsTab } from "./tabs/colors-tab";
import { TokensTab } from "./tabs/tokens-tab";

// Simple, extensible tab configuration
export const WORKBENCH_TABS = [
  {
    id: "agent" as const,
    label: "Agent",
    component: AgentTab,
  },
  {
    id: "colors" as const,
    label: "Colors",
    component: ColorsTab,
  },
  {
    id: "tokens" as const,
    label: "Tokens",
    component: TokensTab,
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
