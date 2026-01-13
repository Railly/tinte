"use client";

import { Check, Code, Copy, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useShadcnOverrides,
  useShikiOverrides,
  useVSCodeOverrides,
} from "@/components/workbench/overrides-tab/hooks/use-provider-overrides";
import { useDockActions } from "@/hooks/use-dock-actions";
import { useThemeHistory } from "@/hooks/use-theme-history";
import { cn } from "@/lib";
import { duplicateTheme, renameTheme } from "@/lib/actions/themes";
import { importShadcnTheme } from "@/lib/theme-operations";
import { getProvider } from "@/lib/providers";
import { useThemeContext } from "@/providers/theme";
import type { TinteTheme } from "@/types/tinte";
import { HistoryControls } from "./history-controls";
import { ToolbarDialogs } from "./toolbar-dialogs";
import { ToolbarDropdownMenu } from "./toolbar-dropdown-menu";

interface WorkbenchToolbarProps {
  providerId?: string;
}

export function WorkbenchToolbar({
  providerId = "shadcn",
}: WorkbenchToolbarProps) {
  const router = useRouter();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showViewCodeDialog, setShowViewCodeDialog] = useState(false);
  const [isThemePublic, setIsThemePublic] = useState(false);
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);

  const {
    updateTinteTheme,
    activeTheme,
    user,
    isAuthenticated,
    canSave,
    saveCurrentTheme,
    deleteTheme,
    unsavedChanges,
    markAsSaved,
    isSaving,
    loadUserThemes,
    selectTheme,
    tinteTheme: theme,
    userThemes,
  } = useThemeContext();

  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });
  const currentProviderId = provider || providerId;
  const providerMeta = getProvider(currentProviderId);
  const providerName = providerMeta?.metadata.name || "Theme";

  const _shadcnOverrides = useShadcnOverrides();
  const vscodeOverrides = useVSCodeOverrides();
  const shikiOverrides = useShikiOverrides();

  const restoreTheme = React.useCallback(
    (
      themeToRestore: TinteTheme,
      shouldSelectTheme: boolean,
      themeToSelect?: any,
    ) => {
      if (shouldSelectTheme && themeToSelect) {
        selectTheme(themeToSelect);
      } else {
        updateTinteTheme("light", themeToRestore.light);
        updateTinteTheme("dark", themeToRestore.dark);
      }
    },
    [updateTinteTheme, selectTheme],
  );

  const { canUndo, canRedo, hasChanges, undo, redo, reset } = useThemeHistory(
    theme,
    activeTheme,
    restoreTheme,
  );

  const {
    isExporting,
    handleExport,
    handleCopyTheme,
    handlePrimaryAction,
    getPrimaryActionConfig,
    isTemporaryTheme,
  } = useDockActions({
    theme,
    providerId: currentProviderId,
    providerName,
    provider: providerMeta,
    themeId: activeTheme?.slug,
    canSave,
    themeName: activeTheme?.name,
    vscodeOverrides: vscodeOverrides.allOverrides,
    shikiOverrides: shikiOverrides.allOverrides,
  });

  const primaryActionConfig = getPrimaryActionConfig();
  const isOwnTheme = user && activeTheme?.user_id === user?.id;
  const isCustomUnsaved = activeTheme?.name === "Custom (unsaved)";

  const shouldShowUpdateButton =
    isAuthenticated && isOwnTheme && !isCustomUnsaved;
  const shouldShowSaveButton =
    (isAuthenticated && isCustomUnsaved) ||
    (!isAuthenticated && unsavedChanges);
  const shouldShowDuplicateButton =
    !shouldShowUpdateButton && !shouldShowSaveButton;

  useEffect(() => {
    if (activeTheme) {
      const themeIsPublic = (activeTheme as any)?.is_public ?? false;
      setIsThemePublic(themeIsPublic);
    }
  }, [activeTheme]);

  const handlePostSaveNavigation = async (savedTheme: any, action: string) => {
    try {
      await loadUserThemes();
      if (savedTheme) selectTheme(savedTheme);
      if (savedTheme?.slug) router.replace(`/workbench/${savedTheme.slug}`);
    } catch (error) {
      console.error(`Error in post-${action.toLowerCase()} navigation:`, error);
    }
  };

  const handleSaveTheme = async () => {
    if (!canSave) {
      toast.error("Please sign in to save themes");
      return;
    }
    if (!unsavedChanges) {
      toast.success("Theme is already up to date");
      return;
    }
    const isOwnSavedTheme =
      isOwnTheme &&
      activeTheme?.id &&
      !activeTheme.name?.includes("(unsaved)") &&
      activeTheme.name !== "Custom";

    if (isOwnSavedTheme) {
      try {
        const result = await saveCurrentTheme(
          undefined,
          undefined,
          undefined,
          activeTheme.id,
        );
        if (result.success && result.savedTheme) {
          toast.success("Theme updated successfully!");
          markAsSaved();
          selectTheme(result.savedTheme);
        } else {
          toast.error("Failed to update theme");
        }
      } catch (error) {
        console.error("Error updating theme:", error);
        toast.error("Error updating theme");
      }
      return;
    }
    setShowSaveDialog(true);
  };

  const handleSaveWithName = async (name: string, makePublic: boolean) => {
    try {
      const result = await saveCurrentTheme(name, makePublic);
      if (result.success && result.savedTheme) {
        toast.success("Theme saved successfully!");
        markAsSaved();
        await handlePostSaveNavigation(result.savedTheme, "Save");
      } else {
        toast.error("Failed to save theme");
      }
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error("Error saving theme");
      throw error;
    }
  };

  const getDefaultThemeName = () => {
    if (activeTheme.name.includes("(unsaved)")) {
      return activeTheme.name.replace(" (unsaved)", "");
    }
    if (activeTheme.name === "Custom" || activeTheme.name.includes("Custom")) {
      return "My Custom Theme";
    }
    return activeTheme.name;
  };

  const handleRenameTheme = async (newName: string) => {
    try {
      if (!activeTheme?.id) throw new Error("No theme ID");
      const result = await renameTheme(activeTheme.id, newName);
      if (!result.success)
        throw new Error(result.error || "Failed to rename theme");
      await loadUserThemes();
      if (result.theme?.slug) router.replace(`/workbench/${result.theme.slug}`);
      toast.success(`Theme renamed to "${newName}"!`);
    } catch (error) {
      console.error("Error renaming theme:", error);
      toast.error("Failed to rename theme");
      throw error;
    }
  };

  const getShareLink = () => {
    if (!activeTheme?.id) return "";
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/r/${activeTheme.slug}`;
  };

  const handleImportTheme = async (
    name: string,
    css: string,
    makePublic: boolean,
  ) => {
    try {
      const { tinteTheme, shadcnTheme } = importShadcnTheme(css);
      const response = await fetch("/api/themes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          concept: `Imported from CSS`,
          tinteTheme,
          shadcnTheme,
          makePublic,
        }),
      });
      if (!response.ok) throw new Error("Failed to save imported theme");
      const result = await response.json();
      if (!result.success || !result.savedTheme) {
        toast.error("Failed to save imported theme");
        return;
      }
      await loadUserThemes();
      if (result.savedTheme) selectTheme(result.savedTheme);
      if (result.savedTheme.slug)
        router.replace(`/workbench/${result.savedTheme.slug}`);
      toast.success(`"${name}" imported and saved successfully!`);
    } catch (error) {
      console.error("Error importing theme:", error);
      toast.error("Failed to import theme");
      throw error;
    }
  };

  const handleTogglePublic = async (makePublic: boolean) => {
    try {
      if (!activeTheme?.id) {
        toast.error("No theme selected");
        return;
      }
      const isOwner =
        (user && activeTheme?.user?.id === user?.id) ||
        (user && activeTheme?.author === "You");
      if (!isOwner) {
        toast.error("Only theme owners can make themes public");
        return;
      }
      setIsThemePublic(makePublic);
      const response = await fetch(`/api/themes/${activeTheme.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: makePublic }),
      });
      if (!response.ok) throw new Error("Failed to update theme visibility");
      const result = await response.json();
      if (!result.success)
        throw new Error(result.error || "Failed to update theme visibility");
      if (activeTheme) {
        selectTheme({ ...activeTheme, is_public: makePublic });
      }
      await loadUserThemes();
      toast.success(
        makePublic ? "✨ Theme is now public!" : "🔒 Theme is now private",
      );
    } catch (error) {
      console.error("Error toggling theme visibility:", error);
      toast.error("Failed to update theme visibility");
      setIsThemePublic(!makePublic);
    }
  };

  const handleDuplicateTheme = async (name: string, makePublic: boolean) => {
    try {
      if (!activeTheme?.id) throw new Error("No theme ID");
      const result = await duplicateTheme(activeTheme.id, name, makePublic, {
        author: activeTheme.author,
        provider: activeTheme.provider,
      });
      if (!result.success)
        throw new Error(result.error || "Failed to duplicate theme");
      toast.success(`Theme duplicated as "${name}"!`);
      if (result.theme) await handlePostSaveNavigation(result.theme, "Duplicate");
    } catch (error) {
      console.error("Error duplicating theme:", error);
      toast.error("Failed to duplicate theme");
      throw error;
    }
  };

  const handleDeleteTheme = async () => {
    try {
      if (!activeTheme?.id) throw new Error("No theme ID");
      const success = await deleteTheme(activeTheme.id);
      if (!success) throw new Error("Failed to delete theme");
      toast.success("Theme deleted successfully");
      if (userThemes.length > 0) {
        router.replace(`/workbench/${userThemes[0].slug}`);
      } else {
        router.replace("/workbench");
      }
    } catch (error) {
      console.error("Error deleting theme:", error);
      throw error;
    }
  };

  const PrimaryIcon = primaryActionConfig.icon;

  return (
    <div className="flex items-center gap-2 w-full">
      {providerMeta?.metadata.experimental && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Development mode — features might be broken
          </div>
        </div>
      )}

      <HistoryControls
        canUndo={canUndo}
        canRedo={canRedo}
        hasChanges={hasChanges}
        onUndo={undo}
        onRedo={redo}
        onReset={reset}
      />

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {shouldShowUpdateButton && (
          <Button
            variant={unsavedChanges ? "default" : "ghost"}
            size="sm"
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="h-8"
          >
            {unsavedChanges ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            )}
          </Button>
        )}

        {shouldShowSaveButton && (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              if (!isAuthenticated) {
                setShowSignInDialog(true);
                return;
              }
              handleSaveTheme();
            }}
            disabled={isSaving}
            className="h-8"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}

        {shouldShowDuplicateButton && (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              if (!isAuthenticated) {
                setShowSignInDialog(true);
                return;
              }
              setShowDuplicateDialog(true);
            }}
            className="h-8"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            if (isTemporaryTheme()) {
              if (!canSave) {
                toast.error(
                  "Please sign in to save themes and generate install commands",
                );
                return;
              }
              setShowSaveDialog(true);
              return;
            }
            await handlePrimaryAction();
            setShowCopiedFeedback(true);
            setTimeout(() => setShowCopiedFeedback(false), 2000);
          }}
          disabled={isExporting || (isTemporaryTheme() && !canSave)}
          className="h-8 relative overflow-hidden"
        >
          <div
            className={cn(
              "flex items-center transition-all duration-300",
              showCopiedFeedback
                ? "opacity-0 scale-75 blur-sm"
                : "opacity-100 scale-100 blur-0",
            )}
          >
            <PrimaryIcon className="h-4 w-4 mr-2" />
            {primaryActionConfig.label}
          </div>
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300",
              showCopiedFeedback
                ? "opacity-100 scale-100 blur-0"
                : "opacity-0 scale-75 blur-sm",
            )}
          >
            <Check className="h-4 w-4 mr-2" />
            Copied!
          </div>
        </Button>

        <div className="w-px h-6 bg-border" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowViewCodeDialog(true)}
          className="h-8"
        >
          <Code className="h-4 w-4 mr-2" />
          View Code
        </Button>

        <ToolbarDropdownMenu
          currentProviderId={currentProviderId}
          isOwnTheme={!!isOwnTheme}
          isAuthenticated={isAuthenticated}
          onExport={handleExport}
          onCopyTheme={handleCopyTheme}
          onImportClick={() => setShowImportDialog(true)}
          onShareClick={() => setShowShareDialog(true)}
          onRenameClick={() => setShowRenameDialog(true)}
          onDuplicateClick={() => setShowDuplicateDialog(true)}
          onDeleteClick={() => setShowDeleteDialog(true)}
          onSignInClick={() => setShowSignInDialog(true)}
        />
      </div>

      <ToolbarDialogs
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        showImportDialog={showImportDialog}
        setShowImportDialog={setShowImportDialog}
        showRenameDialog={showRenameDialog}
        setShowRenameDialog={setShowRenameDialog}
        showDuplicateDialog={showDuplicateDialog}
        setShowDuplicateDialog={setShowDuplicateDialog}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        showSignInDialog={showSignInDialog}
        setShowSignInDialog={setShowSignInDialog}
        showViewCodeDialog={showViewCodeDialog}
        setShowViewCodeDialog={setShowViewCodeDialog}
        handleSaveWithName={handleSaveWithName}
        handleTogglePublic={handleTogglePublic}
        handleImportTheme={handleImportTheme}
        handleRenameTheme={handleRenameTheme}
        handleDuplicateTheme={handleDuplicateTheme}
        handleDeleteTheme={handleDeleteTheme}
        getDefaultThemeName={getDefaultThemeName}
        getShareLink={getShareLink}
        isThemePublic={isThemePublic}
        isSaving={isSaving}
        themeName={activeTheme?.name}
      />
    </div>
  );
}
