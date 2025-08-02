import { useMemo } from "react";
import { useQueryState } from "nuqs";
import { useThemeAdapters } from "./use-theme-adapters";
import { useChatState } from "./use-chat-state";
import { SeedPayload } from "@/utils/seed-mapper";
export type WorkbenchTab = "chat" | "design" | "mapping";

export interface UseWorkbenchStateReturn {
  // Chat state
  seed: SeedPayload | null;
  split: boolean;
  loading: boolean;

  // Tab state
  activeTab: WorkbenchTab;
  setActiveTab: (tab: WorkbenchTab) => void;

  // Provider state
  currentProvider: string;
  currentAdapter: any;
}

export function useWorkbenchState(
  chatId: string,
  defaultTab: WorkbenchTab = "chat"
): UseWorkbenchStateReturn {
  // Chat state
  const { seed, split, loading } = useChatState(chatId);

  // Tab state with nuqs
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: defaultTab,
    parse: (value): WorkbenchTab => {
      if (value === "design" || value === "mapping") return value;
      return "chat";
    },
    serialize: (value) => value,
  });

  // Provider state
  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });
  const { previewableProviders } = useThemeAdapters();

  // Derived state
  const currentProvider = provider || "shadcn";
  const currentAdapter = useMemo(() =>
    previewableProviders.find((p) => p.metadata.name === currentProvider) ||
    previewableProviders[0],
    [previewableProviders, currentProvider]
  );

  return {
    // Chat state
    seed,
    split,
    loading,

    // Tab state
    activeTab,
    setActiveTab,

    // Provider state
    currentProvider,
    currentAdapter,
  };
}
