import { create } from "zustand";

interface AgentSessionState {
  // Just track if we've generated themes in this session
  hasGeneratedThemes: boolean;

  // Actions
  markThemeGenerated: () => void;
  clearSession: () => void;
}

export const useAgentSessionStore = create<AgentSessionState>((set) => ({
  hasGeneratedThemes: false,

  markThemeGenerated: () => set({ hasGeneratedThemes: true }),

  clearSession: () => set({ hasGeneratedThemes: false }),
}));
