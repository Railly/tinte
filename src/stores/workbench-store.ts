import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { CHAT_CONFIG } from "@/lib/chat-constants";
import { popSeed } from "@/utils/anon-seed";
import type { SeedPayload } from "@/utils/seed-mapper";

export type WorkbenchTab = "agent" | "colors" | "tokens";

export interface WorkbenchState {
  chatId: string;
  split: boolean;
  loading: boolean;
  seed: SeedPayload | null;
  drawerOpen: boolean;
}

export interface WorkbenchActions {
  setChatId: (chatId: string) => void;
  setSplit: (split: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSeed: (seed: SeedPayload | null) => void;
  setDrawerOpen: (open: boolean) => void;

  initializeWorkbench: (chatId: string) => void;
  toggleDrawer: () => void;
  reset: () => void;
}

export type WorkbenchStore = WorkbenchState & WorkbenchActions;

const initialState: WorkbenchState = {
  chatId: "",
  split: false,
  loading: true,
  seed: null,
  drawerOpen: false,
};

export const useWorkbenchStore = create<WorkbenchStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      ...initialState,

      setChatId: (chatId: string) => {
        set({ chatId }, false, "setChatId");
      },


      setSplit: (split: boolean) => {
        set({ split }, false, "setSplit");
      },

      setLoading: (loading: boolean) => {
        set({ loading }, false, "setLoading");
      },

      setSeed: (seed: SeedPayload | null) => {
        set({ seed }, false, "setSeed");
      },

      setDrawerOpen: (drawerOpen: boolean) => {
        set({ drawerOpen }, false, "setDrawerOpen");
      },

      initializeWorkbench: (chatId: string) => {
        set(
          {
            chatId,
            loading: true,
            seed: null,
            split: false,
          },
          false,
          "initializeWorkbench",
        );

        if (chatId) {
          const seed = popSeed(chatId);
          set({ seed, loading: false }, false, "initializeWorkbench/setSeed");
        }

        const timer = setTimeout(() => {
          set({ split: true }, false, "initializeWorkbench/setSplit");
        }, CHAT_CONFIG.SPLIT_DELAY);

        return () => clearTimeout(timer);
      },

      toggleDrawer: () => {
        set(
          (state) => ({ drawerOpen: !state.drawerOpen }),
          false,
          "toggleDrawer",
        );
      },

      reset: () => {
        set(initialState, false, "reset");
      },
    })),
    { name: "workbench-store" },
  ),
);

export const useWorkbenchState = (
  selector?: (state: WorkbenchStore) => any,
) => {
  return useWorkbenchStore(selector || ((state) => state));
};
