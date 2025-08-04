import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { useQueryState } from 'nuqs';
import { popSeed } from '@/utils/anon-seed';
import { CHAT_CONFIG } from '@/lib/chat-constants';
import type { SeedPayload } from '@/utils/seed-mapper';

export type WorkbenchTab = 'chat' | 'design' | 'mapping';

export interface WorkbenchState {
  chatId: string;
  isStatic: boolean;
  split: boolean;
  loading: boolean;
  seed: SeedPayload | null;
  drawerOpen: boolean;
}

export interface WorkbenchActions {
  setChatId: (chatId: string) => void;
  setIsStatic: (isStatic: boolean) => void;
  setSplit: (split: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSeed: (seed: SeedPayload | null) => void;
  setDrawerOpen: (open: boolean) => void;
  
  initializeWorkbench: (chatId: string, isStatic?: boolean) => void;
  toggleDrawer: () => void;
  reset: () => void;
}

export type WorkbenchStore = WorkbenchState & WorkbenchActions;

const initialState: WorkbenchState = {
  chatId: '',
  isStatic: false,
  split: false,
  loading: true,
  seed: null,
  drawerOpen: false,
};

export const useWorkbenchStore = create<WorkbenchStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      setChatId: (chatId: string) => {
        set({ chatId }, false, 'setChatId');
      },

      setIsStatic: (isStatic: boolean) => {
        set({ isStatic }, false, 'setIsStatic');
      },

      setSplit: (split: boolean) => {
        set({ split }, false, 'setSplit');
      },

      setLoading: (loading: boolean) => {
        set({ loading }, false, 'setLoading');
      },

      setSeed: (seed: SeedPayload | null) => {
        set({ seed }, false, 'setSeed');
      },

      setDrawerOpen: (drawerOpen: boolean) => {
        set({ drawerOpen }, false, 'setDrawerOpen');
      },

      initializeWorkbench: (chatId: string, isStatic = false) => {
        const state = get();
        
        set({
          chatId,
          isStatic,
          loading: true,
          seed: null,
          split: false,
        }, false, 'initializeWorkbench');

        if (chatId) {
          const seed = popSeed(chatId);
          set({ seed, loading: false }, false, 'initializeWorkbench/setSeed');
        }

        if (!isStatic) {
          const timer = setTimeout(() => {
            set({ split: true }, false, 'initializeWorkbench/setSplit');
          }, CHAT_CONFIG.SPLIT_DELAY);

          return () => clearTimeout(timer);
        }
      },

      toggleDrawer: () => {
        set((state) => ({ drawerOpen: !state.drawerOpen }), false, 'toggleDrawer');
      },

      reset: () => {
        set(initialState, false, 'reset');
      },
    })),
    { name: 'workbench-store' }
  )
);

export const useWorkbenchState = (selector?: (state: WorkbenchStore) => any) => {
  return useWorkbenchStore(selector || ((state) => state));
};

export const useWorkbenchActions = () => {
  return useWorkbenchStore((state) => ({
    setChatId: state.setChatId,
    setIsStatic: state.setIsStatic,
    setSplit: state.setSplit,
    setLoading: state.setLoading,
    setSeed: state.setSeed,
    setDrawerOpen: state.setDrawerOpen,
    initializeWorkbench: state.initializeWorkbench,
    toggleDrawer: state.toggleDrawer,
    reset: state.reset,
  }));
};