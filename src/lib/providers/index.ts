import type { TinteTheme } from "@/types/tinte";

export { alacrittyProvider } from "./alacritty";
export { gimpProvider } from "./gimp";
export { kittyProvider } from "./kitty";
// Export new Poline-based providers
export * from "./poline-base";
export { ProviderRegistry } from "./registry";
export * from "./shadcn";
export { slackProvider } from "./slack";
export * from "./types";
export * from "./vscode";
export { warpProvider } from "./warp";
export { windowsTerminalProvider } from "./windows-terminal";

import { alacrittyProvider } from "./alacritty";
import { gimpProvider } from "./gimp";
import { kittyProvider } from "./kitty";
import { ProviderRegistry } from "./registry";
import { shadcnProvider } from "./shadcn";
import { slackProvider } from "./slack";
import { vscodeProvider } from "./vscode";
import { warpProvider } from "./warp";
import { windowsTerminalProvider } from "./windows-terminal";

const registry = new ProviderRegistry();
registry.registerPreviewable(shadcnProvider);
registry.registerPreviewable(vscodeProvider);
registry.registerPreviewable(alacrittyProvider);
registry.registerPreviewable(kittyProvider);
registry.registerPreviewable(warpProvider);
registry.registerPreviewable(windowsTerminalProvider);
registry.registerPreviewable(gimpProvider);
registry.registerPreviewable(slackProvider);

export function getAvailableProviders() {
  return registry.getAll();
}

export function getPreviewableProviders() {
  return registry.getAllPreviewable();
}

export function getProvidersByCategory(category: string) {
  return registry.getByCategory(category as any);
}

export function convertTheme<T>(
  providerId: string,
  theme: TinteTheme,
): T | null {
  return registry.convert<T>(providerId, theme);
}

export function exportTheme(
  providerId: string,
  theme: TinteTheme,
  filename?: string,
) {
  return registry.export(providerId, theme, filename);
}

export function convertAllThemes(theme: TinteTheme) {
  return registry.convertAll(theme);
}

export function exportAllThemes(theme: TinteTheme) {
  return registry.exportAll(theme);
}

export function getProvider(providerId: string) {
  return registry.get(providerId);
}

export function getPreviewableProvider(providerId: string) {
  return registry.getPreviewable(providerId);
}

export function hasProvider(providerId: string): boolean {
  return registry.has(providerId);
}

export function hasPreviewableProvider(providerId: string): boolean {
  return registry.hasPreviewable(providerId);
}
