import { useMemo } from "react";
import { useQueryState } from "nuqs";
import { useTinteTheme } from "@/stores/tinte-theme";
import { useTokenEditor } from "./use-token-editor";
import { useThemeAdapters, useThemeConversion } from "./use-theme-adapters";
import { useChatState } from "./use-chat-state";
import type { ThemeData as AppThemeData } from "@/lib/theme-applier";
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

  // Theme state
  const {
    activeTheme,
    handleThemeSelect: baseHandleThemeSelect,
    allThemes,
    isDark,
  } = useTinteTheme();

  const { currentTokens, handleTokenEdit, resetTokens } = useTokenEditor(
    activeTheme || DEFAULT_THEME,
    isDark
  );

  // Derived state
  const currentProvider = provider || "shadcn";
  // TODO review this later
  const currentAdapter =
    previewableProviders.find((p) => p.metadata.name === currentProvider) ||
    previewableProviders[0];
  const currentTheme = (activeTheme || DEFAULT_THEME) as AppThemeData;
  // Ensure we have a valid TinteTheme
  let tinteTheme: TinteTheme;

  if (
    currentTheme?.rawTheme &&
    typeof currentTheme.rawTheme === "object" &&
    "light" in currentTheme.rawTheme &&
    "dark" in currentTheme.rawTheme
  ) {
    tinteTheme = currentTheme.rawTheme as TinteTheme;
  } else {
    // Fallback to DEFAULT_THEME's rawTheme
    tinteTheme = DEFAULT_THEME.rawTheme as TinteTheme;
  }

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
