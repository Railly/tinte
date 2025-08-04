import { useWorkbenchStore } from '@/stores/workbench-store';
import { useExportStore } from '@/stores/export-store';
import { useWorkbenchUrlSync } from './use-workbench-url-sync';
import { useThemeContext } from '@/providers/theme';
import type { WorkbenchTab } from '@/stores/workbench-store';

export function useWorkbench(defaultTab: WorkbenchTab = 'chat') {
  const {
    chatId,
    isStatic,
    split,
    loading,
    seed,
    drawerOpen,
    setChatId,
    setIsStatic,
    setSplit,
    setLoading,
    setSeed,
    setDrawerOpen,
    initializeWorkbench,
    toggleDrawer,
  } = useWorkbenchStore();
  
  const exportState = useExportStore();
  const urlSync = useWorkbenchUrlSync(defaultTab);
  const { tinteTheme, handleExportAll, handleExportTinte } = useThemeContext();

  return {
    // Workbench state (excluding tab/provider which comes from URL)
    chatId,
    isStatic,
    split,
    loading,
    seed,
    drawerOpen,
    setChatId,
    setIsStatic,
    setSplit,
    setLoading,
    setSeed,
    setDrawerOpen,
    initializeWorkbench,
    toggleDrawer,
    // Export state  
    ...exportState,
    
    // URL synchronization (activeTab, currentProvider, setters)
    activeTab: urlSync.activeTab,
    currentProvider: urlSync.currentProvider,
    currentAdapter: urlSync.currentAdapter,
    setActiveTab: urlSync.setActiveTab,
    setCurrentProvider: urlSync.setCurrentProvider,
    
    // Theme integration
    tinteTheme,
    handleExportAll,
    handleExportTinte,
    
    // Computed values
    showPreview: isStatic || split,
    showTabs: !isStatic && !split,
  };
}