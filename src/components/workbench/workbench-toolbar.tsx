"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Download,
  Save,
  Settings2,
  Share2,
  FileText,
  Undo,
  Redo,
  RotateCcw,
  Check,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteThemeDialog } from "@/components/shared/delete-theme-dialog";
import { DuplicateThemeDialog } from "@/components/shared/duplicate-theme-dialog";
import { ImportThemeDialog } from "@/components/shared/import-theme-dialog";
import { RenameThemeDialog } from "@/components/shared/rename-theme-dialog";
import { SaveThemeDialog } from "@/components/shared/save-theme-dialog";
import { ShareThemeDialog } from "@/components/shared/share-theme-dialog";
import { useShadcnOverrides, useVSCodeOverrides } from "@/components/workbench/tabs/overrides-tab/hooks/use-provider-overrides";
import { useThemeHistory } from "@/hooks/use-theme-history";
import { duplicateTheme, renameTheme } from "@/lib/actions/themes";
import { importShadcnTheme } from "@/lib/import-theme";
import { exportTheme, getProvider } from "@/lib/providers";
import { useThemeContext } from "@/providers/theme";
import type { TinteTheme } from "@/types/tinte";
import { useQueryState } from "nuqs";
import { useDockActions } from "@/hooks/use-dock-actions";

interface WorkbenchToolbarProps {
  providerId?: string;
}

export function WorkbenchToolbar({ providerId = "shadcn" }: WorkbenchToolbarProps) {
  const router = useRouter();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isThemePublic, setIsThemePublic] = useState(false);

  const {
    updateTinteTheme,
    activeTheme,
    user,
    isAuthenticated,
    isAnonymous,
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

  const shadcnOverrides = useShadcnOverrides();
  const vscodeOverrides = useVSCodeOverrides();

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
    reset,
  } = useThemeHistory(theme, updateTheme);

  const {
    isExporting,
    handleExport,
    handleCopyTheme,
    handleCopyCommand,
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
      activeTheme?.user?.id === user?.id ||
      activeTheme?.author === "You" ||
      (activeTheme?.id && activeTheme.id.startsWith("theme_") && user);

    if (isOwnTheme && activeTheme?.id && activeTheme.id.startsWith("theme_")) {
      try {
        const result = await saveCurrentTheme();
        if (result.success) {
          toast.success("Theme updated successfully!");
          reset(theme);
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
        reset(theme);
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

  const handleImportTheme = async (name: string, css: string, makePublic: boolean) => {
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
        user: user ? { id: user.id, name: user.name, email: user.email, image: user.image } : null,
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
          user: user ? { id: user.id, name: user.name, email: user.email, image: user.image } : null,
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
        activeTheme?.user?.id === user?.id ||
        activeTheme?.author === "You" ||
        (activeTheme?.id && activeTheme.id.startsWith("theme_") && user);

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

  // Check ownership
  const isOwnTheme =
    activeTheme?.user?.id === user?.id ||
    activeTheme?.author === "You" ||
    (activeTheme?.id && activeTheme.id.startsWith("theme_") && user);

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
        {(undoCount > 0 || unsavedChanges) && (
          <>
            <div className="w-px h-6 bg-border" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => reset(theme)}
              className="h-8"
            >
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
        {/* Save Button - Only show if logged in AND it's your theme */}
        {canSave && isOwnTheme && (
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
                Save
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            )}
          </Button>
        )}

        {/* Duplicate Button - PRIMARY if NOT your theme */}
        {!isOwnTheme && (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              if (!isAuthenticated) {
                toast.error("Please sign in to duplicate themes");
                router.push("/auth/signin");
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
                toast.error("Please sign in to save themes and generate install commands");
                return;
              }
              setShowSaveDialog(true);
              return;
            }

            await handlePrimaryAction();
            if (currentProviderId === "shadcn") {
              toast.success("Command copied!");
            } else if (currentProviderId === "vscode") {
              toast.success("VSIX downloaded!");
            } else {
              toast.success("Theme copied!");
            }
          }}
          disabled={isExporting || (isTemporaryTheme() && !canSave)}
          className="h-8"
        >
          <PrimaryIcon className="h-4 w-4 mr-2" />
          {primaryActionConfig.label}
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={async () => {
              await handleExport();
              toast.success("File downloaded!");
            }}>
              <Download className="h-4 w-4 mr-2" />
              Download File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              await handleCopyTheme();
              toast.success("Theme copied!");
            }}>
              Copy Theme
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              const command = currentProviderId === "shadcn"
                ? `npx shadcn@latest add ${window.location.origin}/r/${activeTheme?.slug}`
                : `bunx tinte ${activeTheme?.slug}`;
              await handleCopyCommand(command);
              toast.success("Command copied!");
            }}>
              Copy Install Command
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Import Theme
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Theme
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowRenameDialog(true)} disabled={!isOwnTheme}>
              Rename Theme
            </DropdownMenuItem>
            {/* Only show Duplicate in dropdown if it's already your theme (not shown as primary button) */}
            {isOwnTheme && (
              <DropdownMenuItem onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Please sign in to duplicate themes");
                  router.push("/auth/signin");
                  return;
                }
                setShowDuplicateDialog(true);
              }}>
                Duplicate Theme
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} disabled={!isOwnTheme}>
              Delete Theme
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
    </div>
  );
}
