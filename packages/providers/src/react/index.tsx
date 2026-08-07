import { AlacrittyPreview } from "@/components/preview/alacritty/alacritty-preview";
import { BananaPreview } from "@/components/preview/banana/banana-preview";
import { BrandGuidelinesPreview } from "@/components/preview/brand-guidelines/brand-guidelines-preview";
import { CodexPreview } from "@/components/preview/codex/codex-preview";
import { DesignSystemPreview } from "@/components/preview/design-system/design-system-preview";
import { GimpPreview } from "@/components/preview/gimp/gimp-preview";
import { KittyPreview } from "@/components/preview/kitty/kitty-preview";
import { ShadcnPreview } from "@/components/preview/shadcn/shadcn-preview";
import { ShikiPreview } from "@/components/preview/shiki/shiki-preview";
import { SlackPreview } from "@/components/preview/slack/slack-preview";
import { VSCodePreview } from "@/components/preview/vscode/vscode-preview";
import { WarpPreview } from "@/components/preview/warp/warp-preview";
import { WindowsTerminalPreview } from "@/components/preview/windows-terminal/windows-terminal-preview";
import { ZedPreview } from "@/components/preview/zed/zed-preview";
import {
  AlacrittyIcon,
  BananaIcon,
  CodexIcon,
  GIMPIcon,
  KittyIcon,
  ShadcnIcon,
  ShikiIcon,
  SlackIcon,
  VSCodeIcon,
  WarpIcon,
  WindowsTerminalIcon,
  ZedIcon,
} from "@/components/shared/icons";
import { alacrittyProvider } from "../providers/alacritty";
import { bananaProvider } from "../providers/banana";
import { brandGuidelinesProvider } from "../providers/brand-guidelines";
import { codexProvider } from "../providers/codex";
import { designSystemProvider } from "../providers/design-system";
import { gimpProvider } from "../providers/gimp";
import { kittyProvider } from "../providers/kitty";
import { shadcnProvider } from "../providers/shadcn";
import { shikiProvider } from "../providers/shiki";
import { slackProvider } from "../providers/slack";
import type { PreviewableProvider } from "../providers/types";
import { vscodeProvider } from "../providers/vscode";
import { warpProvider } from "../providers/warp";
import { windowsTerminalProvider } from "../providers/windows-terminal";
import { zedProvider } from "../providers/zed-provider";

export const previewableProviders: PreviewableProvider[] = [
  {
    ...bananaProvider,
    icon: BananaIcon,
    preview: { component: BananaPreview },
  },
  {
    ...alacrittyProvider,
    icon: AlacrittyIcon,
    preview: { component: AlacrittyPreview },
  },
  {
    ...brandGuidelinesProvider,
    preview: { component: BrandGuidelinesPreview },
  },
  {
    ...designSystemProvider,
    preview: { component: DesignSystemPreview },
  },
  {
    ...gimpProvider,
    icon: GIMPIcon,
    preview: { component: GimpPreview },
  },
  {
    ...codexProvider,
    icon: CodexIcon,
    preview: { component: CodexPreview },
  },
  {
    ...slackProvider,
    icon: SlackIcon,
    preview: { component: SlackPreview },
  },
  {
    ...kittyProvider,
    icon: KittyIcon,
    preview: { component: KittyPreview },
  },
  {
    ...warpProvider,
    icon: WarpIcon,
    preview: { component: WarpPreview },
  },
  {
    ...shikiProvider,
    icon: ShikiIcon,
    preview: { component: ShikiPreview },
  },
  {
    ...shadcnProvider,
    icon: ShadcnIcon,
    preview: { component: ShadcnPreview },
  },
  {
    ...windowsTerminalProvider,
    icon: WindowsTerminalIcon,
    preview: { component: WindowsTerminalPreview },
  },
  {
    ...vscodeProvider,
    icon: VSCodeIcon,
    preview: { component: VSCodePreview },
  },
  {
    ...zedProvider,
    icon: ZedIcon,
    preview: { component: ZedPreview },
  },
];

export function getPreviewableProviderReact(
  id: string,
): PreviewableProvider | undefined {
  return previewableProviders.find((provider) => provider.metadata.id === id);
}
