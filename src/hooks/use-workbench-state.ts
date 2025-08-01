import { useMemo } from "react";
import { useQueryState } from "nuqs";
import { useTinteTheme } from "@/stores/tinte-theme";
import { useTokenEditor } from "./use-token-editor";
import { useThemeAdapters, useThemeConversion } from "./use-theme-adapters";
import { useChatState } from "./use-chat-state";
import { applyThemeWithTransition } from "@/lib/theme-applier";
import { useTheme } from "next-themes";
import type { ThemeData as AppThemeData } from "@/lib/theme-tokens";
import type { TinteTheme } from "@/types/tinte";
import { SeedPayload } from "@/utils/seed-mapper";
import { DEFAULT_THEME } from "@/utils/tinte-presets";
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
  tokensLoading: boolean;

  // Theme selection
  handleThemeSelect: (theme: AppThemeData) => void;

  // Theme conversion
  conversion: ReturnType<typeof useThemeConversion>;

  // Export functions
  exportTheme: (adapterId: string, theme: TinteTheme) => any;
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
  const { previewableProviders, exportTheme } = useThemeAdapters();

  // Theme state - simplified
  const { activeTheme, allThemes } = useTinteTheme();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Use current theme or fallback to default
  const currentTheme = useMemo(() => 
    (activeTheme || DEFAULT_THEME) as AppThemeData, 
    [activeTheme]
  );

  const { currentTokens, handleTokenEdit, resetTokens, isLoading } = useTokenEditor(
    currentTheme,
    isDark
  );

  // Derived state
  const currentProvider = provider || "shadcn";
  const currentAdapter = useMemo(() =>
    previewableProviders.find((p) => p.metadata.name === currentProvider) ||
    previewableProviders[0],
    [previewableProviders, currentProvider]
  );

  // Ensure we have a valid TinteTheme
  const tinteTheme: TinteTheme = useMemo(() => {
    if (
      currentTheme?.rawTheme &&
      typeof currentTheme.rawTheme === "object" &&
      "light" in currentTheme.rawTheme &&
      "dark" in currentTheme.rawTheme
    ) {
      return currentTheme.rawTheme as TinteTheme;
    }
    return DEFAULT_THEME.rawTheme as TinteTheme;
  }, [currentTheme]);

  // Theme conversion
  const conversion = useThemeConversion(tinteTheme);

  // Simplified theme selection with view transitions
  const handleThemeSelect = useMemo(
    () => (selectedTheme: AppThemeData) => {
      // Apply theme directly with transitions (this saves to localStorage)
      const currentMode = isDark ? "dark" : "light";
      applyThemeWithTransition(selectedTheme, currentMode);
      
      // Reset tokens after theme change
      resetTokens();
    },
    [isDark, resetTokens]
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
    tokensLoading: isLoading,

    // Theme selection
    handleThemeSelect,

    // Theme conversion
    conversion,

    // Export functions
    exportTheme,
  };
}
