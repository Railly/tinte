import { adapterRegistry, createPreviewableAdapter } from "./registry";
import { shadcnAdapter, shadcnAdapterMetadata } from "./shadcn";
import { vscodeAdapter, vscodeAdapterMetadata } from "./vscode";

adapterRegistry.registerPreviewable(
  createPreviewableAdapter(shadcnAdapter, shadcnAdapterMetadata)
);

adapterRegistry.registerPreviewable(
  createPreviewableAdapter(vscodeAdapter, vscodeAdapterMetadata)
);

export { adapterRegistry } from "./registry";
export * from "./types";
export * from "./registry";

export function getAvailableAdapters() {
  return adapterRegistry.getAll();
}

export function getPreviewableAdapters() {
  return adapterRegistry.getAllPreviewable();
}

export function convertTheme<T>(adapterId: string, theme: import("@/types/tinte").TinteTheme): T | null {
  return adapterRegistry.convert<T>(adapterId, theme);
}

export function exportTheme(
  adapterId: string, 
  theme: import("@/types/tinte").TinteTheme, 
  filename?: string
) {
  return adapterRegistry.export(adapterId, theme, filename);
}

export function convertAllThemes(theme: import("@/types/tinte").TinteTheme) {
  return adapterRegistry.convertAll(theme);
}

export function exportAllThemes(theme: import("@/types/tinte").TinteTheme) {
  return adapterRegistry.exportAll(theme);
}