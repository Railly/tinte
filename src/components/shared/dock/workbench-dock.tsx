import { motion, useMotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { SaveThemeDialog } from "@/components/shared/save-theme-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  useShadcnOverrides,
  useVSCodeOverrides,
} from "@/components/workbench/tabs/overrides-tab/hooks/use-provider-overrides";
import { useDockActions } from "@/hooks/use-dock-actions";
import { useDockState } from "@/hooks/use-dock-state";
import { useThemeHistory } from "@/hooks/use-theme-history";
import { exportTheme, getProvider } from "@/lib/providers";
import { useThemeContext } from "@/providers/theme";
import type { TinteTheme } from "@/types/tinte";
// Import the reusable macOS-style Dock components
import { DockIcon } from "./base-dock";
import { DockExport } from "./dock-export";
import { DockMain } from "./dock-main";
import { DockMore } from "./dock-more";
import { InstallGuideModal } from "./install-guide-modal";
import { SuccessAnimation } from "./success-animation";

interface DockProps {
  theme: TinteTheme;
  providerId: string;
  providerName: string;
}

export function Dock({ theme, providerId, providerName }: DockProps) {
  const { dockState, navigateTo, navigateBack, canGoBack, dockRef } =
    useDockState();

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Get theme context for updating theme and persistence
  const {
    updateTinteTheme,
    activeTheme,
    user,
    isAuthenticated,
    isAnonymous,
    canSave,
    saveCurrentTheme,
    forkTheme,
    unsavedChanges,
    isSaving,
  } = useThemeContext();

  // Get override hooks for counting changes
  const shadcnOverrides = useShadcnOverrides();
  const vscodeOverrides = useVSCodeOverrides();

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

  const themeIdRef = useRef<string>(null);
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

  const prevThemeRef = useRef<string>(null);
  const isInitialLoad = useRef(true);

  // Reset history when switching to a different base theme
  useEffect(() => {
    const currentThemeId = `${theme.light.pr}-${theme.light.sc}-${theme.light.bg}`;
    if (themeIdRef.current && themeIdRef.current !== currentThemeId) {
      reset(theme);
      isInitialLoad.current = true;
    }
    themeIdRef.current = currentThemeId;
  }, [theme, reset]);

  useEffect(() => {
    const themeString = JSON.stringify(theme);

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

  // Navigation handlers
  const handleNavigateToExport = () => navigateTo("export");
  const handleNavigateToMore = () => navigateTo("more");

  // Code action - shows install guide modal
  const handleCodeAction = () => {
    setShowInstallGuide(true);
  };

  // Count total override changes across all providers (memoized to prevent loops)
  const shadcnCount = useMemo(() => {
    return Object.values(shadcnOverrides.allOverrides || {}).reduce(
      (total, modeOverrides) => total + Object.keys(modeOverrides || {}).length,
      0,
    );
  }, [shadcnOverrides.allOverrides]);

  const vscodeCount = useMemo(() => {
    return Object.values(vscodeOverrides.allOverrides || {}).reduce(
      (total, modeOverrides) => total + Object.keys(modeOverrides || {}).length,
      0,
    );
  }, [vscodeOverrides.allOverrides]);

  const overrideChanges = useMemo(() => {
    return shadcnCount + vscodeCount;
  }, [shadcnCount, vscodeCount]);

  const totalChanges = useMemo(() => {
    return undoCount + overrideChanges;
  }, [undoCount, overrideChanges]);

  const hasChanges = totalChanges > 0;

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

  // Check if this is a user's own editable theme (consistent with store logic)
  const isOwnTheme =
    activeTheme?.user?.id === user?.id ||
    activeTheme?.author === "You" ||
    (activeTheme?.id && activeTheme.id.startsWith("theme_") && user);

  const isCustomTheme =
    activeTheme?.name?.includes("Custom") ||
    activeTheme?.id?.startsWith("custom_");

  // Handle save theme - direct update for own themes, modal for custom unsaved
  const handleSaveTheme = async () => {
    if (!canSave) {
      toast.error("Please sign in to save themes");
      return;
    }

    if (!unsavedChanges) {
      toast.success("Theme is already up to date");
      return;
    }

    // Check if this is the user's own theme that already exists in the database
    const isOwnExistingTheme =
      isOwnTheme &&
      activeTheme?.id &&
      !activeTheme.id.startsWith("custom_") &&
      (activeTheme.id.startsWith("theme_") ||
        activeTheme.user?.id === user?.id);

    // If it's the user's own existing theme, update directly without modal
    if (isOwnExistingTheme) {
      try {
        const success = await saveCurrentTheme();
        if (success) {
          toast.success("Theme updated successfully!");
        } else {
          toast.error("Failed to update theme");
        }
      } catch (error) {
        console.error("Error updating theme:", error);
        toast.error("Error updating theme");
      }
      return;
    }

    // For custom unsaved themes or new themes, show the modal
    setShowSaveDialog(true);
  };

  // Handle actual save with name from modal
  const handleSaveWithName = async (name: string, makePublic: boolean) => {
    try {
      const success = await saveCurrentTheme(name, makePublic);
      if (success) {
        toast.success("Theme saved successfully!");
      } else {
        toast.error("Failed to save theme");
      }
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Error saving theme");
      throw error; // Re-throw so modal can handle error state
    }
  };

  // Get default theme name for modal
  const getDefaultThemeName = () => {
    if (activeTheme.name.includes("(unsaved)")) {
      return activeTheme.name.replace(" (unsaved)", "");
    }
    if (activeTheme.name === "Custom" || activeTheme.name.includes("Custom")) {
      return "My Custom Theme";
    }
    return activeTheme.name;
  };

  const mouseX = useMotionValue(Infinity);

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
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          initial={false}
          animate={{
            width: dockState === "main" ? "auto" : 320,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.4,
          }}
          style={{ borderRadius: 20 }}
          className="supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 flex items-end justify-center p-4 backdrop-blur-md border border-white/20 shadow-2xl"
        >
          <motion.div
            key={dockState}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {dockState === "main" ? (
              <DockMain
                mouseX={mouseX}
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
                onSave={handleSaveTheme}
                canSave={canSave}
                unsavedChanges={unsavedChanges}
                isSaving={isSaving}
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
                onReset={() => reset(theme)}
                onShare={handleShare}
                isSharing={isSharing}
                hasChanges={hasChanges}
                isAuthenticated={isAuthenticated}
                isAnonymous={isAnonymous}
              />
            ) : null}
          </motion.div>
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

      {/* Save Theme Dialog */}
      <SaveThemeDialog
        isOpen={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSaveWithName}
        defaultName={getDefaultThemeName()}
        isLoading={isSaving}
      />
    </TooltipProvider>
  );
}
