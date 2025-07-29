import { useState, useMemo } from "react";
import { useQueryState } from "nuqs";
import { useTinteTheme } from "./use-tinte-theme";
import { useTokenEditor } from "./use-token-editor";
import { useThemeAdapters, useThemeConversion } from "./use-theme-adapters";
import { useChatState } from "./use-chat-state";
import type { ThemeData as AppThemeData } from "@/lib/theme-applier";
import type { TinteTheme } from "@/types/tinte";
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

  // Theme state
  currentTheme: AppThemeData;
  tinteTheme: TinteTheme;
  allThemes: unknown[];
  isDark: boolean;

  // Token editing
  currentTokens: Record<string, string>;
  handleTokenEdit: (token: string, value: string) => void;
  resetTokens: () => void;

  // Theme selection
  handleThemeSelect: (theme: AppThemeData) => void;

  // Theme conversion
  conversion: ReturnType<typeof useThemeConversion>;

  // Export functions
  exportTheme: (adapterId: string, theme: TinteTheme) => any;
}

export function useWorkbenchState(chatId: string): UseWorkbenchStateReturn {
  // Chat state
  const { seed, split, loading } = useChatState(chatId);

  // Tab state
  const [activeTab, setActiveTab] = useState<WorkbenchTab>("chat");

  // Provider state
  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });
  const { getPreviewableAdapter, exportTheme } = useThemeAdapters();

  // Theme state
  const {
    activeThemeRef,
    handleThemeSelect: baseHandleThemeSelect,
    allThemes,
    isDark,
  } = useTinteTheme();
  const { currentTokens, handleTokenEdit, resetTokens } = useTokenEditor(
    activeThemeRef.current,
    isDark
  );

  // Derived state
  const currentProvider = provider || "shadcn";
  const currentAdapter = getPreviewableAdapter(currentProvider);
  const currentTheme = (activeThemeRef.current || allThemes[0]) as AppThemeData;
  const tinteTheme: TinteTheme = currentTheme.rawTheme as TinteTheme;

  // Theme conversion
  const conversion = useThemeConversion(tinteTheme);

  // Enhanced theme selection that resets tokens
  const handleThemeSelect = useMemo(
    () => (selectedTheme: AppThemeData) => {
      baseHandleThemeSelect(selectedTheme);
      resetTokens();
    },
    [baseHandleThemeSelect, resetTokens]
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

    // Theme state
    currentTheme,
    tinteTheme,
    allThemes,
    isDark,

    // Token editing
    currentTokens,
    handleTokenEdit,
    resetTokens,

    // Theme selection
    handleThemeSelect,

    // Theme conversion
    conversion,

    // Export functions
    exportTheme,
  };
}
