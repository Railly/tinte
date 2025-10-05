import { create } from "zustand";

interface AgentSessionState {
  // Track the first created theme in this session
  firstCreatedThemeId: string | null;
  firstCreatedThemeSlug: string | null;

  // Actions
  setFirstCreatedTheme: (themeId: string, slug: string) => void;
  clearSession: () => void;
}

export const useAgentSessionStore = create<AgentSessionState>((set) => ({
  firstCreatedThemeId: null,
  firstCreatedThemeSlug: null,

  setFirstCreatedTheme: (themeId: string, slug: string) =>
    set({
      firstCreatedThemeId: themeId,
      firstCreatedThemeSlug: slug,
    }),

  clearSession: () =>
    set({
      firstCreatedThemeId: null,
      firstCreatedThemeSlug: null,
    }),
}));
