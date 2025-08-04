import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ExportState {
  isExporting: boolean;
  exportFormat: 'all' | 'tinte' | 'vscode' | 'shadcn' | null;
  exportProgress: number;
}

export interface ExportActions {
  setExporting: (isExporting: boolean) => void;
  setExportFormat: (format: ExportState['exportFormat']) => void;
  setExportProgress: (progress: number) => void;
  startExport: (format: ExportState['exportFormat']) => void;
  completeExport: () => void;
  reset: () => void;
}

export type ExportStore = ExportState & ExportActions;

const initialState: ExportState = {
  isExporting: false,
  exportFormat: null,
  exportProgress: 0,
};

export const useExportStore = create<ExportStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setExporting: (isExporting: boolean) => {
        set({ isExporting }, false, 'setExporting');
      },

      setExportFormat: (exportFormat: ExportState['exportFormat']) => {
        set({ exportFormat }, false, 'setExportFormat');
      },

      setExportProgress: (exportProgress: number) => {
        set({ exportProgress }, false, 'setExportProgress');
      },

      startExport: (format: ExportState['exportFormat']) => {
        set({ 
          isExporting: true, 
          exportFormat: format, 
          exportProgress: 0 
        }, false, 'startExport');
      },

      completeExport: () => {
        set({ 
          isExporting: false, 
          exportFormat: null, 
          exportProgress: 100 
        }, false, 'completeExport');
        
        setTimeout(() => {
          set({ exportProgress: 0 }, false, 'completeExport/resetProgress');
        }, 1000);
      },

      reset: () => {
        set(initialState, false, 'reset');
      },
    }),
    { name: 'export-store' }
  )
);

export const useExportState = (selector?: (state: ExportStore) => any) => {
  return useExportStore(selector || ((state) => state));
};

export const useExportActions = () => {
  return useExportStore((state) => ({
    setExporting: state.setExporting,
    setExportFormat: state.setExportFormat,
    setExportProgress: state.setExportProgress,
    startExport: state.startExport,
    completeExport: state.completeExport,
    reset: state.reset,
  }));
};