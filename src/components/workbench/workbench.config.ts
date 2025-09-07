import type { WorkbenchTab } from "@/stores/workbench-store";
import { AgentTab } from "./tabs/agent-tab";
import { CanonicalTab } from "./tabs/canonical-tab";
import { OverridesTab } from "./tabs/overrides-tab";

// Simple, extensible tab configuration
export const WORKBENCH_TABS = [
  {
    id: "canonical" as const,
    label: "Canonical",
    component: CanonicalTab,
  },
  {
    id: "overrides" as const,
    label: "Overrides",
    component: OverridesTab,
  },
  {
    id: "agent" as const,
    label: "Agent",
    component: AgentTab,
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
  DEFAULT_TAB: "canonical" as WorkbenchTab,
  STATIC_TAB: "canonical" as WorkbenchTab,
  CHAT_ID_DISPLAY_LENGTH: 8,
} as const;
