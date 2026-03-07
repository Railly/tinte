import type { WorkbenchTab } from "@/stores/workbench-store";
import { AgentTab } from "../agent-tab";
import { CanonicalTab } from "../canonical-tab";
import { OverridesTab } from "../overrides-tab/overrides-tab";

export const WORKBENCH_TABS = [
  {
    id: "agent" as const,
    label: "Agent",
    component: AgentTab,
  },
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
] as const;

export type TabConfig = (typeof WORKBENCH_TABS)[number];

export function getTabConfig(tabId: WorkbenchTab): TabConfig | undefined {
  return WORKBENCH_TABS.find((tab) => tab.id === tabId);
}

export const WORKBENCH_CONFIG = {
  DEFAULT_TAB: "agent" as WorkbenchTab,
  STATIC_TAB: "canonical" as WorkbenchTab,
  CHAT_ID_DISPLAY_LENGTH: 8,
} as const;
