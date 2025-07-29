import { useMemo } from "react";
import { TinteTheme } from "@/types/tinte";
import { adapterRegistry } from "@/lib/adapters";

export function useThemeAdapters() {
  return useMemo(() => ({
    availableAdapters: adapterRegistry.getAll(),
    previewableAdapters: adapterRegistry.getAllPreviewable(),
    
    convertTheme: <T>(adapterId: string, theme: TinteTheme): T | null => {
      return adapterRegistry.convert<T>(adapterId, theme);
    },
    
    exportTheme: (adapterId: string, theme: TinteTheme, filename?: string) => {
      return adapterRegistry.export(adapterId, theme, filename);
    },
    
    convertAllThemes: (theme: TinteTheme) => {
      return adapterRegistry.convertAll(theme);
    },
    
    exportAllThemes: (theme: TinteTheme) => {
      return adapterRegistry.exportAll(theme);
    },
    
    getAdapter: (adapterId: string) => {
      return adapterRegistry.get(adapterId);
    },
    
    getPreviewableAdapter: (adapterId: string) => {
      return adapterRegistry.getPreviewable(adapterId);
    },
    
    getAdaptersByCategory: (category: string) => {
      return adapterRegistry.getByCategory(category as any);
    },
    
    getAdaptersByTag: (tag: string) => {
      return adapterRegistry.getByTag(tag);
    },
    
    validateOutput: <T>(adapterId: string, output: T): boolean => {
      return adapterRegistry.validate(adapterId, output);
    },
  }), []);
}

export function useThemeConversion(theme: TinteTheme) {
  const adapters = useThemeAdapters();
  
  return useMemo(() => {
    const conversions: Record<string, any> = {};
    
    for (const adapter of adapters.availableAdapters) {
      const converted = adapters.convertTheme(adapter.id, theme);
      if (converted !== null) {
        conversions[adapter.id] = converted;
      }
    }
    
    return {
      conversions,
      exportAll: () => adapters.exportAllThemes(theme),
      convertTo: <T>(adapterId: string) => adapters.convertTheme<T>(adapterId, theme),
      exportTo: (adapterId: string, filename?: string) => 
        adapters.exportTheme(adapterId, theme, filename),
    };
  }, [theme, adapters]);
}