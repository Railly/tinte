import { 
  ThemeAdapter, 
  PreviewableAdapter, 
  AdapterWithMetadata, 
  PreviewableAdapterWithMetadata,
  AdapterMetadata 
} from "./types";
import { TinteTheme } from "@/types/tinte";

class AdapterRegistry {
  private adapters = new Map<string, AdapterWithMetadata>();
  private previewableAdapters = new Map<string, PreviewableAdapterWithMetadata>();

  register<T>(adapter: ThemeAdapter<T> & { metadata: AdapterMetadata }): void {
    this.adapters.set(adapter.id, adapter);
  }

  registerPreviewable<T>(
    adapter: PreviewableAdapter<T> & { metadata: AdapterMetadata }
  ): void {
    this.previewableAdapters.set(adapter.id, adapter);
    this.adapters.set(adapter.id, adapter);
  }

  get(id: string): AdapterWithMetadata | undefined {
    return this.adapters.get(id);
  }

  getPreviewable(id: string): PreviewableAdapterWithMetadata | undefined {
    return this.previewableAdapters.get(id);
  }

  getAll(): AdapterWithMetadata[] {
    return Array.from(this.adapters.values());
  }

  getAllPreviewable(): PreviewableAdapterWithMetadata[] {
    return Array.from(this.previewableAdapters.values());
  }

  getByCategory(category: AdapterMetadata['category']): AdapterWithMetadata[] {
    return this.getAll().filter(adapter => adapter.metadata.category === category);
  }

  getByTag(tag: string): AdapterWithMetadata[] {
    return this.getAll().filter(adapter => 
      adapter.metadata.tags.includes(tag)
    );
  }

  convert<T>(adapterId: string, theme: TinteTheme): T | null {
    const adapter = this.get(adapterId);
    if (!adapter) return null;
    
    try {
      return adapter.convert(theme) as T;
    } catch (error) {
      console.error(`Error converting theme with adapter ${adapterId}:`, error);
      return null;
    }
  }

  export(
    adapterId: string, 
    theme: TinteTheme, 
    filename?: string
  ): { content: string; filename: string; mimeType: string } | null {
    const adapter = this.get(adapterId);
    if (!adapter?.export) return null;
    
    try {
      return adapter.export(theme, filename);
    } catch (error) {
      console.error(`Error exporting theme with adapter ${adapterId}:`, error);
      return null;
    }
  }

  validate<T>(adapterId: string, output: T): boolean {
    const adapter = this.get(adapterId);
    if (!adapter?.validate) return true;
    
    try {
      return adapter.validate(output);
    } catch (error) {
      console.error(`Error validating output with adapter ${adapterId}:`, error);
      return false;
    }
  }

  has(id: string): boolean {
    return this.adapters.has(id);
  }

  hasPreviewable(id: string): boolean {
    return this.previewableAdapters.has(id);
  }

  unregister(id: string): boolean {
    const hasPreviewable = this.previewableAdapters.delete(id);
    const hasRegular = this.adapters.delete(id);
    return hasPreviewable || hasRegular;
  }

  clear(): void {
    this.adapters.clear();
    this.previewableAdapters.clear();
  }

  convertAll(theme: TinteTheme): Record<string, any> {
    const results: Record<string, any> = {};
    
    for (const [id, adapter] of this.adapters) {
      const converted = this.convert(id, theme);
      if (converted !== null) {
        results[id] = converted;
      }
    }
    
    return results;
  }

  exportAll(theme: TinteTheme): Record<string, { content: string; filename: string; mimeType: string }> {
    const results: Record<string, { content: string; filename: string; mimeType: string }> = {};
    
    for (const [id, adapter] of this.adapters) {
      if (adapter.export) {
        const exported = this.export(id, theme);
        if (exported) {
          results[id] = exported;
        }
      }
    }
    
    return results;
  }
}

export const adapterRegistry = new AdapterRegistry();

export function createAdapter<T>(
  adapter: ThemeAdapter<T>,
  metadata: AdapterMetadata
): AdapterWithMetadata<T> {
  return { ...adapter, metadata };
}

export function createPreviewableAdapter<T>(
  adapter: PreviewableAdapter<T>,
  metadata: AdapterMetadata
): PreviewableAdapterWithMetadata<T> {
  return { ...adapter, metadata };
}