import { useQueryState } from 'nuqs';
import { type WorkbenchTab } from '@/stores/workbench-store';
import { useThemeAdapters } from './use-theme-adapters';

export function useWorkbenchUrlSync(defaultTab: WorkbenchTab = 'chat') {
  const { previewableProviders } = useThemeAdapters();
  
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: defaultTab,
    parse: (value): WorkbenchTab => {
      if (value === 'design' || value === 'mapping') return value;
      return 'chat';
    },
    serialize: (value) => value,
  });

  const [currentProvider, setCurrentProvider] = useQueryState('provider', { 
    defaultValue: 'shadcn' 
  });

  const currentAdapter = previewableProviders.find(
    (p) => p.metadata.name === (currentProvider || 'shadcn')
  ) || previewableProviders[0];

  return {
    activeTab,
    currentProvider: currentProvider || 'shadcn',
    currentAdapter,
    setActiveTab,
    setCurrentProvider,
  };
}