import { ProviderRegistry } from './registry';
import { shadcnProvider } from './shadcn';
import { vscodeProvider } from './vscode';

export const providerRegistry = new ProviderRegistry();

providerRegistry.registerPreviewable(shadcnProvider);
providerRegistry.registerPreviewable(vscodeProvider);