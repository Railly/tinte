import { motion } from "motion/react";
import { DockMain } from "@/components/shared/dock/dock-main";
import { DockExport } from "@/components/shared/dock/dock-export";
import { DockMore } from "@/components/shared/dock/dock-more";
import { DockContrast } from "@/components/shared/dock/dock-contrast";
import { InstallGuideModal } from "@/components/shared/dock/install-guide-modal";
import { SuccessAnimation } from "@/components/shared/dock/success-animation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDockActions } from "@/hooks/use-dock-actions";
import { useDockState } from "@/hooks/use-dock-state";
import { useThemeHistory } from "@/hooks/use-theme-history";
import { exportTheme, getProvider } from "@/lib/providers";
import { useThemeContext } from "@/providers/theme";
import type { TinteTheme } from "@/types/tinte";
import { useEffect, useRef, useState } from "react";

interface DockProps {
  theme: TinteTheme;
  providerId: string;
  providerName: string;
}

export function Dock({ theme, providerId, providerName }: DockProps) {
  const {
    dockState,
    navigateTo,
    navigateBack,
    canGoBack,
    dockRef,
    syncStatus,
    lastSaved
  } = useDockState();

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // Get theme context for updating theme
  const { updateTinteTheme } = useThemeContext();

  // Helper to update theme
  const updateTheme = (newTheme: TinteTheme) => {
    updateTinteTheme("light", newTheme.light);
    updateTinteTheme("dark", newTheme.dark);
  };

  const {
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    undo,
    redo,
    pushToHistory,
    reset,
  } = useThemeHistory(theme, updateTheme);

  const themeIdRef = useRef<string>();

  const provider = getProvider(providerId);
  const providerMetadata = provider?.metadata;

  const {
    isExporting,
    isSharing,
    handleExport,
    handleCopyTheme,
    handleShare,
    handleCopyCommand,
    handlePrimaryAction,
    getPrimaryActionConfig,
  } = useDockActions({ theme, providerId, providerName, provider });

  const prevThemeRef = useRef<string>();
  const isInitialLoad = useRef(true);

  // Reset history when switching to a different base theme
  useEffect(() => {
    const currentThemeId = `${theme.light.pr}-${theme.light.sc}-${theme.light.bg}`; // Simple theme ID based on key colors
    if (themeIdRef.current && themeIdRef.current !== currentThemeId) {
      reset(theme);
      isInitialLoad.current = true; // Reset initial load flag
    }
    themeIdRef.current = currentThemeId;
  }, [theme, reset]);

  useEffect(() => {
    const themeString = JSON.stringify(theme);
    
    // Skip the first load to avoid initial undo count
    if (isInitialLoad.current) {
      prevThemeRef.current = themeString;
      isInitialLoad.current = false;
      return;
    }
    
    if (prevThemeRef.current && prevThemeRef.current !== themeString) {
      pushToHistory(theme);
    }
    prevThemeRef.current = themeString;
  }, [theme, pushToHistory]);


  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setSuccessMessage("");
  };

  const showSuccessWithMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };


  // Code action - shows install guide modal
  const handleCodeAction = () => {
    setShowInstallGuide(true);
  };

  // Navigation handlers
  const handleNavigateToExport = () => navigateTo("export");
  const handleNavigateToMore = () => navigateTo("more");
  const handleNavigateToContrast = () => navigateTo("contrast");

  // Placeholder handlers for future features
  const handleReset = () => {
    // TODO: Reset theme to original state
    console.log("Reset theme");
    navigateBack();
  };

  const handleImport = () => {
    // TODO: Show import dialog
    console.log("Import theme");
    navigateBack();
  };

  const handleContrastCheck = () => {
    // TODO: Run contrast analysis
    console.log("Run contrast check");
  };

  const handleShowIssues = () => {
    // TODO: Show accessibility issues
    console.log("Show issues");
  };

  const handleWcagInfo = () => {
    // TODO: Show WCAG info
    console.log("Show WCAG info");
  };

  const handleExportReport = () => {
    // TODO: Export accessibility report
    console.log("Export report");
  };


  // Check if there are changes (simplified - could be more sophisticated)
  const hasChanges = undoCount > 0;

  const formatFileSize = (content: string) => {
    const bytes = new TextEncoder().encode(content).length;
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  };

  const exportedTheme = exportTheme(providerId, theme);
  const primaryActionConfig = getPrimaryActionConfig();

  const handleCopyCommandAction = async () => {
    if (providerId === "shadcn") {
      const command = "npx shadcn@latest add theme";
      await handleCopyCommand(command);
      showSuccessWithMessage("Command copied!");
    } else if (providerId === "vscode") {
      const vsixFilename =
        exportedTheme?.filename.replace(".json", ".vsix") || "theme.vsix";
      const command = `code --install-extension /path/to/${vsixFilename}`;
      await handleCopyCommand(command);
      showSuccessWithMessage("Command copied!");
    } else {
      await handleCopyTheme();
      showSuccessWithMessage("Theme copied!");
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
            width: dockState === "main" ? 420 : 200,
            height: dockState === "main" ? 48 : "auto",
          }}
        >
          {dockState === "main" ? (
            <DockMain
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              undoCount={undoCount}
              redoCount={redoCount}
              primaryActionConfig={primaryActionConfig}
              onPrimaryAction={handlePrimaryAction}
              isLoading={isExporting}
              onCopy={handleCopyTheme}
              onNavigateToExport={handleNavigateToExport}
              onNavigateToMore={handleNavigateToMore}
            />
          ) : dockState === "export" ? (
            <DockExport
              onBack={navigateBack}
              onDownload={handleExport}
              onCopyTheme={handleCopyTheme}
              onCopyCommand={handleCopyCommandAction}
              onShowInstallGuide={handleCodeAction}
              isExporting={isExporting}
              providerName={providerName}
            />
          ) : dockState === "more" ? (
            <DockMore
              onBack={navigateBack}
              onReset={handleReset}
              onImport={handleImport}
              onNavigateToContrast={handleNavigateToContrast}
              onShare={handleShare}
              isSharing={isSharing}
              hasChanges={hasChanges}
            />
          ) : dockState === "contrast" ? (
            <DockContrast
              onBack={navigateBack}
              onRunCheck={handleContrastCheck}
              onShowIssues={handleShowIssues}
              onShowWcagInfo={handleWcagInfo}
              onExportReport={handleExportReport}
              isRunning={false}
              issueCount={0}
            />
          ) : (
            <DockMain
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              undoCount={undoCount}
              redoCount={redoCount}
              primaryActionConfig={primaryActionConfig}
              onPrimaryAction={handlePrimaryAction}
              isLoading={isExporting}
              onCopy={handleCopyTheme}
              onNavigateToExport={handleNavigateToExport}
              onNavigateToMore={handleNavigateToMore}
            />
          )}
        </motion.div>
      </motion.div>

      <SuccessAnimation
        show={showSuccess}
        message={successMessage}
        onComplete={handleSuccessComplete}
      />

      <InstallGuideModal
        show={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
        providerId={providerId}
        providerName={providerName}
        onCopyCommand={() => {
          handleCopyCommandAction();
          setShowInstallGuide(false);
          showSuccessWithMessage("Command copied!");
        }}
      />
    </TooltipProvider>
  );
}
