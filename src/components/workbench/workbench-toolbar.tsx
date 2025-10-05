"use client";

import {
  Check,
  Code,
  Copy,
  Download,
  Edit3,
  FileText,
  Redo,
  RotateCcw,
  Save,
  Settings,
  Share2,
  Trash2,
  Undo,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeleteThemeDialog } from "@/components/shared/delete-theme-dialog";
import { DuplicateThemeDialog } from "@/components/shared/duplicate-theme-dialog";
import GithubIcon from "@/components/shared/icons/github";
import { ImportThemeDialog } from "@/components/shared/import-theme-dialog";
import { RenameThemeDialog } from "@/components/shared/rename-theme-dialog";
import { SaveThemeDialog } from "@/components/shared/save-theme-dialog";
import { ShareThemeDialog } from "@/components/shared/share-theme-dialog";
import { ViewCodeDialog } from "@/components/shared/view-code-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useShadcnOverrides,
  useVSCodeOverrides,
} from "@/components/workbench/tabs/overrides-tab/hooks/use-provider-overrides";
import { useDockActions } from "@/hooks/use-dock-actions";
import { useThemeHistory } from "@/hooks/use-theme-history";
import { cn } from "@/lib";
import { duplicateTheme, renameTheme } from "@/lib/actions/themes";
import { authClient } from "@/lib/auth-client";
import { importShadcnTheme } from "@/lib/import-theme";
import { convertTheme, exportTheme, getProvider } from "@/lib/providers";
import { useThemeContext } from "@/providers/theme";
import type { ShadcnTheme } from "@/types/shadcn";
import type { TinteTheme } from "@/types/tinte";

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
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);
  const [copiedAction, setCopiedAction] = useState<
    "file" | "theme" | "command" | null
  >(null);

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
    updateShadcnOverride,
    loadUserThemes,
    selectTheme,
    tinteTheme: theme,
  } = useThemeContext();

  const [provider] = useQueryState("provider", { defaultValue: "shadcn" });
  const currentProviderId = provider || providerId;
  const providerMeta = getProvider(currentProviderId);
  const providerName = providerMeta?.metadata.name || "Theme";

  const _shadcnOverrides = useShadcnOverrides();
  const vscodeOverrides = useVSCodeOverrides();

  // Restore theme to a specific state
  const restoreTheme = React.useCallback(
    (
      themeToRestore: TinteTheme,
      shouldSelectTheme: boolean,
      themeToSelect?: any,
    ) => {
      if (shouldSelectTheme && themeToSelect) {
        // Go back to the original theme (remove unsaved)
        selectTheme(themeToSelect);
      } else {
        // Just update the current theme
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
  });

  const primaryActionConfig = getPrimaryActionConfig();

  useEffect(() => {
    if (activeTheme) {
      const themeIsPublic = (activeTheme as any)?.is_public ?? false;
      setIsThemePublic(themeIsPublic);
    }
  }, [activeTheme]);

  const handlePostSaveNavigation = async (savedTheme: any, action: string) => {
    try {
      await loadUserThemes();
      if (savedTheme) {
        selectTheme(savedTheme);
      }
      if (savedTheme?.slug) {
        router.replace(`/workbench/${savedTheme.slug}`);
      }
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

    const isOwnTheme =
      (user && activeTheme?.user?.id === user?.id) ||
      (user && activeTheme?.author === "You");

    if (isOwnTheme && activeTheme?.id && activeTheme.id.startsWith("theme_")) {
      try {
        const result = await saveCurrentTheme();
        if (result.success) {
          toast.success("Theme updated successfully!");
          markAsSaved();
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
      if (!activeTheme?.id) {
        throw new Error("No theme ID");
      }

      const result = await renameTheme(activeTheme.id, newName);

      if (!result.success) {
        throw new Error(result.error || "Failed to rename theme");
      }

      await loadUserThemes();

      if (result.theme?.slug) {
        router.replace(`/workbench/${result.theme.slug}`);
      }

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
    const baseUrl = window.location.origin;
    return `${baseUrl}/r/${activeTheme.slug}`;
  };

  const handleImportTheme = async (
    name: string,
    css: string,
    makePublic: boolean,
  ) => {
    try {
      const { tinteTheme, shadcnTheme } = importShadcnTheme(css);

      const themeToSave = {
        id: `theme_${Date.now()}`,
        name,
        description: `Imported theme: ${name}`,
        author: "You",
        provider: "tinte" as const,
        downloads: 0,
        likes: 0,
        installs: 0,
        tags: ["custom", "imported"],
        createdAt: new Date().toISOString(),
        colors: {
          primary: tinteTheme.light.pr,
          secondary: tinteTheme.light.sc,
          background: tinteTheme.light.bg,
          accent: tinteTheme.light.ac_1,
          foreground: tinteTheme.light.tx,
        },
        rawTheme: tinteTheme,
        user: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            }
          : null,
      };

      if (shadcnTheme) {
        updateShadcnOverride(shadcnTheme);
      }

      selectTheme(themeToSave);

      const result = await saveCurrentTheme(name, makePublic, shadcnTheme);

      if (result.success && result.savedTheme) {
        await loadUserThemes();

        const updatedSavedTheme = {
          ...result.savedTheme,
          user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
              }
            : null,
          overrides: {
            shadcn: shadcnTheme,
            vscode: result.savedTheme.overrides?.vscode,
            shiki: result.savedTheme.overrides?.shiki,
          },
        };

        selectTheme(updatedSavedTheme);
        toast.success(`"${name}" imported and saved successfully!`);
      } else {
        toast.error("Failed to save imported theme");
      }
    } catch (error) {
      console.error("Error importing theme:", error);
      toast.error("Failed to import theme");
      throw error;
    }
  };

  const handleTogglePublic = async (makePublic: boolean) => {
    try {
      if (!activeTheme?.id) {
        console.error("No theme ID");
        toast.error("No theme selected");
        return;
      }

      const isOwnTheme =
        (user && activeTheme?.user?.id === user?.id) ||
        (user && activeTheme?.author === "You");

      if (!isOwnTheme) {
        toast.error("Only theme owners can make themes public");
        return;
      }

      setIsThemePublic(makePublic);

      const response = await fetch(`/api/themes/${activeTheme.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: makePublic }),
      });

      if (!response.ok) {
        throw new Error("Failed to update theme visibility");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update theme visibility");
      }

      if (activeTheme) {
        const updatedTheme = { ...activeTheme, is_public: makePublic };
        selectTheme(updatedTheme);
      }

      await loadUserThemes();

      if (makePublic) {
        toast.success("✨ Theme is now public!");
      } else {
        toast.success("🔒 Theme is now private");
      }
    } catch (error) {
      console.error("Error toggling theme visibility:", error);
      toast.error("Failed to update theme visibility");
      setIsThemePublic(!makePublic);
    }
  };

  const handleDuplicateTheme = async (name: string, makePublic: boolean) => {
    try {
      if (!activeTheme?.id) {
        throw new Error("No theme ID");
      }

      const result = await duplicateTheme(activeTheme.id, name, makePublic, {
        author: activeTheme.author,
        provider: activeTheme.provider,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to duplicate theme");
      }

      toast.success(`Theme duplicated as "${name}"!`);

      if (result.theme) {
        await handlePostSaveNavigation(result.theme, "Duplicate");
      }
    } catch (error) {
      console.error("Error duplicating theme:", error);
      toast.error("Failed to duplicate theme");
      throw error;
    }
  };

  const handleDeleteTheme = async () => {
    try {
      if (!activeTheme?.id) {
        throw new Error("No theme ID");
      }

      const success = await deleteTheme(activeTheme.id);

      if (!success) {
        throw new Error("Failed to delete theme");
      }

      toast.success("Theme deleted successfully");
    } catch (error) {
      console.error("Error deleting theme:", error);
      throw error;
    }
  };

  // Check ownership - only check user_id
  const isOwnTheme = user && activeTheme?.user_id === user?.id;

  // Check if it's a custom unsaved theme (modified someone else's theme)
  const isCustomUnsaved = activeTheme?.name === "Custom (unsaved)";

  // Button logic:
  // 1. Logged in + Own theme → Show Update button (becomes Save when modified)
  // 2. Logged in + Custom (unsaved) → Show Save button
  // 3. Logged in + Someone else's theme → Show Duplicate button
  // 4. Not logged in + unsaved changes → Show Save button (opens login modal)
  // 5. Not logged in + no unsaved changes → Show Duplicate button (opens login modal)

  const shouldShowUpdateButton =
    isAuthenticated && isOwnTheme && !isCustomUnsaved;
  const shouldShowSaveButton =
    (isAuthenticated && isCustomUnsaved) ||
    (!isAuthenticated && unsavedChanges);
  const shouldShowDuplicateButton =
    !shouldShowUpdateButton && !shouldShowSaveButton;

  const PrimaryIcon = primaryActionConfig.icon;

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Left: Undo/Redo + Reset */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            className="h-8 w-8"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            className="h-8 w-8"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Reset (only show when has changes) */}
        {hasChanges && (
          <>
            <div className="w-px h-6 bg-border" />
            <Button variant="ghost" size="sm" onClick={reset} className="h-8">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: Primary Actions */}
      <div className="flex items-center gap-2">
        {/* Update Button - Show for own themes */}
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

        {/* Save Button - Show for Custom (unsaved) or when not logged in with changes */}
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

        {/* Duplicate Button - Show for others' themes or when not logged in */}
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

        {/* Primary Action */}
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

            if (currentProviderId === "shadcn") {
              setShowCopiedFeedback(true);
              setTimeout(() => setShowCopiedFeedback(false), 2000);
            } else if (currentProviderId === "vscode") {
              toast.success("VSIX downloaded!");
            } else {
              toast.success("Theme copied!");
            }
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

        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[180px]">
            <DropdownMenuItem
              onClick={async () => {
                await handleExport();
                setCopiedAction("file");
                setTimeout(() => setCopiedAction(null), 2000);
              }}
              className="relative overflow-hidden"
            >
              <div
                className={cn(
                  "flex items-center transition-all duration-300",
                  copiedAction === "file"
                    ? "opacity-0 scale-75 blur-sm"
                    : "opacity-100 scale-100 blur-0",
                )}
              >
                <Download className="h-4 w-4 mr-2" />
                Download File
              </div>
              <div
                className={cn(
                  "absolute inset-0 flex items-center px-2 transition-all duration-300",
                  copiedAction === "file"
                    ? "opacity-100 scale-100 blur-0"
                    : "opacity-0 scale-75 blur-sm pointer-events-none",
                )}
              >
                <Check className="h-4 w-4 mr-2" />
                Downloaded!
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await handleCopyTheme();
                setCopiedAction("theme");
                setTimeout(() => setCopiedAction(null), 2000);
              }}
              className="relative overflow-hidden"
            >
              <div
                className={cn(
                  "flex items-center transition-all duration-300",
                  copiedAction === "theme"
                    ? "opacity-0 scale-75 blur-sm"
                    : "opacity-100 scale-100 blur-0",
                )}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Theme
              </div>
              <div
                className={cn(
                  "absolute inset-0 flex items-center px-2 transition-all duration-300",
                  copiedAction === "theme"
                    ? "opacity-100 scale-100 blur-0"
                    : "opacity-0 scale-75 blur-sm pointer-events-none",
                )}
              >
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowViewCodeDialog(true)}>
              <Code className="h-4 w-4 mr-2" />
              View Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Import CSS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowRenameDialog(true)}
              disabled={!isOwnTheme}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            {/* Only show Duplicate in dropdown if it's already your theme (not shown as primary button) */}
            {isOwnTheme && (
              <DropdownMenuItem
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowSignInDialog(true);
                    return;
                  }
                  setShowDuplicateDialog(true);
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              disabled={!isOwnTheme}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialogs */}
      <SaveThemeDialog
        isOpen={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSaveWithName}
        defaultName={getDefaultThemeName()}
        isLoading={isSaving}
      />

      <ShareThemeDialog
        isOpen={showShareDialog}
        onOpenChange={setShowShareDialog}
        onTogglePublic={handleTogglePublic}
        shareLink={getShareLink()}
        isPublic={isThemePublic}
      />

      <ImportThemeDialog
        isOpen={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImportTheme}
        isLoading={false}
      />

      <RenameThemeDialog
        isOpen={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        onRename={handleRenameTheme}
        currentName={getDefaultThemeName()}
        isLoading={false}
      />

      <DuplicateThemeDialog
        isOpen={showDuplicateDialog}
        onOpenChange={setShowDuplicateDialog}
        onDuplicate={handleDuplicateTheme}
        defaultName={`Copy of ${getDefaultThemeName()}`}
        isLoading={false}
        isBuiltInTheme={false}
      />

      <DeleteThemeDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={handleDeleteTheme}
        themeName={activeTheme?.name}
        isLoading={false}
      />

      <ViewCodeDialog
        isOpen={showViewCodeDialog}
        onOpenChange={setShowViewCodeDialog}
      />

      {/* Sign In Dialog */}
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Sign in to continue
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Create an account to duplicate themes, save your work, and sync
              across devices.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4 pb-2">
            <Button
              onClick={async () => {
                setIsSigningIn(true);
                try {
                  await authClient.signIn.social({
                    provider: "github",
                    callbackURL: window.location.href,
                  });
                } catch (error) {
                  console.error("Error signing in:", error);
                  toast.error("Failed to sign in. Please try again.");
                  setIsSigningIn(false);
                }
              }}
              disabled={isSigningIn}
              size="lg"
              className="w-full h-12 gap-3 text-base font-medium"
            >
              <GithubIcon className="h-5 w-5" />
              {isSigningIn ? "Signing in..." : "Continue with GitHub"}
            </Button>
            <p className="text-xs text-center text-muted-foreground px-4">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
