import { ProviderRegistry } from './registry';

// Previewable providers (have UI preview components)
import { shadcnProvider } from './shadcn';
import { vscodeProvider } from './vscode';

// Export-only providers (conversion utilities without preview)
import { AlacrittyProvider } from './alacritty';
import { KittyProvider } from './kitty';
import { WarpProvider } from './warp';
import { WindowsTerminalProvider } from './windows-terminal';
import { GIMPProvider } from './gimp';
import { SlackProvider } from './slack';

export const providerRegistry = new ProviderRegistry();

// Register previewable providers (main UI components)
providerRegistry.registerPreviewable(shadcnProvider);
providerRegistry.registerPreviewable(vscodeProvider);

// Register export-only providers (utilities)
providerRegistry.register(new AlacrittyProvider());
providerRegistry.register(new KittyProvider());
providerRegistry.register(new WarpProvider());
providerRegistry.register(new WindowsTerminalProvider());
providerRegistry.register(new GIMPProvider());
providerRegistry.register(new SlackProvider());