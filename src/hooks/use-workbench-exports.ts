import { useCallback } from 'react';
import { downloadFile, downloadJSON, downloadMultipleFiles } from '@/lib/file-download';
import type { TinteTheme } from '@/types/tinte';
import type { UseWorkbenchStateReturn } from './use-workbench-state';

export interface UseWorkbenchExportsReturn {
  handleExport: (adapterId: string) => void;
  handleExportAll: () => void;
  handleExportTinte: () => void;
}

export function useWorkbenchExports(
  tinteTheme: TinteTheme,
  conversion: UseWorkbenchStateReturn['conversion'],
  exportTheme: UseWorkbenchStateReturn['exportTheme']
): UseWorkbenchExportsReturn {
  
  const handleExport = useCallback((adapterId: string) => {
    const exportResult = exportTheme(adapterId, tinteTheme);
    if (exportResult) {
      downloadFile({
        content: exportResult.content,
        filename: exportResult.filename,
        mimeType: exportResult.mimeType
      });
    }
  }, [exportTheme, tinteTheme]);

  const handleExportAll = useCallback(() => {
    const allExports = conversion.exportAll();
    const files = Object.entries(allExports).map(([_, exportResult]) => ({
      content: exportResult.content,
      filename: exportResult.filename,
      mimeType: exportResult.mimeType
    }));
    downloadMultipleFiles(files);
  }, [conversion]);

  const handleExportTinte = useCallback(() => {
    downloadJSON(tinteTheme, 'tinte-theme');
  }, [tinteTheme]);

  return {
    handleExport,
    handleExportAll,
    handleExportTinte,
  };
}