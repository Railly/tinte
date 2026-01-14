"use client";

import { parseAsStringLiteral, useQueryState, useQueryStates } from "nuqs";
import { useThemeAdapters } from "@/lib/theme/utils";
import type { WorkbenchTab } from "@/stores/workbench-store";

const tabParser = parseAsStringLiteral([
  "agent",
  "canonical",
  "overrides",
] as const);

export function useWorkbenchUrlSync(defaultTab: WorkbenchTab = "agent") {
  const { previewableProviders } = useThemeAdapters();

  const [{ tab: activeTab }, setWorkbenchParams] = useQueryStates({
    tab: tabParser.withDefault(defaultTab),
  });

  const [currentProvider, setCurrentProvider] = useQueryState("provider", {
    defaultValue: "shadcn",
  });

  const setActiveTab = (tab: WorkbenchTab) => {
    setWorkbenchParams({ tab });
  };

  const currentAdapter =
    previewableProviders.find(
      (p: any) => p.metadata.name === (currentProvider || "shadcn"),
    ) || previewableProviders[0];

  return {
    activeTab,
    currentProvider: currentProvider || "shadcn",
    currentAdapter,
    setActiveTab,
    setCurrentProvider,
  };
}
