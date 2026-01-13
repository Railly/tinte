"use client";

import { SignInButton } from "@clerk/nextjs";
import { DeleteThemeDialog } from "@/components/shared/delete-theme-dialog";
import { DuplicateThemeDialog } from "@/components/shared/duplicate-theme-dialog";
import { GithubIcon } from "@/components/shared/icons";
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

interface ToolbarDialogsProps {
  showSaveDialog: boolean;
  setShowSaveDialog: (open: boolean) => void;
  showShareDialog: boolean;
  setShowShareDialog: (open: boolean) => void;
  showImportDialog: boolean;
  setShowImportDialog: (open: boolean) => void;
  showRenameDialog: boolean;
  setShowRenameDialog: (open: boolean) => void;
  showDuplicateDialog: boolean;
  setShowDuplicateDialog: (open: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  showSignInDialog: boolean;
  setShowSignInDialog: (open: boolean) => void;
  showViewCodeDialog: boolean;
  setShowViewCodeDialog: (open: boolean) => void;
  handleSaveWithName: (name: string, makePublic: boolean) => Promise<void>;
  handleTogglePublic: (makePublic: boolean) => Promise<void>;
  handleImportTheme: (
    name: string,
    css: string,
    makePublic: boolean,
  ) => Promise<void>;
  handleRenameTheme: (newName: string) => Promise<void>;
  handleDuplicateTheme: (name: string, makePublic: boolean) => Promise<void>;
  handleDeleteTheme: () => Promise<void>;
  getDefaultThemeName: () => string;
  getShareLink: () => string;
  isThemePublic: boolean;
  isSaving: boolean;
  themeName?: string;
}

export function ToolbarDialogs({
  showSaveDialog,
  setShowSaveDialog,
  showShareDialog,
  setShowShareDialog,
  showImportDialog,
  setShowImportDialog,
  showRenameDialog,
  setShowRenameDialog,
  showDuplicateDialog,
  setShowDuplicateDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  showSignInDialog,
  setShowSignInDialog,
  showViewCodeDialog,
  setShowViewCodeDialog,
  handleSaveWithName,
  handleTogglePublic,
  handleImportTheme,
  handleRenameTheme,
  handleDuplicateTheme,
  handleDeleteTheme,
  getDefaultThemeName,
  getShareLink,
  isThemePublic,
  isSaving,
  themeName,
}: ToolbarDialogsProps) {
  return (
    <>
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
        themeName={themeName}
        isLoading={false}
      />

      <ViewCodeDialog
        isOpen={showViewCodeDialog}
        onOpenChange={setShowViewCodeDialog}
      />

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
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="w-full h-12 gap-3 text-base font-medium"
              >
                <GithubIcon className="h-5 w-5" />
                Continue with GitHub
              </Button>
            </SignInButton>
            <p className="text-xs text-center text-muted-foreground px-4">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
