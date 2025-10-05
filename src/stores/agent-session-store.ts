import { create } from "zustand";

interface AgentSessionState {
  // Track the root theme (never changes during session)
  rootThemeId: string | null;
  rootThemeSlug: string | null;
  iterationCount: number;

  // Actions
  setRootTheme: (themeId: string, slug: string) => void;
  incrementIteration: () => void;
  clearSession: () => void;
}

export const useAgentSessionStore = create<AgentSessionState>((set) => ({
  rootThemeId: null,
  rootThemeSlug: null,
  iterationCount: 0,

  setRootTheme: (themeId: string, slug: string) =>
    set({
      rootThemeId: themeId,
      rootThemeSlug: slug,
      iterationCount: 1,
    }),

  incrementIteration: () =>
    set((state) => ({ iterationCount: state.iterationCount + 1 })),

  clearSession: () =>
    set({
      rootThemeId: null,
      rootThemeSlug: null,
      iterationCount: 0,
    }),
}));
