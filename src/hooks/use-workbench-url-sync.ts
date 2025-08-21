import { useQueryState, useQueryStates } from 'nuqs';
import { type WorkbenchTab } from '@/stores/workbench-store';
import { useThemeAdapters } from '@/lib/theme-utils';
import { workbenchParsers } from '@/app/workbench/client-search-params';

export function useWorkbenchUrlSync(defaultTab: WorkbenchTab = 'agent') {
  const { previewableProviders } = useThemeAdapters();
  
  // Use client parsers for consistency with server-side
  const [{ tab: activeTab }, setWorkbenchParams] = useQueryStates({
    tab: workbenchParsers.tab.withDefault(defaultTab)
  });

  const [currentProvider, setCurrentProvider] = useQueryState('provider', { 
    defaultValue: 'shadcn' 
  });

  const setActiveTab = (tab: WorkbenchTab) => {
    setWorkbenchParams({ tab });
  };

  const currentAdapter = previewableProviders.find(
    (p: any) => p.metadata.name === (currentProvider || 'shadcn')
  ) || previewableProviders[0];

  return {
    activeTab,
    currentProvider: currentProvider || 'shadcn',
    currentAdapter,
    setActiveTab,
    setCurrentProvider,
  };
}