import { TinteTheme } from "@/types/tinte";
import { exportTheme, getProvider } from "@/lib/providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "motion/react";
import { useDockState } from "@/hooks/use-dock-state";
import { useDockActions } from "@/hooks/use-dock-actions";
import { DockCollapsed } from "@/components/shared/dock/dock-collapsed";
import { DockExpanded } from "@/components/shared/dock/dock-expanded";
import { DockInfo } from "@/components/shared/dock/dock-info";
import { useState } from "react";

interface DockProps {
  theme: TinteTheme;
  providerId: string;
  providerName: string;
}

export function Dock({ theme, providerId, providerName }: DockProps) {
  const { dockState, setDockState, dockRef } = useDockState();

  const provider = getProvider(providerId);
  const providerMetadata = provider?.metadata;

  const {
    isExporting,
    isSharing,
    handleCopyTheme,
    handleShare,
    handleCopyCommand,
    handlePrimaryAction,
    getPrimaryActionConfig,
  } = useDockActions({ theme, providerId, providerName, provider });


  const formatFileSize = (content: string) => {
    const bytes = new TextEncoder().encode(content).length;
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  };

  const exportedTheme = exportTheme(providerId, theme);
  const primaryActionConfig = getPrimaryActionConfig();

  const handleCopyCommandAction = async () => {
    if (providerId === 'shadcn') {
      const command = "npx shadcn@latest add theme";
      await handleCopyCommand(command);
    } else if (providerId === 'vscode') {
      const vsixFilename = exportedTheme?.filename.replace('.json', '.vsix') || 'theme.vsix';
      const command = `code --install-extension /path/to/${vsixFilename}`;
      await handleCopyCommand(command);
    } else {
      await handleCopyTheme();
    }
  };


  return (
    <TooltipProvider>
      {/* Main Dock */}
      <motion.div
        className="fixed bottom-4 left-1/2 z-50"
        initial={{ opacity: 0, y: 20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 20, x: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          ref={dockRef}
          layout
          transition={{
            type: "spring",
            bounce: 0.25,
            duration: 0.6,
          }}
          style={{ borderRadius: 32 }}
          className="flex items-center justify-center px-2 bg-black/90 backdrop-blur-sm border border-white/10 shadow-2xl"
          animate={{
            width: dockState === 'collapsed' ? 280 : dockState === 'expanded' ? 210 : 300,
            height: dockState === 'collapsed' ? 48 : dockState === 'expanded' ? 48 : 220,
          }}
        >
          {dockState === 'collapsed' ? (
            <DockCollapsed
              primaryActionConfig={primaryActionConfig}
              isExporting={isExporting}
              onPrimaryAction={handlePrimaryAction}
              onCopyCommand={handleCopyCommandAction}
              onShowInstallGuide={() => {}}
              onExpand={() => setDockState('expanded')}
            />
          ) : dockState === 'expanded' ? (
            <DockExpanded
              onShare={handleShare}
              onShowInfo={() => setDockState('info')}
              onCollapse={() => setDockState('collapsed')}
              isSharing={isSharing}
            />
          ) : (
            <DockInfo
              onCollapse={() => setDockState('collapsed')}
              providerMetadata={providerMetadata}
              provider={provider}
              exportedTheme={exportedTheme || undefined}
              formatFileSize={formatFileSize}
            />
          )}
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}