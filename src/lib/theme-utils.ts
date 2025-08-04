'use client';

import { 
  convertTheme, 
  exportTheme, 
  convertAllThemes, 
  exportAllThemes, 
  getAvailableProviders, 
  getPreviewableProviders, 
  getProvider, 
  getPreviewableProvider 
} from './providers';
import { TinteTheme } from '@/types/tinte';
import { ThemeData } from './theme-tokens';
import { ShadcnTheme } from '@/types/shadcn';
import { downloadFile, downloadJSON, downloadMultipleFiles } from './file-download';
import { DEFAULT_THEME } from '@/utils/tinte-presets';

export type ThemeMode = 'light' | 'dark';

export function computeThemeTokens(theme: ThemeData): { light: Record<string, string>; dark: Record<string, string> } {
  if ((theme as any).computedTokens) {
    return (theme as any).computedTokens;
  }

  let computedTokens: { light: any; dark: any };

  if (theme.author === 'tweakcn' && theme.rawTheme) {
    computedTokens = {
      light: theme.rawTheme.light,
      dark: theme.rawTheme.dark,
    };
  } else if (theme.rawTheme) {
    try {
      const shadcnTheme = convertTheme('shadcn', theme.rawTheme) as ShadcnTheme;
      computedTokens = {
        light: shadcnTheme.light,
        dark: shadcnTheme.dark,
      };
    } catch {
      computedTokens = DEFAULT_THEME.computedTokens;
    }
  } else {
    computedTokens = DEFAULT_THEME.computedTokens;
  }

  return computedTokens;
}

export function extractThemeColors(theme: ThemeData, mode: ThemeMode = 'light'): Record<string, string> {
  const computed = computeThemeTokens(theme);
  const tokens = computed[mode];

  return {
    primary: tokens.primary || '#000000',
    secondary: tokens.secondary || '#666666',
    accent: tokens.accent || '#0066cc',
    background: tokens.background || '#ffffff',
    foreground: tokens.foreground || '#000000',
  };
}

export function useThemeAdapters() {
  const availableProviders = getAvailableProviders();
  const previewableProviders = getPreviewableProviders();
  
  return {
    availableProviders,
    previewableProviders,
    
    convertTheme: <T>(providerId: string, theme: TinteTheme): T | null => {
      return convertTheme(providerId, theme) as T | null;
    },
    
    exportTheme: (providerId: string, theme: TinteTheme, filename?: string) => {
      return exportTheme(providerId, theme, filename);
    },
    
    convertAllThemes: (theme: TinteTheme) => {
      return convertAllThemes(theme);
    },
    
    exportAllThemes: (theme: TinteTheme) => {
      return exportAllThemes(theme);
    },
    
    getProvider: (providerId: string) => {
      return getProvider(providerId);
    },
    
    getPreviewableProvider: (providerId: string) => {
      return getPreviewableProvider(providerId);
    },
  };
}

export function useThemeExport(theme: TinteTheme) {
  const adapters = useThemeAdapters();
  
  const handleExportAll = () => {
    const allExports = adapters.exportAllThemes(theme);
    const files = Object.entries(allExports).map(([_, exportResult]) => ({
      content: exportResult.content,
      filename: exportResult.filename,
      mimeType: exportResult.mimeType,
    }));
    downloadMultipleFiles(files);
  };

  const handleExportTinte = () => {
    downloadJSON(theme, 'tinte-theme');
  };

  const handleExport = (adapterId: string) => {
    const exportResult = adapters.exportTheme(adapterId, theme);
    if (exportResult) {
      downloadFile({
        content: exportResult.content,
        filename: exportResult.filename,
        mimeType: exportResult.mimeType,
      });
    }
  };

  return {
    handleExport,
    handleExportAll,
    handleExportTinte,
    ...adapters,
  };
}