import { ProviderRegistry } from './registry';
import { shadcnProvider } from './shadcn';
import { vscodeProvider } from './vscode';

// Import new Poline-based providers
import { AlacrittyProvider } from './alacritty';
import { KittyProvider } from './kitty';
import { WarpProvider } from './warp';
import { WindowsTerminalProvider } from './windows-terminal';
import { GIMPProvider } from './gimp';
import { SlackProvider } from './slack';

export const providerRegistry = new ProviderRegistry();

// Register existing previewable providers
providerRegistry.registerPreviewable(shadcnProvider);
providerRegistry.registerPreviewable(vscodeProvider);

// Register new Poline-based providers
providerRegistry.register(new AlacrittyProvider());
providerRegistry.register(new KittyProvider());
providerRegistry.register(new WarpProvider());
providerRegistry.register(new WindowsTerminalProvider());
providerRegistry.register(new GIMPProvider());
providerRegistry.register(new SlackProvider());