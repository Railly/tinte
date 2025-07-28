import { ProviderAdapter } from './types';
import { shadcnAdapter } from './shadcn';
import { vscodeAdapter } from './vscode';

export const PROVIDERS: Record<string, ProviderAdapter> = {
  shadcn: shadcnAdapter,
  vscode: vscodeAdapter,
};

export * from './types';
export { shadcnAdapter, vscodeAdapter };