import { motion, useMotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { DuplicateThemeDialog } from "@/components/shared/duplicate-theme-dialog";
import { RenameThemeDialog } from "@/components/shared/rename-theme-dialog";
import { SaveThemeDialog } from "@/components/shared/save-theme-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  useShadcnOverrides,
  useVSCodeOverrides,
} from "@/components/workbench/tabs/overrides-tab/hooks/use-provider-overrides";
import { useDockActions } from "@/hooks/use-dock-actions";
import { useDockState } from "@/hooks/use-dock-state";
import { useThemeHistory } from "@/hooks/use-theme-history";
import { getFavoriteStatus, toggleFavorite } from "@/lib/actions/favorites";
import { duplicateTheme, renameTheme } from "@/lib/actions/themes";
import { exportTheme, getProvider } from "@/lib/providers";
import { useThemeContext } from "@/providers/theme";
import type { TinteTheme } from "@/types/tinte";
import { DockExport } from "./dock-export";
import { DockMain } from "./dock-main";
import { DockSettings } from "./dock-settings";
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
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    updateTinteTheme,
    activeTheme,
    user,
    isAuthenticated,
    isAnonymous,
    canSave,
    saveCurrentTheme,
    unsavedChanges,
    isSaving,
  } = useThemeContext();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated || !activeTheme?.id) return;

      try {
        const data = await getFavoriteStatus(activeTheme.id);
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [isAuthenticated, activeTheme?.id]);

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

  const {
    isExporting,
    handleExport,
    handleCopyTheme,
    handleCopyCommand,
    handlePrimaryAction,
    getPrimaryActionConfig,
  } = useDockActions({
    theme,
    providerId,
    providerName,
    provider,
    themeId: activeTheme?.id,
  });

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
  const handleNavigateToSettings = () => navigateTo("settings");

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
      const baseUrl = window.location.origin;
      const registryUrl = `${baseUrl}/api/r/${activeTheme?.id}`;
      const command = `npx shadcn@latest add ${registryUrl}`;
      await handleCopyCommand(command);
      showSuccessWithMessage("Command copied!");
    } else if (providerId === "vscode") {
      const baseUrl = window.location.origin;
      const registryUrl = `${baseUrl}/api/v/${activeTheme?.id}`;
      const command = `npx shadcn@latest add ${registryUrl}`;
      await handleCopyCommand(command);
      showSuccessWithMessage("Command copied!");
    } else {
      await handleCopyTheme();
      showSuccessWithMessage("Theme copied!");
    }
    // Return to main dock after copying
    navigateTo("main");
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

  // Handle rename theme
  const handleRenameTheme = async (newName: string) => {
    try {
      if (!activeTheme?.id) {
        throw new Error("No theme ID");
      }

      const result = await renameTheme(activeTheme.id, newName);

      if (!result.success) {
        throw new Error(result.error || "Failed to rename theme");
      }

      toast.success(`Theme renamed to "${newName}"!`);
    } catch (error) {
      console.error("Error renaming theme:", error);
      toast.error("Failed to rename theme");
      throw error;
    }
  };

  // Handle toggle favorite
  const handleToggleFavorite = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please sign in to add favorites");
        return;
      }

      if (!activeTheme?.id) {
        toast.error("No theme selected");
        return;
      }

      const result = await toggleFavorite(activeTheme.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to update favorite");
      }

      setIsFavorite(result.isFavorite ?? false);

      if (result.isFavorite) {
        toast.success("Added to favorites!");
      } else {
        toast.success("Removed from favorites!");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite");
    }
  };

  // Handle duplicate theme
  const handleDuplicateTheme = async (name: string, makePublic: boolean) => {
    try {
      if (!activeTheme?.id) {
        throw new Error("No theme ID");
      }

      const result = await duplicateTheme(activeTheme.id, name, makePublic);

      if (!result.success) {
        throw new Error(result.error || "Failed to duplicate theme");
      }

      toast.success(`Theme duplicated as "${name}"!`);
    } catch (error) {
      console.error("Error duplicating theme:", error);
      toast.error("Failed to duplicate theme");
      throw error;
    }
  };

  // Get default duplicate name
  const getDuplicateName = () => {
    return `Copy of ${getDefaultThemeName()}`;
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
            width: dockState === "main" ? 350 : 220,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.4,
          }}
          style={{ borderRadius: dockState === "main" ? 200 : 30 }}
          className="bg-foreground/90 text-background flex items-end justify-center p-4 backdrop-blur-md border border-foreground/20 shadow-2xl"
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
                onPrimaryAction={async () => {
                  await handlePrimaryAction();
                  if (providerId === "shadcn") {
                    showSuccessWithMessage("Command copied!");
                  } else {
                    showSuccessWithMessage("Theme copied!");
                  }
                }}
                isLoading={isExporting}
                onSave={handleSaveTheme}
                canSave={canSave}
                unsavedChanges={unsavedChanges}
                isSaving={isSaving}
                onNavigateToExport={handleNavigateToExport}
                onNavigateToSettings={handleNavigateToSettings}
                onReset={() => reset(theme)}
                hasChanges={hasChanges}
              />
            ) : dockState === "export" ? (
              <DockExport
                onBack={navigateBack}
                onDownload={async () => {
                  await handleExport();
                  showSuccessWithMessage("File downloaded!");
                  navigateTo("main");
                }}
                onCopyTheme={handleCopyTheme}
                onCopyThemeAndReturn={async () => {
                  await handleCopyTheme();
                  showSuccessWithMessage("Theme copied!");
                  navigateTo("main");
                }}
                onCopyCommand={handleCopyCommandAction}
                onShowInstallGuide={handleCodeAction}
                isExporting={isExporting}
                providerName={providerName}
              />
            ) : dockState === "settings" ? (
              <DockSettings
                onBack={navigateBack}
                onRename={() => setShowRenameDialog(true)}
                onToggleFavorite={handleToggleFavorite}
                onDuplicate={() => setShowDuplicateDialog(true)}
                isFavorite={isFavorite}
                isAuthenticated={isAuthenticated}
                isAnonymous={isAnonymous}
                isOwnTheme={isOwnTheme}
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

      {/* Rename Theme Dialog */}
      <RenameThemeDialog
        isOpen={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        onRename={handleRenameTheme}
        currentName={getDefaultThemeName()}
        isLoading={false}
      />

      {/* Duplicate Theme Dialog */}
      <DuplicateThemeDialog
        isOpen={showDuplicateDialog}
        onOpenChange={setShowDuplicateDialog}
        onDuplicate={handleDuplicateTheme}
        defaultName={getDuplicateName()}
        isLoading={false}
      />
    </TooltipProvider>
  );
}
